
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Candidate } from '../home/types';
import { countries } from './countries-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type OfficeCheckbox = 'House' | 'Senate' | 'Head of State/Gov' | 'State House' | 'State Senate' | 'Other';

const officeCheckboxes: OfficeCheckbox[] = ['House', 'Senate', 'Head of State/Gov', 'State House', 'State Senate', 'Other'];

interface RunningForOfficeFormProps {
  onSubmit: (candidate: Omit<Candidate, 'id' | 'lat' | 'lng'>) => Promise<Candidate | null>;
}

export function RunningForOfficeForm({ onSubmit }: RunningForOfficeFormProps) {
  const [selectedCountry, setSelectedCountry] = React.useState('');
  const [selectedState, setSelectedState] = React.useState('');
  const [selectedOffices, setSelectedOffices] = React.useState<OfficeCheckbox[]>([]);
  const [showOnMap, setShowOnMap] = React.useState(true);
  const [submissionResult, setSubmissionResult] = React.useState<{ state: string; country: string } | null>(null);

  const handleOfficeChange = (office: OfficeCheckbox, checked: boolean) => {
    setSelectedOffices(prev => 
      checked ? [...prev, office] : prev.filter(o => o !== office)
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const website = formData.get('website') as string;
    const phone = formData.get('phone') as string;

    if (name && selectedCountry && selectedState && selectedOffices.length > 0) {
      const candidateData: Omit<Candidate, 'id' | 'lat' | 'lng'> = {
        name,
        country: selectedCountry,
        state: selectedState,
        office: selectedOffices.includes('Senate') ? 'Senate' : 'House', // Simplified for DB
        office_type: selectedOffices.join(', '),
        website,
        phone,
        show_on_map: showOnMap ? 1 : 0,
        district: null, // Not collected in this form
        party: '', // Not collected
      };
      const result = await onSubmit(candidateData);
      if (result) {
        setSubmissionResult({ state: selectedState, country: selectedCountry });
      }
    } else {
      alert('Please fill out all required fields.');
    }
  };

  const getBallotAccessLink = () => {
    if (!submissionResult) return null;
    const { state, country } = submissionResult;
    if (country === 'USA') {
      return `https://ballotpedia.org/Ballot_access_for_major_and_minor_party_candidates_in_${state.replace(/ /g, '_')}`;
    }
    // Add other countries' logic here if needed
    return `https://en.wikipedia.org/wiki/Ballot_access#${country.replace(/ /g, '_')}`;
  };

  if (submissionResult) {
    const link = getBallotAccessLink();
    return (
      <div className="p-4 text-center">
        <h3 className="text-lg font-semibold mb-4">Thank you for your submission!</h3>
        <p className="mb-4">Here is a link to learn more about ballot access requirements for your area:</p>
        <a href={link} target="_blank" rel="noopener noreferrer" className="text-primary underline break-all">
          {link}
        </a>
        <Button onClick={() => setSubmissionResult(null)} className="mt-6">Submit another</Button>
      </div>
    );
  }

  const states = selectedCountry ? countries[selectedCountry] || [] : [];

  return (
    <div>
      <h3 className="text-lg font-semibold golden-text">Running for Office?</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Let us know who you are and what you're running for.
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name">Name?</Label>
          <Input id="name" name="name" required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="country">Country?</Label>
            <Select onValueChange={setSelectedCountry} value={selectedCountry}>
              <SelectTrigger id="country"><SelectValue placeholder="Select Country" /></SelectTrigger>
              <SelectContent>
                {Object.keys(countries).sort().map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="state">State?</Label>
            <Select onValueChange={setSelectedState} value={selectedState} disabled={!states.length}>
              <SelectTrigger id="state"><SelectValue placeholder="Select State/Province" /></SelectTrigger>
              <SelectContent>
                {states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Office?</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {officeCheckboxes.map(office => (
              <div key={office} className="flex items-center space-x-2">
                <Checkbox 
                  id={`office-${office}`} 
                  onCheckedChange={(checked) => handleOfficeChange(office, !!checked)}
                />
                <Label htmlFor={`office-${office}`}>{office}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="website">Optional: Website</Label>
          <Input id="website" name="website" />
        </div>

        <div>
          <Label htmlFor="phone">Optional: Want Union Resources? Type in your Number:</Label>
          <Input id="phone" name="phone" type="tel" />
          <p className="text-xs text-muted-foreground mt-1">
            The 12,000+ person uminion union Helps with: "Building a website/fundraising/advertising/and Helping you get on the Ballot" if you choose to provide a number for us to send you instructions on how to access these optional resources.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="show-on-map" checked={showOnMap} onCheckedChange={(checked) => setShowOnMap(!!checked)} />
          <Label htmlFor="show-on-map">Want a marker of you running; placed on the map?</Label>
        </div>

        <Button type="submit" className="w-full">Submit</Button>
      </form>
    </div>
  );
}
