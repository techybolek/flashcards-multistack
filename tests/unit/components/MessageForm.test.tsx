import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MessageForm } from '@/components/MessageForm';

// Mock the alert function
const alertMock = vi.fn();
window.alert = alertMock;

describe('MessageForm', () => {
  beforeEach(() => {
    alertMock.mockClear();
  });

  it('renders textarea and submit button', () => {
    render(<MessageForm />);
    
    const textarea = screen.getByPlaceholderText('Type your message here...');
    const submitButton = screen.getByText('Submit');
    
    expect(textarea).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it('updates textarea value when typing', () => {
    render(<MessageForm />);
    
    const textarea = screen.getByPlaceholderText('Type your message here...');
    fireEvent.change(textarea, { target: { value: 'Hello, world!' } });
    
    expect(textarea).toHaveValue('Hello, world!');
  });

  it('shows alert with message when submitting with text', () => {
    render(<MessageForm />);
    
    const textarea = screen.getByPlaceholderText('Type your message here...');
    const submitButton = screen.getByText('Submit');
    
    fireEvent.change(textarea, { target: { value: 'Test message' } });
    fireEvent.click(submitButton);
    
    expect(alertMock).toHaveBeenCalledWith('Message submitted: Test message');
    expect(textarea).toHaveValue('');
  });

  it('shows warning alert when submitting with empty text', () => {
    render(<MessageForm />);
    
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);
    
    expect(alertMock).toHaveBeenCalledWith('Please enter a message first!');
  });
}); 