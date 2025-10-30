import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import cyberpunkHero from "@/assets/cyberpunk-hero.jpg";

const Login = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      if (credentials.username && credentials.password) {
        toast({
          title: "ACCESS GRANTED",
          description: "Welcome to Client Orbit Command Center",
        });
        navigate("/dashboard");
      } else {
        toast({
          title: "ACCESS DENIED",
          description: "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900/90 to-black">
        <div className="absolute inset-0 cyber-grid opacity-15"></div>
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-neon-cyan/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-neon-purple/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-neon-cyan/3 via-transparent to-neon-purple/3"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.8),transparent_70%)]"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-neon-cyan rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      <Card className="w-full max-w-md glass-intense hover-glow-cyan animate-fade-in-up relative z-10">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center glow-cyan">
            <div className="w-8 h-8 rounded-full border-2 border-white animate-border-spin"></div>
          </div>
          <div>
            <h1 className="text-3xl font-orbitron font-bold bg-gradient-primary bg-clip-text text-transparent">
              CLIENT ORBIT
            </h1>
            <p className="text-muted-foreground mt-2 font-rajdhani">
              SECURE ACCESS TERMINAL
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-orbitron text-neon-cyan">
                ACCESS ID
              </Label>
              <Input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                className="bg-glass border-glass-border text-foreground placeholder:text-muted-foreground focus:border-neon-cyan focus:ring-neon-cyan transition-all duration-300"
                placeholder="Enter access identifier"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-orbitron text-neon-cyan">
                SECURITY KEY
              </Label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                className="bg-glass border-glass-border text-foreground placeholder:text-muted-foreground focus:border-neon-cyan focus:ring-neon-cyan transition-all duration-300"
                placeholder="Enter security key"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              variant="cyber"
              className="w-full py-3"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>AUTHENTICATING...</span>
                </div>
              ) : (
                "INITIALIZE ACCESS"
              )}
            </Button>
          </form>
          
          <div className="text-center text-xs text-muted-foreground font-rajdhani">
            NEURAL NETWORK SECURE PROTOCOLS ACTIVE
          </div>
        </CardContent>
      </Card>
      
      <div className="absolute bottom-4 left-4 text-neon-cyan font-orbitron text-sm animate-pulse">
        SYSTEM STATUS: ONLINE
      </div>
      
      <div className="absolute top-4 right-4 text-neon-purple font-orbitron text-sm animate-glow-pulse">
        QUANTUM ENCRYPTION: ACTIVE
      </div>
    </div>
  );
};

export default Login;