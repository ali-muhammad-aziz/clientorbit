import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, Package, DollarSign } from "lucide-react";

interface ClientData {
  "Client Name": string;
  "Total Items": string;
  "Total Prices": string;
  "Status": string;
  "Email": string;
}

interface DataTableProps {
  data: ClientData[];
  isLoading: boolean;
}

export const DataTable = ({ data, isLoading }: DataTableProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status?.toLowerCase() || '';
    
    if (normalizedStatus.includes('active') || normalizedStatus.includes('completed')) {
      return (
        <Badge className="bg-success/20 text-success border-success/30 font-orbitron">
          {status}
        </Badge>
      );
    } else if (normalizedStatus.includes('pending') || normalizedStatus.includes('in progress')) {
      return (
        <Badge className="bg-warning/20 text-warning border-warning/30 font-orbitron">
          {status}
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-muted/20 text-muted-foreground border-muted/30 font-orbitron">
          {status}
        </Badge>
      );
    }
  };

  return (
    <div className="space-y-4">
      {data.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground font-rajdhani">
          NO CLIENT DATA AVAILABLE
        </div>
      ) : (
        data.map((client, index) => (
          <div 
            key={index} 
            className="glass border border-glass-border rounded-lg p-6 hover-glow-cyan transition-all duration-300 hover:scale-[1.02] animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
              {/* Client Info */}
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center glow-cyan">
                  <span className="text-primary-foreground font-orbitron font-bold">
                    {client["Client Name"]?.charAt(0) || 'C'}
                  </span>
                </div>
                <div>
                  <h3 className="font-orbitron font-bold text-neon-cyan">
                    {client["Client Name"] || 'Unknown Client'}
                  </h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="w-3 h-3 mr-1" />
                    {client["Email"] || 'No email'}
                  </div>
                </div>
              </div>

              {/* Total Items */}
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4 text-neon-purple" />
                <div>
                  <p className="text-sm text-muted-foreground font-rajdhani">ITEMS</p>
                  <p className="font-bold text-neon-purple">
                    {client["Total Items"] || '0'}
                  </p>
                </div>
              </div>

              {/* Total Price */}
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-neon-green" />
                <div>
                  <p className="text-sm text-muted-foreground font-rajdhani">VALUE</p>
                  <p className="font-bold text-neon-green">
                    ${parseFloat(client["Total Prices"]?.replace(/[^\d.-]/g, '') || '0').toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Status */}
              <div>
                <p className="text-sm text-muted-foreground font-rajdhani mb-1">STATUS</p>
                {getStatusBadge(client["Status"])}
              </div>

              {/* Actions */}
              <div className="flex justify-end">
                <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse"></div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};