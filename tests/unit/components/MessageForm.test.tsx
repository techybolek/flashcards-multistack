import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MessageForm } from '@/components/MessageForm';

describe('MessageForm', () => {
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

  it('shows status message when submitting with text', () => {
    render(<MessageForm />);
    
    const textarea = screen.getByPlaceholderText('Type your message here...');
    const submitButton = screen.getByText('Submit');
    
    fireEvent.change(textarea, { target: { value: 'Test message' } });
    fireEvent.click(submitButton);
    
    const statusMessage = screen.getByTestId('status-message');
    expect(statusMessage).toHaveTextContent('Message submitted: Test message');
    expect(textarea).toHaveValue('');
  });

  it('shows warning status message when submitting with empty text', () => {
    render(<MessageForm />);
    
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);
    
    const statusMessage = screen.getByTestId('status-message');
    expect(statusMessage).toHaveTextContent('Please enter a message first!');
  });
}); 