import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogOut, Activity, DollarSign, Users, TrendingUp, Database } from "lucide-react";
import { DataTable } from "@/components/dashboard/DataTable";
import { ChartPanel } from "@/components/dashboard/ChartPanel";
import ChatBot from "@/components/dashboard/ChatBot";
import { useToast } from "@/hooks/use-toast";

interface ClientData {
  "Client Name": string;
  "Total Items": string;
  "Total Prices": string;
  "Status": string;
  "Email": string;
}

const Dashboard = () => {
  const [clientData, setClientData] = useState<ClientData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      const sheetUrl = "https://docs.google.com/spreadsheets/d/1CWGM9vw2CllskVpekbX3XQ7y9Hdyh70SaJjEstkACvM/export?format=csv&gid=0";
      
      // Try direct access first since sheet is public
      let response = await fetch(sheetUrl);
      let csvText = '';
      
      if (response.ok) {
        csvText = await response.text();
      } else {
        // Fallback to CORS proxy if direct access fails
        const proxyUrl = 'https://api.allorigins.win/get?url=';
        const encodedUrl = encodeURIComponent(sheetUrl);
        response = await fetch(proxyUrl + encodedUrl);
        const data = await response.json();
        
        if (!data.contents) {
          throw new Error('No data received from Google Sheets');
        }
        csvText = data.contents;
      }
      
      // Parse CSV
      const lines = csvText.split('\n').filter(line => line.trim());
      if (lines.length === 0) {
        throw new Error('Empty spreadsheet');
      }
      
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      
      const parsedData = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        return row;
      }).filter(row => Object.values(row).some(value => value !== ''));
      
      setClientData(parsedData);
      setLastUpdate(new Date());
      
      toast({
        title: "🔗 DATA SYNC COMPLETE",
        description: `Successfully loaded ${parsedData.length} client records from Google Sheets`,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      
      // Fallback to demo data if Google Sheets fails
      const demoData = [
        {
          "Client Name": "TechCorp Solutions",
          "Total Items": "25",
          "Total Prices": "$12,500",
          "Status": "Active",
          "Email": "contact@techcorp.com"
        },
        {
          "Client Name": "Digital Innovations Ltd",
          "Total Items": "18",
          "Total Prices": "$8,750",
          "Status": "Completed",
          "Email": "admin@digitalinnovations.com"
        },
        {
          "Client Name": "Future Systems Inc",
          "Total Items": "42",
          "Total Prices": "$21,000",
          "Status": "In Progress",
          "Email": "info@futuresystems.com"
        },
        {
          "Client Name": "Cyber Solutions",
          "Total Items": "33",
          "Total Prices": "$16,800",
          "Status": "Active",
          "Email": "hello@cybersolutions.com"
        },
        {
          "Client Name": "Quantum Enterprises",
          "Total Items": "15",
          "Total Prices": "$7,200",
          "Status": "Pending",
          "Email": "contact@quantum.com"
        }
      ];
      
      setClientData(demoData);
      setLastUpdate(new Date());
      
      toast({
        title: "⚠️ CONNECTION ISSUE",
        description: "Using demo data. Check Google Sheets permissions and try refreshing.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    toast({
      title: "SESSION TERMINATED",
      description: "Returning to secure terminal",
    });
    navigate("/");
  };

  const totalClients = clientData.length;
  const totalRevenue = clientData.reduce((sum, client) => {
    const price = parseFloat(client["Total Prices"]?.replace(/[^\d.-]/g, '') || '0');
    return sum + price;
  }, 0);
  const activeClients = clientData.filter(client => 
    client.Status?.toLowerCase() === 'active' || client.Status?.toLowerCase() === 'completed'
  ).length;
  const avgOrderValue = totalRevenue / (totalClients || 1);

  return (
    <div className="min-h-screen bg-background cyber-grid">
      {/* Header */}
      <header className="glass border-b border-glass-border p-4 animate-slide-in">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center glow-cyan">
              <Database className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-orbitron font-bold bg-gradient-primary bg-clip-text text-transparent">
                CLIENT ORBIT
              </h1>
              <p className="text-sm text-muted-foreground font-rajdhani">
                COMMAND CENTER DASHBOARD
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-orbitron text-neon-cyan">LAST SYNC</p>
              <p className="text-xs text-muted-foreground">
                {lastUpdate.toLocaleTimeString()}
              </p>
            </div>
            <Button 
              onClick={fetchData}
              variant="neon"
              size="sm"
              disabled={isLoading}
            >
              <Activity className="w-4 h-4 mr-2" />
              REFRESH
            </Button>
            <Button 
              onClick={handleLogout}
              variant="glass"
              size="sm"
              className="border-error text-error hover:bg-error hover:text-background font-orbitron"
            >
              <LogOut className="w-4 h-4 mr-2" />
              LOGOUT
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up">
          <Card className="bg-gray-900/90 backdrop-blur-sm border border-gray-700/30 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-orbitron text-gray-400">TOTAL CLIENTS</p>
                  <p className="text-3xl font-bold text-white">{totalClients}</p>
                </div>
                <Users className="w-8 h-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900/90 backdrop-blur-sm border border-gray-700/30 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-orbitron text-gray-400">TOTAL REVENUE</p>
                  <p className="text-3xl font-bold text-white">
                    ₨{totalRevenue.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900/90 backdrop-blur-sm border border-gray-700/30 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-orbitron text-gray-400">ACTIVE CLIENTS</p>
                  <p className="text-3xl font-bold text-white">{activeClients}</p>
                </div>
                <Activity className="w-8 h-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900/90 backdrop-blur-sm border border-gray-700/30 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-orbitron text-gray-400">AVG ORDER</p>
                  <p className="text-3xl font-bold text-white">
                    ₨{avgOrderValue.toFixed(0)}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartPanel clientData={clientData} />
        </div>

        {/* Data Table */}
        <Card className="glass-intense animate-fade-in-up">
          <CardHeader>
            <CardTitle className="font-orbitron text-neon-cyan flex items-center">
              <Database className="w-5 h-5 mr-2" />
              CLIENT DATABASE
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable data={clientData} isLoading={isLoading} />
          </CardContent>
        </Card>
      </div>
      
      {/* ChatBot Component */}
      <ChatBot onDataUpdate={(data) => {
        if (data && Array.isArray(data)) {
          setClientData(data);
          setLastUpdate(new Date());
        }
      }} />
    </div>
  );
};

export default Dashboard;