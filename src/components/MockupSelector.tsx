import { cn } from "@/lib/utils";
import type { ProductMockup } from "@/types/fabric";
import { Shirt, Sofa, Check, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MockupSelectorProps {
  mockups: ProductMockup[];
  selectedMockup: ProductMockup | null;
  onSelect: (mockup: ProductMockup) => void;
  disabled?: boolean;
}

export const MockupSelector = ({
  mockups,
  selectedMockup,
  onSelect,
  disabled = false,
}: MockupSelectorProps) => {
  const handleValueChange = (value: string) => {
    const mockup = mockups.find((m) => m.id === value);
    if (mockup) {
      onSelect(mockup);
    }
  };

  const getCategoryIcon = (category: string) => {
    return category === "apparel" ? (
      <Shirt className="w-3.5 h-3.5" />
    ) : (
      <Sofa className="w-3.5 h-3.5" />
    );
  };

  return (
    <div className="panel p-4 animate-fade-in">
      <h3 className="text-sm font-medium text-foreground mb-3">
        Product Mockup
      </h3>

      <Select
        value={selectedMockup?.id}
        onValueChange={handleValueChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-full h-auto py-2">
          <SelectValue>
            {selectedMockup && (
              <div className="flex items-center gap-3">
                <img
                  src={selectedMockup.baseSrc}
                  alt={selectedMockup.name}
                  className="w-10 h-10 object-contain"
                />
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">
                    {selectedMockup.name}
                  </span>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    {getCategoryIcon(selectedMockup.category)}
                    <span className="text-xs capitalize">
                      {selectedMockup.category}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {mockups.map((mockup) => (
            <SelectItem
              key={mockup.id}
              value={mockup.id}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-3 py-1">
                <img
                  src={mockup.baseSrc}
                  alt={mockup.name}
                  className="w-10 h-10 object-contain"
                />
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">{mockup.name}</span>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    {getCategoryIcon(mockup.category)}
                    <span className="text-xs capitalize">
                      {mockup.category}
                    </span>
                  </div>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
