import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RecoverForm } from '@/components/auth/RecoverForm';
import { useAuth } from '@/components/hooks/useAuth';

// Mock the useAuth hook
vi.mock('@/components/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('RecoverForm', () => {
  const mockRecoverPassword = vi.fn();
  
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Set up the mock implementation for useAuth
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      recoverPassword: mockRecoverPassword,
      isLoading: false,
    });
  });

  it('should render the form correctly', () => {
    render(<RecoverForm />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset password/i })).toBeInTheDocument();
    expect(screen.getByText(/remember your password/i)).toBeInTheDocument();
  });

  it('should show required field error', async () => {
    render(<RecoverForm />);
    
    // Submit empty form
    const submitButton = screen.getByRole('button', { name: /reset password/i });
    fireEvent.click(submitButton);
    
    // Check for our custom validation message
    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });
  });

  it('should use native email validation', () => {
    render(<RecoverForm />);
    
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  it('should call recoverPassword function with correct email on submit', async () => {
    mockRecoverPassword.mockResolvedValueOnce(true);
    
    render(<RecoverForm />);
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/email/i), { 
      target: { value: 'test@example.com' } 
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /reset password/i }));
    
    await waitFor(() => {
      expect(mockRecoverPassword).toHaveBeenCalledWith('test@example.com');
    });
  });

  it('should disable the submit button when loading', () => {
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      recoverPassword: mockRecoverPassword,
      isLoading: true,
    });
    
    render(<RecoverForm />);
    
    const submitButton = screen.getByRole('button', { name: /processing/i });
    expect(submitButton).toBeDisabled();
  });
}); 