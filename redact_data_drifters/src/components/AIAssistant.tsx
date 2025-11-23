import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Bot, Send, Sparkles, X } from 'lucide-react';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AIAssistant({ isOpen, onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your ChainForecast AI Assistant. I can help you understand your sales forecasts, customer segments, and provide insights. What would you like to know?'
    }
  ]);
  const [input, setInput] = useState('');

  const predefinedResponses: Record<string, string> = {
    'forecast': 'Based on our AI model analysis, we predict a steady growth trend over the next 4 weeks. Week 1 shows $72,000 in expected sales, climbing to $81,000 by Week 4. This represents a 15.7% growth trajectory. The confidence interval suggests a range between $66,000-$90,000.',
    'segments': 'Your customer base is divided into 5 key segments: Top Spenders (450 customers, $450k revenue), Loyal Customers (1,200 customers, $360k revenue), At-Risk Churn (800 customers, $120k revenue), New Customers (600 customers, $90k revenue), and Inactive customers (950 customers, $0 revenue). I recommend focusing retention efforts on the At-Risk Churn segment.',
    'offers': 'Top recommended offers: 1) VIP Exclusive for Top Spenders (15% off + free premium shipping, estimated $67.5k revenue), 2) Comeback discount for At-Risk Churn (20% off + free gift, estimated $24k revenue), 3) Loyalty rewards for regular customers (10% discount, estimated $36k revenue).',
    'top spenders': 'Your Top Spenders segment consists of 450 customers generating $450,000 in revenue with an average order value of $1,000. These high-value customers should receive VIP treatment with exclusive offers and premium support.',
    'retention': 'Customer retention is currently at 76%, up 5.3% from last period. However, 800 customers are at risk of churning. I recommend implementing a re-engagement campaign with personalized offers and proactive customer support.',
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const lowercaseInput = input.toLowerCase();
      let response = 'I understand you\'re asking about that. Based on the current data, I recommend reviewing the dashboard metrics for detailed insights. Would you like me to explain any specific chart or metric?';

      // Check for keywords
      for (const [key, value] of Object.entries(predefinedResponses)) {
        if (lowercaseInput.includes(key)) {
          response = value;
          break;
        }
      }

      const assistantMessage: Message = { role: 'assistant', content: response };
      setMessages(prev => [...prev, assistantMessage]);
    }, 800);

    setInput('');
  };

  const quickQuestions = [
    'Explain the forecast',
    'Analyze customer segments',
    'What are the best offers?',
    'How to improve retention?',
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 400 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 400 }}
          transition={{ type: 'spring', damping: 25 }}
          className="fixed right-0 top-0 bottom-0 w-96 z-50"
        >
          <Card className="h-full border-l border-blue-500/20 bg-gradient-to-br from-blue-950/95 to-blue-900/90 backdrop-blur-md rounded-none flex flex-col">
            <div className="p-4 border-b border-blue-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-400/30">
                  <Bot className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white">AI Assistant</h3>
                  <div className="flex items-center gap-1 text-xs text-green-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span>Online</span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-blue-300 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user' 
                      ? 'bg-blue-500/30 border border-blue-400/30 text-white' 
                      : 'bg-blue-900/30 border border-blue-500/20 text-blue-100'
                  }`}>
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-4 w-4 text-blue-400" />
                        <span className="text-xs text-blue-400">AI Response</span>
                      </div>
                    )}
                    <p className="text-sm">{message.content}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {messages.length === 1 && (
              <div className="p-4 border-t border-blue-500/20">
                <p className="text-xs text-blue-200/70 mb-2">Quick questions:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickQuestions.map((question) => (
                    <Button
                      key={question}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setInput(question);
                        setTimeout(() => handleSend(), 100);
                      }}
                      className="text-xs bg-blue-500/10 border-blue-400/20 text-blue-300 hover:bg-blue-500/20"
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 border-t border-blue-500/20">
              <div className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask me anything about your data..."
                  className="resize-none bg-blue-900/30 border-blue-500/20 text-white placeholder:text-blue-300/50"
                  rows={2}
                />
                <Button
                  onClick={handleSend}
                  className="bg-blue-500/30 border border-blue-400/30 hover:bg-blue-500/40 text-blue-300"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
