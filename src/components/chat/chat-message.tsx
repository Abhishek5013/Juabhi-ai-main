'use client';

import { Bot, User as UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { Message, User } from '@/lib/types';

export function ChatMessage({
  message,
  isLoading,
  user,
}: {
  message: Message;
  isLoading?: boolean;
  user: User;
}) {
  const { role, content } = message;
  const isAssistant = role === 'assistant';

  return (
    <div
      className={cn(
        'flex items-start gap-3 animate-in',
        !isAssistant && 'flex-row-reverse'
      )}
    >
      <Avatar className="h-9 w-9 border-2 border-primary/20">
        <AvatarFallback
          className={cn(
            isAssistant
              ? 'bg-primary/10 text-primary'
              : 'bg-card text-card-foreground'
          )}
        >
          {isAssistant ? (
            <Bot className="h-5 w-5" />
          ) : (
            user.name?.charAt(0).toUpperCase() || <UserIcon className="h-5 w-5" />
          )}
        </AvatarFallback>
      </Avatar>
      <div
        className={cn(
          'max-w-[75%] rounded-lg p-3 text-sm shadow-sm',
          isAssistant ? 'bg-card text-card-foreground' : 'bg-primary text-primary-foreground'
        )}
      >
        {isLoading ? (
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-current delay-0"></span>
            <span className="h-2 w-2 animate-pulse rounded-full bg-current delay-150"></span>
            <span className="h-2 w-2 animate-pulse rounded-full bg-current delay-300"></span>
          </div>
        ) : (
          content
            .split('\n')
            .map((line, i) => (
              <p key={i} className="whitespace-pre-wrap">
                {line}
              </p>
            ))
        )}
      </div>
    </div>
  );
}
