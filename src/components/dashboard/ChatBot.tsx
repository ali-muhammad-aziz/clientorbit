import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatBotProps {
  onDataUpdate?: (data: any) => void;
}

const ChatBot = ({ onDataUpdate }: ChatBotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I can help you with your sheet data. What would you like to know?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const webhookUrl = "https://dashboardwithn8n.app.n8n.cloud/webhook-test/sheetAcess";

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Check if the response contains sheet data to update
      if (data.sheetData && onDataUpdate) {
        onDataUpdate(data.sheetData);
        toast({
          title: "📊 DATA UPDATED",
          description: "Sheet data has been refreshed from chatbot response",
        });
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || data.message || 'Response received successfully',
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Error sending message to webhook:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error connecting to the webhook. Please try again later.',
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);

      toast({
        title: "🔌 CONNECTION ERROR",
        description: "Failed to connect to webhook endpoint",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-20 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-primary hover:scale-110 transition-all duration-300 glow-cyan"
          size="icon"
        >
          <Bot className="w-6 h-6 text-primary-foreground" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-20 right-6 z-50">
      <Card className="w-80 h-96 glass-intense border-neon-cyan/30 shadow-neon">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="font-orbitron text-neon-cyan flex items-center text-sm">
              <Bot className="w-4 h-4 mr-2" />
              AI ASSISTANT
            </CardTitle>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-neon-cyan"
            >
              ✕
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex flex-col h-full pb-4">
          <ScrollArea className="flex-1 mb-4" ref={scrollAreaRef}>
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-gradient-primary text-primary-foreground'
                        : 'glass border border-glass-border text-foreground'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.sender === 'bot' && (
                        <Bot className="w-4 h-4 text-neon-cyan mt-0.5 flex-shrink-0" />
                      )}
                      {message.sender === 'user' && (
                        <User className="w-4 h-4 text-primary-foreground mt-0.5 flex-shrink-0" />
                      )}
                      <div className="text-sm">{message.text}</div>
                    </div>
                    <div className="text-xs opacity-60 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="glass border border-glass-border rounded-lg p-3 max-w-[70%]">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-4 h-4 text-neon-cyan" />
                      <Loader2 className="w-4 h-4 animate-spin text-neon-cyan" />
                      <span className="text-sm text-muted-foreground">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your data..."
              className="flex-1 bg-input border-glass-border focus:border-neon-cyan text-sm"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              size="sm"
              className="bg-gradient-primary hover:scale-105 transition-transform"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatBot;