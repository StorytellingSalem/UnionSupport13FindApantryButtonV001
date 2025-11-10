// server/index.ts
import express from 'express';
import dotenv from 'dotenv';
import { setupStaticServing } from './static-serve.js';
import { db } from './db.js';
import type { Pantry } from './types.js';
import type { Express } from 'express';

dotenv.config();

const app = express();

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Normalize a raw BASE_PATH or BASE_URL value so it is always a safe single pathname.
 */
function normalizeBasePath(raw?: string) {
  if (!raw) return '/';

  raw = String(raw).trim();

  if (raw.includes('://')) {
    try {
      const u = new URL(raw);
      const pathname = u.pathname || '/';
      return sanitizePathname(pathname);
    } catch {
      console.warn('normalizeBasePath: provided BASE_PATH/BASE_URL looks like a URL but failed to parse, falling back to path-only handling');
    }
  }

  const firstSlash = raw.indexOf('/');
  if (firstSlash > 0 && !raw.startsWith('/')) {
    const candidate = raw.slice(firstSlash);
    if (candidate) return sanitizePathname(candidate);
  }

  const candidatePath = raw.startsWith('/') ? raw : '/' + raw;
  return sanitizePathname(candidatePath);
}

function sanitizePathname(pathname: string) {
  let p = pathname.replace(/\/+$/g, '');
  if (p === '') p = '/';

  if (/[A-Za-z0-9.+-]+:\/\//.test(p) || p.includes(':')) {
    console.warn(`normalizeBasePath: sanitized path "${p}" still contains a scheme or colon; falling back to "/"`);
    return '/';
  }

  return p;
}

const BASE_PATH_RAW = process.env.BASE_PATH || process.env.BASE_URL;
const BASE_PATH = normalizeBasePath(BASE_PATH_RAW);

// Informational logs for debugging mount values
console.log(`Using raw BASE_PATH/BASE_URL = "${BASE_PATH_RAW ?? ''}"`);
console.log(`Using normalized BASE_PATH = "${BASE_PATH}"`);

/**
 * Mount API routes under BASE_PATH so app can run behind a reverse-proxy with a path prefix.
 */
const router = express.Router();

// API endpoints (mounted on router so we can attach a base path if needed)
router.get('/api/pantries', async (req, res) => {
  try {
    const pantries = await db.selectFrom('pantries').selectAll().where('deleted', '=', 0).execute();
    res.json(pantries);
  } catch (error) {
    console.error('Failed to get pantries:', error);
    res.status(500).json({ message: 'Failed to retrieve pantries' });
  }
});

router.post('/api/pantries', async (req, res) => {
  try {
    const newPantry: Omit<Pantry, 'id' | 'deleted'> = req.body;
    const result = await db.insertInto('pantries').values({ ...newPantry, deleted: 0 }).returningAll().executeTakeFirstOrThrow();
    res.status(201).json(result);
  } catch (error) {
    console.error('Failed to add pantry:', error);
    res.status(500).json({ message: 'Failed to add pantry' });
  }
});

router.get('/api/politicians', async (req, res) => {
  try {
    const politicians = await db.selectFrom('politicians').selectAll().execute();
    res.json(politicians);
  } catch (error) {
    console.error('Failed to get politicians:', error);
    res.status(500).json({ message: 'Failed to retrieve politicians' });
  }
});

router.get('/api/candidates', async (req, res) => {
  try {
    const candidates = await db.selectFrom('candidates').selectAll().execute();
    res.json(candidates);
  } catch (error) {
    console.error('Failed to get candidates:', error);
    res.status(500).json({ message: 'Failed to retrieve candidates' });
  }
});

router.get('/api/geocode', async (req, res) => {
  const address = req.query.address as string;
  if (!address) {
    res.status(400).json({ message: 'Address is required' });
    return;
  }

  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;

  try {
    const geoResponse = await fetch(url, {
      headers: {
        'User-Agent': 'PantryFinderApp/1.0'
      }
    });
    if (!geoResponse.ok) {
      throw new Error(`Nominatim API failed with status: ${geoResponse.status}`);
    }
    const geoData = await geoResponse.json();

    if (geoData && geoData.length > 0) {
      const { lat, lon } = geoData[0];
      res.json({ lat: parseFloat(lat), lng: parseFloat(lon) });
    } else {
      res.status(404).json({ message: 'Coordinates not found' });
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    res.status(500).json({ message: 'Geocoding service failed' });
  }
});

/**
 * Safe mount helper: tries to mount at a sanitized path and falls back to root on error.
 * Also logs the final mount path so startup reveals where handlers were attached.
 */
function safeMount(appInstance: Express, maybePath: string | undefined, handler: any) {
  const normalized = normalizeBasePath(maybePath);
  try {
    console.log(`Attempting to mount handler at "${normalized}"`);
    appInstance.use(normalized, handler);
    console.log(`Mounted handler at "${normalized}"`);
  } catch (err) {
    console.error(`safeMount: failed to mount handler at "${normalized}", mounting at "/" instead`, err);
    try {
      appInstance.use('/', handler);
      console.log(`Mounted handler at "/" as fallback`);
    } catch (err2) {
      console.error('safeMount: fallback mount at "/" also failed', err2);
      throw err2;
    }
  }
}

// Use safeMount so malformed values cannot crash path-to-regexp at startup
safeMount(app, BASE_PATH_RAW, router);

// Export a function to start the server
export async function startServer(port: number | string = process.env.PORT || 3001) {
  try {
    if (process.env.NODE_ENV === 'production') {
      // static serving will ignore API paths; setupStaticServing expects the app root, it uses __dirname logic
      setupStaticServing(app);
    }

    // Start listening
    const p = typeof port === 'string' ? parseInt(port, 10) : port;
    app.listen(p, () => {
      console.log(`API Server running on port ${p} (base path: ${BASE_PATH})`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

// Start the server directly if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('Starting server...');
  startServer(process.env.PORT || 3001);
}
