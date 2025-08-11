import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Search, IndianRupee } from 'lucide-react';

interface FilterPanelProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  priceFilter: string;
  setPriceFilter: (value: string) => void;
  brandFilter: string;
  setBrandFilter: (value: string) => void;
  brandOptions: string[];
  resetFilters: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  searchTerm,
  setSearchTerm,
  priceFilter,
  setPriceFilter,
  brandFilter,
  setBrandFilter,
  brandOptions,
  resetFilters,
}) => {
  return (
    <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
      <Card className="bg-card border-primary/20 sticky top-20">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-primary text-xl">Filters</CardTitle>
          <Button variant="link" onClick={resetFilters} className="p-0 h-auto text-sm text-muted-foreground hover:text-primary">
            Clear All
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="search-filter" className="font-semibold text-foreground text-sm">Search by Model</Label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search-filter"
                placeholder="e.g., iPhone 14"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          
          <Separator className="bg-primary/10" />
          
          <div>
            <Label htmlFor="price-filter" className="font-semibold text-foreground text-sm">Price Under</Label>
            <div className="relative mt-1">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="price-filter"
                placeholder="e.g., 25000"
                type="number"
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          
          <Separator className="bg-primary/10" />
          
          <div>
            <Label htmlFor="brand-filter" className="font-semibold text-foreground text-sm">Brand</Label>
            <Select value={brandFilter} onValueChange={setBrandFilter}>
              <SelectTrigger id="brand-filter" className="mt-1">
                <SelectValue placeholder="Select a brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {brandOptions.map(brand => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FilterPanel;