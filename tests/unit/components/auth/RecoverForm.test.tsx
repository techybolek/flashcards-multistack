import { describe, it, expect, vi, beforeEach } from 'vitest';
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

  it('should validate email format', async () => {
    render(<RecoverForm />);
    
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);
    
    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });
  });

  it('should validate required fields', async () => {
    render(<RecoverForm />);
    
    // Submit the form without filling any fields
    const submitButton = screen.getByRole('button', { name: /reset password/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
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