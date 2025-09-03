import React, { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { Icon } from '@grafana/ui';

interface ChatInputProps {
  currentInput: string;
  isGenerating: boolean;
  toolsLoading: boolean;
  setCurrentInput: (value: string) => void;
  sendMessage: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
}

export interface ChatInputRef {
  focus: () => void;
}

export const ChatInput = forwardRef<ChatInputRef, ChatInputProps>(
  ({ currentInput, isGenerating, toolsLoading, setCurrentInput, sendMessage, handleKeyPress }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(textareaRef.current.value.length, textareaRef.current.value.length);
        }
      },
    }));

    // Auto-resize textarea
    const autoResize = () => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
      }
    };

    useEffect(() => {
      autoResize();
    }, [currentInput]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCurrentInput(e.target.value);
      autoResize();
    };

    return (
      <div className="relative">
        <div className="border border-medium rounded-xl bg-background px-4 py-3 focus-within:border-primary focus-within:shadow-grafana-sm transition-all duration-200">
          <textarea
            ref={textareaRef}
            value={currentInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder="Ask me anything about your data, SQL queries, or observability..."
            disabled={isGenerating}
            rows={1}
            className="w-full resize-none bg-transparent border-0 text-sm text-primary placeholder-secondary focus:outline-none focus:ring-0 min-h-[24px] max-h-[200px]"
            style={{
              lineHeight: '1.5',
              height: 'auto',
            }}
          />
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-weak">
            <span className="text-xs text-secondary flex items-center">
              <Icon name="keyboard" size="xs" className="mr-1" />
              Enter to send • Shift+Enter for new line
            </span>
            {(isGenerating || toolsLoading) && (
              <div className="flex items-center text-xs text-secondary">
                {isGenerating ? (
                  <>
                    <div className="flex gap-1 mr-2">
                      <div
                        className="w-1 h-1 bg-current rounded-full animate-pulse"
                        style={{ animationDelay: '0ms' }}
                      ></div>
                      <div
                        className="w-1 h-1 bg-current rounded-full animate-pulse"
                        style={{ animationDelay: '150ms' }}
                      ></div>
                      <div
                        className="w-1 h-1 bg-current rounded-full animate-pulse"
                        style={{ animationDelay: '300ms' }}
                      ></div>
                    </div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <span>Loading tools...</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

ChatInput.displayName = 'ChatInput';
