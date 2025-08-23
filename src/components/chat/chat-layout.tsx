'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatForm } from '@/components/chat/chat-form';
import { ChatMessage } from '@/components/chat/chat-message';
import type { Message, User } from '@/lib/types';
import { getAiResponse, logoutAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { cn } from '@/lib/utils';

export function ChatLayout({ user }: { user: User }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedMessages = localStorage.getItem(`chatHistory_${user.id}`);
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, [user.id]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`chatHistory_${user.id}`, JSON.stringify(messages));
    }
  }, [messages, user.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const formatMessageHistory = (msgs: Message[]): string => {
    return msgs
      .map((msg) =>
        msg.role === 'user'
          ? `User: ${msg.content}`
          : `Assistant: ${msg.content}`
      )
      .join('\n');
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    const messageHistory = formatMessageHistory(messages);

    try {
      const result = await getAiResponse(messageHistory, content);

      if (result.success && result.response) {
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: result.response,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error || 'An unknown error occurred.',
        });
        setMessages((prev) => prev.slice(0, -1));
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to reach the server. Please try again.',
      });
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    localStorage.removeItem(`chatHistory_${user.id}`);
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between p-4 border-b bg-card/75 backdrop-blur-lg text-card-foreground shadow-sm transition-all">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            <Bot className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold font-headline tracking-tight">
            Juabhi AI
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClearChat}
            aria-label="Clear chat"
            className="text-card-foreground hover:bg-card/80 hover:text-card-foreground"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8 border-2 border-primary/50">
                  <AvatarFallback className="font-bold text-card-foreground bg-card">
                    {user.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logoutAction()}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 md:p-6 space-y-6">
            {messages.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center h-[calc(100vh-210px)] text-center animate-in text-card-foreground">
                <Bot className="w-16 h-16 mb-4 text-muted-foreground" />
                <h2 className="text-2xl font-semibold font-headline">
                  Welcome, {user.name}!
                </h2>
                <p className="text-muted-foreground">
                  Start a conversation by typing a message below.
                </p>
              </div>
            )}
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} user={user} />
            ))}
            {isLoading && (
              <ChatMessage
                message={{
                  id: 'loading',
                  role: 'assistant',
                  content: '',
                }}
                isLoading
                user={user}
              />
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </main>
      <footer className="p-4 border-t bg-card/75 backdrop-blur-lg text-card-foreground">
        <ChatForm onSendMessage={handleSendMessage} isLoading={isLoading} />
      </footer>
    </div>
  );
}
