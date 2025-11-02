
import * as React from 'react';
import { HostPantryForm } from '../home/host-pantry-form';
import { Pantry } from '../home/types';
import { FindPantryView, Category } from './find-pantry-view';
import { PantryDetailsView } from './pantry-details-view';
import { RunningForOfficeForm } from './running-for-office-form';

interface PantryControlsProps {
  addPantry: (pantryData: Omit<Pantry, 'id' | 'deleted'>) => Promise<Pantry | null>;
  activeView: 'find' | 'host' | 'details' | 'running';
  setActiveView: (view: 'find' | 'host' | 'details' | 'running') => void;
  selectedPantry: Pantry | null;
  selectedCategories: Category[];
  onCategoryChange: (categories: Category[]) => void;
  filterOptions: any;
  setFilterOptions: React.Dispatch<React.SetStateAction<any>>;
}

export function PantryControls({ addPantry, activeView, setActiveView, selectedPantry, selectedCategories, onCategoryChange, filterOptions, setFilterOptions }: PantryControlsProps) {

  const handleAddPantry = async (pantryData: Omit<Pantry, 'id' | 'deleted'>) => {
    const newPantry = await addPantry(pantryData);
    if (newPantry) {
      setActiveView('find');
    }
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'find':
        return <FindPantryView selectedCategories={selectedCategories} onCategoryChange={onCategoryChange} filterOptions={filterOptions} setFilterOptions={setFilterOptions} />;
      case 'host':
        return <HostPantryForm onSubmit={handleAddPantry} isDialog={false} />;
      case 'details':
        return selectedPantry ? <PantryDetailsView pantry={selectedPantry} /> : <p>No pantry selected.</p>;
      case 'running':
        return <RunningForOfficeForm />;
      default:
        return <FindPantryView selectedCategories={selectedCategories} onCategoryChange={onCategoryChange} filterOptions={filterOptions} setFilterOptions={setFilterOptions} />;
    }
  };

  return (
    <div className="p-6">
      {activeView !== 'find' && <h2 className="text-2xl font-bold mb-4">PantryFinder</h2>}
      <div className="space-y-4">
        {renderActiveView()}
      </div>
    </div>
  );
}
