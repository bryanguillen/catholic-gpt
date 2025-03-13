import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useAssistantResponseStream } from './useAssistantResponseStream';
import { useAssistantStreamingContext } from '../../context/AssistantStreamingContext';
import { toast } from 'sonner'; // Assuming 'sonner' is used for toast notifications

vi.mock('../../context/AssistantStreamingContext', () => ({
  useAssistantStreamingContext: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: { error: vi.fn() },
}));

const mockUseAssistantStreamingContext = vi.mocked(
  useAssistantStreamingContext
);

describe('useAssistantResponseStream', () => {
  let mockSetIsStreaming: ReturnType<typeof vi.fn>;
  let mockEventSource: {
    onopen?: () => void;
    onmessage?: (event: { data: string }) => void;
    onerror?: () => void;
    close: () => void;
  };

  beforeEach(() => {
    mockSetIsStreaming = vi.fn();

    mockUseAssistantStreamingContext.mockReturnValue({
      setIsStreaming: mockSetIsStreaming,
      isStreaming: false,
    });

    global.EventSource = vi.fn().mockImplementation(() => {
      mockEventSource = {
        onopen: undefined,
        onmessage: undefined,
        onerror: undefined,
        close: vi.fn(),
      };
      return mockEventSource;
    }) as unknown as typeof EventSource;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('initializes EventSource and sets streaming state', async () => {
    renderHook(() => useAssistantResponseStream('test-id'));

    expect(global.EventSource).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_URL}/conversation/test-id/stream`
    );

    act(() => {
      mockEventSource.onopen?.();
    });

    expect(mockSetIsStreaming).toHaveBeenCalledWith(true);
  });

  test('updates responseText when new messages arrive', async () => {
    const { result } = renderHook(() => useAssistantResponseStream('test-id'));

    act(() => {
      mockEventSource.onmessage?.({ data: 'Hello' });
    });

    expect(result.current).toBe('Hello');

    act(() => {
      mockEventSource.onmessage?.({ data: ' World' });
    });

    expect(result.current).toBe('Hello World');
  });

  test("stops streaming on '[DONE]' message", async () => {
    renderHook(() => useAssistantResponseStream('test-id'));

    act(() => {
      mockEventSource.onmessage?.({ data: '[DONE]' });
    });

    expect(mockSetIsStreaming).toHaveBeenCalledWith(false);
    expect(mockEventSource.close).toHaveBeenCalled();
  });

  test('handles errors and shows toast notification', async () => {
    renderHook(() => useAssistantResponseStream('test-id'));

    act(() => {
      mockEventSource.onerror?.();
    });

    expect(toast.error).toHaveBeenCalledWith('Error while streaming', {
      description: 'Closed stream due to error. Try again.',
    });

    expect(mockSetIsStreaming).toHaveBeenCalledWith(false);
    expect(mockEventSource.close).toHaveBeenCalled();
  });

  test('does not initialize if conversationId is empty', async () => {
    renderHook(() => useAssistantResponseStream(''));

    expect(global.EventSource).not.toHaveBeenCalled();
  });
});
