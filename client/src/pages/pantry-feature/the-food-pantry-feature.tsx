
import * as React from 'react';
import { PantryMap } from '../home/map';
import { PantryControls } from './pantry-controls';
import { Candidate, Pantry, Politician } from '../home/types';
import { Category } from './find-pantry-view';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TheFoodPantryFeatureProps {
  pantries: Pantry[];
  addPantry: (pantryData: Omit<Pantry, 'id' | 'deleted'>) => Promise<Pantry | null>;
}

export function TheFoodPantryFeature({ pantries, addPantry }: TheFoodPantryFeatureProps) {
  const [activeView, setActiveView] = React.useState<'find' | 'host' | 'details' | 'running'>('find');
  const [selectedPantry, setSelectedPantry] = React.useState<Pantry | null>(null);
  const [politicians, setPoliticians] = React.useState<Politician[]>([]);
  const [candidates, setCandidates] = React.useState<Candidate[]>([]);
  const [selectedCategories, setSelectedCategories] = React.useState<Category[]>(['food', 'clothing', 'resource', 'library']);

  React.useEffect(() => {
    fetch('/api/politicians')
      .then(res => res.json())
      .then(data => setPoliticians(data))
      .catch(console.error);
    
    fetch('/api/candidates')
      .then(res => res.json())
      .then(data => setCandidates(data))
      .catch(console.error);
  }, []);

  const handleViewDetails = (pantry: Pantry) => {
    setSelectedPantry(pantry);
    setActiveView('details');
  };

  const filteredPantries = pantries.filter(p => selectedCategories.includes(p.type));
  const filteredPoliticians = selectedCategories.includes('politicians') ? politicians : [];
  const filteredCandidates = selectedCategories.includes('candidates') ? candidates : [];

  return (
    <div className="flex h-full w-full bg-background">
      <div className="w-1/6 h-full border-r overflow-y-auto p-4 flex flex-col gap-4">
        <Button className="w-full" onClick={() => setActiveView('find')} variant={activeView === 'find' ? 'default' : 'secondary'}>
          Find a Pantry
        </Button>
        <Button className="w-full" onClick={() => setActiveView('host')} variant={activeView === 'host' ? 'default' : 'secondary'}>
          Know-of a Pantry? Host a Pantry?
        </Button>
        <Button 
          className={cn(
            "w-full",
            activeView === 'running' ? "bg-yellow-500 hover:bg-yellow-600 text-black" : "bg-yellow-400 hover:bg-yellow-500 text-black"
          )}
          onClick={() => setActiveView('running')}
        >
          Running for Office?
        </Button>
      </div>
      <div className="w-3/6 h-full">
        <PantryMap 
          pantries={filteredPantries} 
          politicians={filteredPoliticians}
          candidates={filteredCandidates}
          onViewDetails={handleViewDetails} 
        />
      </div>
      <div className="w-2/6 h-full border-l overflow-y-auto">
        <PantryControls 
          addPantry={addPantry} 
          activeView={activeView}
          setActiveView={setActiveView}
          selectedPantry={selectedPantry}
          selectedCategories={selectedCategories}
          onCategoryChange={setSelectedCategories}
        />
      </div>
    </div>
  );
}
