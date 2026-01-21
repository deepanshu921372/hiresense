'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Send,
  Loader2,
  Sparkles,
  User,
  Bot,
  Trash2,
  Minimize2,
  MessageCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { cn } from '@/utils/helpers';
import { getIdToken } from '@/lib/firebase';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const suggestedQuestions = [
  "Show me remote React jobs",
  "Which jobs have highest match scores?",
  "How do I upload my resume?",
  "Find jobs requiring Python",
  "Where do I see my applications?",
  "How does matching work?",
];

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI job search assistant. I can help you find jobs, answer questions about the platform, and provide career advice. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom function
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Auto-scroll to bottom when messages change or chat opens
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Scroll to bottom when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      // Small delay to ensure DOM is ready
      setTimeout(scrollToBottom, 100);
    }
  }, [isOpen, isMinimized, scrollToBottom]);

  // Focus input when chat opens or when loading finishes
  useEffect(() => {
    if (isOpen && !isMinimized && !isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized, isLoading]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const token = await getIdToken();

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          message: content.trim(),
          history: messages.slice(-10).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || "I'm sorry, I couldn't process that request.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question);
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: "Chat cleared. How can I help you with your job search today?",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            "fixed bottom-6 right-6 z-50",
            "h-14 w-14 rounded-full",
            "bg-gradient-to-r from-primary to-purple-600",
            "text-white shadow-lg",
            "flex items-center justify-center",
            "hover:scale-110 hover:shadow-xl",
            "transition-all duration-300",
            "animate-in fade-in zoom-in"
          )}
          aria-label="Open AI Chat"
        >
          <MessageCircle className="h-6 w-6" />
          {/* Pulse effect */}
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white animate-pulse" />
        </button>
      )}

      {/* Backdrop to close chat on outside click */}
      {isOpen && !isMinimized && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card
          className={cn(
            "fixed z-50 shadow-2xl border-2 transition-all duration-300",
            isMinimized
              ? "bottom-6 right-6 w-72 h-14"
              : "bottom-6 right-6 w-[380px] sm:w-[400px] h-[min(calc(100vh-48px),600px)]",
            "flex flex-col bg-background py-0 gap-0",
            "animate-in fade-in slide-in-from-bottom-4"
          )}
        >
          {/* Header */}
          <div className="flex-shrink-0 flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-primary to-purple-600">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">HireSense AI</h3>
                {!isMinimized && (
                  <p className="text-xs text-muted-foreground">Your job search assistant</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              {!isMinimized && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                  onClick={clearChat}
                  title="Clear chat"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? "Expand" : "Minimize"}
              >
                <Minimize2 className={cn("h-4 w-4 transition-transform", isMinimized && "rotate-180")} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                onClick={() => setIsOpen(false)}
                title="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div
                ref={messagesContainerRef}
                className="flex-1 min-h-0 overflow-y-auto p-4"
              >
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-3",
                        message.role === 'user' ? "justify-end" : "justify-start"
                      )}
                    >
                      {message.role === 'assistant' && (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "rounded-2xl px-4 py-2.5 max-w-[80%] text-sm",
                          message.role === 'user'
                            ? "bg-gradient-to-r from-primary to-purple-600 text-white"
                            : "bg-muted"
                        )}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                      </div>
                      {message.role === 'user' && (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-primary to-purple-600">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                      <div className="rounded-2xl px-4 py-3 bg-muted flex items-center gap-2">
                        <div className="flex gap-1">
                          <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.3s]" />
                          <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.15s]" />
                          <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Suggested Questions */}
                  {messages.length === 1 && (
                    <div className="mt-6 space-y-3">
                      <p className="text-xs text-muted-foreground font-medium">Quick questions:</p>
                      <div className="flex flex-wrap gap-2">
                        {suggestedQuestions.map((question) => (
                          <Button
                            key={question}
                            variant="outline"
                            size="sm"
                            className="text-xs h-auto py-2 px-3 rounded-full hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors"
                            onClick={() => handleSuggestedQuestion(question)}
                          >
                            {question}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Scroll anchor */}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="flex-shrink-0 p-4 border-t bg-muted/30">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                    className="flex-1 rounded-full bg-background border-muted-foreground/20 focus-visible:ring-primary"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!input.trim() || isLoading}
                    className="rounded-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground text-center mt-2">
                  Powered by AI to help with your job search
                </p>
              </form>
            </>
          )}
        </Card>
      )}
    </>
  );
}
