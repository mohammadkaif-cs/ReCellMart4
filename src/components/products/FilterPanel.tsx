import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

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

const priceOptions = [
  { label: 'Any Price', value: 'all' },
  { label: 'Under ₹15,000', value: '0-15000' },
  { label: '₹15,000 - ₹30,000', value: '15000-30000' },
  { label: '₹30,000 - ₹50,000', value: '30000-50000' },
  { label: 'Over ₹50,000', value: '50000-1000000' },
];

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
        <CardHeader>
          <CardTitle className="text-primary text-2xl">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="search-filter" className="font-semibold text-foreground">Search</Label>
            <div className="relative">
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
          <Separator className="bg-primary/20" />
          <div>
            <Label htmlFor="price-filter" className="font-semibold text-foreground">Price Range</Label>
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger id="price-filter">
                <SelectValue placeholder="Select a price range" />
              </SelectTrigger>
              <SelectContent>
                {priceOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Separator className="bg-primary/20" />
          <div>
            <Label htmlFor="brand-filter" className="font-semibold text-foreground">Brand</Label>
            <Select value={brandFilter} onValueChange={setBrandFilter}>
              <SelectTrigger id="brand-filter">
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
          <Button variant="outline" onClick={resetFilters} className="w-full">
            <X className="mr-2 h-4 w-4" />
            Reset Filters
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FilterPanel;