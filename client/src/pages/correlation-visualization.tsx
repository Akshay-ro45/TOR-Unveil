import { useQuery } from "@tanstack/react-query";
import { Correlation, TorNode } from "@shared/schema";
import { CorrelationNetworkViz } from "@/components/correlation-network-viz";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

export default function CorrelationVisualization() {
  const [, navigate] = useLocation();

  const { data: correlations, isLoading: correlationsLoading } = useQuery<Correlation[]>({
    queryKey: ["/api/correlations"],
  });

  const { data: nodes, isLoading: nodesLoading } = useQuery<TorNode[]>({
    queryKey: ["/api/tor-nodes"],
  });

  const isLoading = correlationsLoading || nodesLoading;

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/correlation")}
          data-testid="button-back-to-correlation"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Correlation
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Correlation Network Visualization</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Visual representation of all entry and exit node correlations
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-96 w-full" />
        </div>
      ) : !correlations || correlations.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-md">
          <p className="text-muted-foreground mb-4">No correlations available to visualize</p>
          <Button onClick={() => navigate("/correlation")} data-testid="button-go-to-correlation">
            Go to Node Correlation
          </Button>
        </div>
      ) : !nodes || nodes.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-md">
          <p className="text-muted-foreground mb-4">No node data available for visualization</p>
          <Button onClick={() => navigate("/collection")} data-testid="button-go-to-collection">
            Go to Data Collection
          </Button>
        </div>
      ) : (
        <CorrelationNetworkViz correlations={correlations} nodes={nodes} />
      )}
    </div>
  );
}
