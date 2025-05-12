import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { useAuth } from '@/components/hooks/useAuth';

// Mock the useAuth hook
vi.mock('@/components/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('RegisterForm', () => {
  const mockRegister = vi.fn();
  
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Set up the mock implementation for useAuth with initial state
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      register: mockRegister,
      isLoading: false,
    });
  });

  it('should render the form correctly', () => {
    render(<RegisterForm />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('should use native email validation', () => {
    render(<RegisterForm />);
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  it('should validate password length', async () => {
    render(<RegisterForm />);
    
    // Enter a short password
    const passwordInput = screen.getByLabelText(/^password$/i);
    fireEvent.change(passwordInput, { target: { value: 'short' } });
    
    // Submit form to trigger validation
    const submitButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitButton);
    
    // Wait for the error message
    await waitFor(() => {
      expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
    });
  });

  it('should validate that passwords match', async () => {
    render(<RegisterForm />);
    
    // Enter email first (required field)
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    // Enter password
    const passwordInput = screen.getByLabelText(/^password$/i);
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Enter different confirm password
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } });
    
    // Submit the form to trigger validation
    const submitButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitButton);
    
    // Wait for the error message
    await waitFor(() => {
      expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument();
    });
  });

  it('should call register function with correct data on submit', async () => {
    // Setup mock to return a resolved promise
    mockRegister.mockResolvedValue(true);
    
    render(<RegisterForm />);
    
    // Fill out the form with valid data
    fireEvent.change(screen.getByLabelText(/email/i), { 
      target: { value: 'test@example.com' } 
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), { 
      target: { value: 'password123' } 
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { 
      target: { value: 'password123' } 
    });
    
    // Submit the form
    await fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    
    // Wait for the register function to be called
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith('test@example.com', 'password123');
    }, { timeout: 1000 });
  });

  it('should disable the submit button when loading', async () => {
    // Mock useAuth to return isLoading as true
    (useAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      register: mockRegister,
      isLoading: true,
    });
    
    render(<RegisterForm />);
    
    // Find and verify the button
    const submitButton = screen.getByRole('button', { name: /creating account\.\.\./i });
    expect(submitButton).toBeDisabled();
  });
}); 