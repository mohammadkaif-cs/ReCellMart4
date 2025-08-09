import React from 'react';
import { motion } from 'framer-motion';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface FilterPanelProps {
  priceRange: [number, number];
  setPriceRange: (value: [number, number]) => void;
  selectedBrands: string[];
  setSelectedBrands: (brands: string[]) => void;
  brandOptions: string[];
}

const priceOptions = [
  { label: 'Any Price', value: '1000-80000' },
  { label: 'Under ₹15k', value: '0-15000' },
  { label: '₹15k - ₹30k', value: '15000-30000' },
  { label: '₹30k - ₹50k', value: '30000-50000' },
  { label: 'Over ₹50k', value: '50000-100000' },
];

const FilterPanel: React.FC<FilterPanelProps> = ({
  priceRange,
  setPriceRange,
  selectedBrands,
  setSelectedBrands,
  brandOptions,
}) => {
  const handlePriceChange = (value: string) => {
    if (value) {
      const [min, max] = value.split('-').map(Number);
      setPriceRange([min, max]);
    }
  };

  const currentPriceValue = `${priceRange[0]}-${priceRange[1]}`;

  return (
    <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
      <Card className="bg-card border-primary/20 sticky top-20">
        <CardHeader>
          <CardTitle className="text-primary text-2xl">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3 text-foreground">Price Range</h4>
            <ToggleGroup
              type="single"
              value={currentPriceValue}
              onValueChange={handlePriceChange}
              className="flex flex-wrap gap-2 justify-start"
            >
              {priceOptions.map(option => (
                <ToggleGroupItem
                  key={option.value}
                  value={option.value}
                  aria-label={option.label}
                  className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary border-border hover:bg-secondary"
                >
                  {option.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          <Separator className="bg-primary/20" />
          <div>
            <h4 className="font-semibold mb-3 text-foreground">Brand</h4>
            <ToggleGroup
              type="multiple"
              variant="outline"
              value={selectedBrands}
              onValueChange={setSelectedBrands}
              className="flex flex-wrap gap-2 justify-start"
            >
              {brandOptions.map(brand => (
                <ToggleGroupItem key={brand} value={brand} aria-label={`Toggle ${brand}`} className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary border-border hover:bg-secondary">
                  {brand}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FilterPanel;