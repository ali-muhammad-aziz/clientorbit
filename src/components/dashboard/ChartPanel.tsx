import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, Area, AreaChart, Tooltip } from "recharts";
import { TrendingUp, Users, DollarSign } from "lucide-react";

interface ClientData {
  "Client Name": string;
  "Total Items": string;
  "Total Prices": string;
  "Status": string;
  "Email": string;
}

interface ChartPanelProps {
  clientData: ClientData[];
}

export const ChartPanel = ({ clientData }: ChartPanelProps) => {
  // Prepare status distribution data
  const statusData = clientData.reduce((acc: Record<string, number>, client) => {
    const status = client["Status"] || 'Unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const statusChartData = Object.entries(statusData).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  // Prepare revenue data (mock time-based data for demonstration)
  const revenueData = clientData.slice(0, 10).map((client, index) => ({
    name: client["Client Name"]?.substring(0, 10) || `Client ${index + 1}`,
    revenue: parseFloat(client["Total Prices"]?.replace(/[^\d.-]/g, '') || '0'),
    items: parseInt(client["Total Items"] || '0'),
  }));

  const NEON_COLORS = [
    'hsl(var(--neon-cyan))',
    'hsl(var(--neon-purple))', 
    'hsl(var(--neon-pink))',
    'hsl(var(--neon-green))',
    'hsl(var(--neon-blue))',
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-intense p-3 rounded-lg border border-glass-border">
          <p className="font-orbitron text-neon-cyan">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {/* Status Distribution */}
      <Card className="glass-intense hover-glow-cyan animate-fade-in-up">
        <CardHeader>
          <CardTitle className="font-orbitron text-neon-cyan flex items-center">
            <Users className="w-5 h-5 mr-2" />
            CLIENT STATUS MATRIX
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusChartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {statusChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={NEON_COLORS[index % NEON_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {statusChartData.map((entry, index) => (
              <div key={entry.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: NEON_COLORS[index % NEON_COLORS.length] }}
                  />
                  <span className="text-sm font-rajdhani">{entry.name}</span>
                </div>
                <span className="text-sm font-bold" style={{ color: NEON_COLORS[index % NEON_COLORS.length] }}>
                  {entry.value}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Revenue Analysis */}
      <Card className="glass-intense hover-glow-purple animate-fade-in-up">
        <CardHeader>
          <CardTitle className="font-orbitron text-neon-purple flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            REVENUE ANALYSIS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--neon-purple))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--neon-purple))" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="hsl(var(--neon-purple))" 
                fillOpacity={1}
                fill="url(#revenueGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Items vs Revenue Correlation */}
      <Card className="glass-intense hover-glow-cyan animate-fade-in-up lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-orbitron text-neon-cyan flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            PERFORMANCE CORRELATION
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                yAxisId="left"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                yAxisId="left"
                dataKey="revenue" 
                fill="hsl(var(--neon-cyan))" 
                name="Revenue"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                yAxisId="right"
                dataKey="items" 
                fill="hsl(var(--neon-pink))" 
                name="Items"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  );
};