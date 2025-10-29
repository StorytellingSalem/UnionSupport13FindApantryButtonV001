
import * as React from 'react';
import { LandingPage } from './pages/landing/landing-page';
import { Candidate, Pantry } from './pages/home/types';

function App() {
  const [pantries, setPantries] = React.useState<Pantry[]>([]);
  const [candidates, setCandidates] = React.useState<Candidate[]>([]);

  React.useEffect(() => {
    fetch('/api/pantries')
      .then(res => res.json())
      .then(data => setPantries(data.filter(p => p.deleted === 0)))
      .catch(console.error);
    
    fetch('/api/candidates')
      .then(res => res.json())
      .then(data => setCandidates(data))
      .catch(console.error);
  }, []);

  const addPantry = async (pantryData: Omit<Pantry, 'id' | 'deleted'>) => {
    try {
      const response = await fetch('/api/pantries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pantryData),
      });
      if (!response.ok) {
        throw new Error('Failed to add pantry');
      }
      const newPantry = await response.json();
      setPantries(prev => [...prev, newPantry]);
      return newPantry;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const addCandidate = async (candidateData: Omit<Candidate, 'id' | 'lat' | 'lng'>) => {
    try {
      const response = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(candidateData),
      });
      if (!response.ok) {
        throw new Error('Failed to add candidate');
      }
      const newCandidate = await response.json();
      if (newCandidate.show_on_map) {
        setCandidates(prev => [...prev, newCandidate]);
      }
      return newCandidate;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  return (
    <LandingPage 
      pantries={pantries} 
      addPantry={addPantry} 
      candidates={candidates}
      addCandidate={addCandidate}
    />
  );
}

export default App;
