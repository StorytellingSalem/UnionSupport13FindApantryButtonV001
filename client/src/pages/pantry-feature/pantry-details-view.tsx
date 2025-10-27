
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Pantry } from '../home/types';

interface PantryDetailsViewProps {
  pantry: Pantry;
}

export function PantryDetailsView({ pantry }: PantryDetailsViewProps) {
  const [showCommentBox, setShowCommentBox] = React.useState(false);

  const handleVote = () => {
    setShowCommentBox(true);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-1">{pantry.name}</h2>
      <p className="text-sm text-muted-foreground mb-4">{pantry.address}</p>

      <div className="space-y-4">
        <div>
          <h4 className="font-semibold">Hours of Operation</h4>
          <p>{pantry.hours}</p>
        </div>
        <div>
          <h4 className="font-semibold">Notes</h4>
          <p>{pantry.notes}</p>
        </div>
      </div>

      <div className="mt-6 border-t pt-4 flex-col items-start gap-4">
        <div className="flex items-center gap-4">
          <span className="font-medium">Vouched for?</span>
          <Button variant="ghost" size="icon" onClick={handleVote}>
            <ThumbsUp className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleVote}>
            <ThumbsDown className="h-5 w-5" />
          </Button>
        </div>
        {showCommentBox && (
          <div className="w-full space-y-2 mt-4">
            <Label htmlFor="comment">Leave a comment? (optional)</Label>
            <Textarea id="comment" placeholder="Share your experience..." maxLength={500} />
            <Button>Submit Feedback</Button>
          </div>
        )}
      </div>
    </div>
  );
}
