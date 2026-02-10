import { cn } from "@/lib/utils";
import type { FabricTexture } from "@/types/fabric";

interface FabricSelectorProps {
  fabrics: FabricTexture[];
  selectedFabric: FabricTexture | null;
  onSelect: (fabric: FabricTexture) => void;
}

export const FabricSelector = ({
  fabrics,
  selectedFabric,
  onSelect,
}: FabricSelectorProps) => {
  return (
    <div className="panel p-3 animate-fade-in">
      <h3 className="text-sm font-medium text-foreground mb-2">
        Fabric Patterns
      </h3>
      <div className="grid grid-cols-3 gap-1.5">
        {fabrics.map((fabric) => (
          <button
            key={fabric.id}
            onClick={() => onSelect(fabric)}
            className={cn(
              "fabric-thumbnail aspect-square transition-transform hover:scale-105",
              selectedFabric?.id === fabric.id && "selected",
            )}
            title={fabric.name}
          >
            <img
              src={fabric.thumbnail}
              alt={fabric.name}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};
