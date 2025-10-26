
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { HostPantryForm } from './host-pantry-form';
import { PantryMap } from './map';

export function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-slate-900 text-foreground">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">PantryFinder</h1>
        <nav>
          <Button variant="ghost">Login</Button>
        </nav>
      </header>
      <main className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-5xl font-extrabold mb-4 leading-tight">
          Find, Share, and Support
          <br />
          <span className="text-primary">Local Food Pantries</span>
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Our community-driven map helps you locate food pantries, offer your space to host one, or find where your help is needed most.
        </p>
        <div className="flex justify-center gap-4 mb-12">
          <Button size="lg" className="transition-transform transform hover:scale-105">Find a Pantry</Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" variant="secondary" className="transition-transform transform hover:scale-105">Host a Pantry</Button>
            </DialogTrigger>
            <HostPantryForm />
          </Dialog>
        </div>
        <Card className="w-full max-w-4xl mx-auto text-left shadow-2xl">
          <CardHeader>
            <CardTitle>Pantry Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-muted rounded-lg">
              <PantryMap />
            </div>
          </CardContent>
        </Card>
      </main>
      <footer className="container mx-auto px-4 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} PantryFinder. All rights reserved.</p>
      </footer>
    </div>
  );
}
