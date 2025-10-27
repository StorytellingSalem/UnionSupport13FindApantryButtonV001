
import * as React from 'react';
import { LandingPage } from './pages/landing/landing-page';
import { initialPantries } from './pages/home/initial-pantries';
import { Pantry } from './pages/home/types';

function App() {
  const [pantries, setPantries] = React.useState<Pantry[]>(initialPantries);

  const addPantry = (pantryData: Omit<Pantry, 'id'>) => {
    const newPantry = { ...pantryData, id: Date.now() };
    setPantries(prev => [...prev, newPantry]);
    return newPantry;
  };

  // The router is removed as there is only one page now.
  // If you need to add more pages, you can re-introduce react-router-dom
  return (
    <LandingPage pantries={pantries} addPantry={addPantry} />
  );
}

export default App;
