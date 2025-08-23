'use client';

import { useState, useRef, type FormEvent } from 'react';
import { SendHorizonal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ChatFormProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function ChatForm({ onSendMessage, isLoading }: ChatFormProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextareaInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    setInput(e.currentTarget.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight =
        parseFloat(getComputedStyle(textareaRef.current).maxHeight) ||
        Infinity;
      textareaRef.current.style.height = `${Math.min(
        scrollHeight,
        maxHeight
      )}px`;
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-start gap-4">
      <Textarea
        ref={textareaRef}
        value={input}
        onInput={handleTextareaInput}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="flex-1 resize-none overflow-y-auto max-h-32 text-white placeholder:text-gray-300"
        rows={1}
        disabled={isLoading}
        aria-label="Chat message input"
      />
      <Button
        type="submit"
        size="icon"
        disabled={isLoading || !input.trim()}
        aria-label="Send message"
        className="shrink-0"
      >
        <SendHorizonal className="w-5 h-5" />
      </Button>
    </form>
  );
}
