import { llm } from '@grafana/llm';
import { partition, lastValueFrom, finalize, startWith } from 'rxjs';
import { ChatMessage } from './types';

export const useStreamManager = (
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  handleToolCalls: (
    toolCalls: Array<{ function: { name: string; arguments: string }; id: string }>,
    messages: llm.Message[]
  ) => Promise<void>,
  formatToolsForOpenAI: (tools: any[]) => any[]
) => {
  const handleStreamingChatWithHistory = async (messages: llm.Message[], tools: any[]) => {
    let stream = llm.streamChatCompletions({
      model: llm.Model.LARGE,
      messages,
      tools: formatToolsForOpenAI(tools),
    });

    let [toolCallsStream, otherMessages] = partition(
      stream,
      (chunk: llm.ChatCompletionsResponse<llm.ChatCompletionsChunk>) => llm.isToolCallsMessage(chunk.choices[0].delta)
    );

    const subscribeToContentMessages = (contentStream: typeof otherMessages, isFirstChunk = false): void => {
      let streamWithOptions = contentStream.pipe(
        llm.accumulateContent(),
        finalize(() => {
          console.log('stream finalized');
        })
      );

      if (isFirstChunk) {
        const firstMessage: Partial<llm.ChatCompletionsResponse<llm.ChatCompletionsChunk>> = {
          choices: [{ delta: { role: 'assistant', content: '' } }],
        };
        //@ts-expect-error
        streamWithOptions = streamWithOptions.pipe(startWith(firstMessage));
      }

      streamWithOptions.subscribe((content) => {
        if (typeof content === 'string') {
          setChatHistory((prev) =>
            prev.map((msg, idx) => (idx === prev.length - 1 && msg.role === 'assistant' ? { ...msg, content } : msg))
          );
        }
      });
    };

    subscribeToContentMessages(otherMessages);

    let toolCallMessages = await lastValueFrom(toolCallsStream.pipe(llm.accumulateToolCalls()));

    while (toolCallMessages.tool_calls.length > 0) {
      messages.push(toolCallMessages);

      const tcs = toolCallMessages.tool_calls.filter((tc) => tc.type === 'function');
      await handleToolCalls(tcs, messages);

      stream = llm.streamChatCompletions({
        model: llm.Model.LARGE,
        messages,
        tools: formatToolsForOpenAI(tools),
      });

      [toolCallsStream, otherMessages] = partition(
        stream,
        (chunk: llm.ChatCompletionsResponse<llm.ChatCompletionsChunk>) => llm.isToolCallsMessage(chunk.choices[0].delta)
      );

      subscribeToContentMessages(otherMessages, true);

      toolCallMessages = await lastValueFrom(toolCallsStream.pipe(llm.accumulateToolCalls()));
    }
  };

  return { handleStreamingChatWithHistory };
};
