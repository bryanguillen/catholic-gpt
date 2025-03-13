import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { AssistantMessage } from './AssistantMessage';
import { useAssistantResponseStream } from './useAssistantResponseStream';

// Mock the custom hook
vi.mock('./useAssistantResponseStream', () => ({
  useAssistantResponseStream: vi.fn(),
}));

const mockUseAssistantResponseStream = vi.mocked(useAssistantResponseStream);

describe('AssistantMessage', () => {
  it('renders loading dots when responseText is empty', () => {
    mockUseAssistantResponseStream.mockReturnValue('');
    render(<AssistantMessage conversationId="test-id" />);
    expect(
      screen.getByTestId('assistant-message-loading-dots')
    ).toBeInTheDocument();
  });

  it('renders markdown content when responseText is not empty', () => {
    const testContent = 'Hello, this is a test message!';
    mockUseAssistantResponseStream.mockReturnValue(testContent);
    render(<AssistantMessage conversationId="test-id" />);
    expect(screen.getByText(testContent)).toBeInTheDocument();
  });
});
