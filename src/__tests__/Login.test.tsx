import { render, screen, fireEvent, act } from '@testing-library/react';
import Login from '../components/Login';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

describe('Login Component', () => {
  const queryClient = new QueryClient();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  const renderLogin = () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <Login />
        </Router>
      </QueryClientProvider>
    );
  };

  test('renders login form', () => {
    renderLogin();

    expect(screen.getByTestId('title-login')).toBeInTheDocument();
    expect(screen.getByTestId('login-page-input-email')).toBeInTheDocument();
    expect(screen.getByTestId('login-page-input-password')).toBeInTheDocument();
    expect(screen.getByTestId('login-page-btn-login')).toBeInTheDocument();
  });

  test('shows error messages for invalid input', async () => {
    renderLogin();

    await act(async () => {
      fireEvent.click(screen.getByTestId('login-page-btn-login'));
    });

    expect(await screen.findByText('Vui lòng nhập email')).toBeInTheDocument();
    expect(
      await screen.findByText('Vui lòng nhập mật khẩu')
    ).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalledWith();
  });

  test('submits form with valid data', async () => {
    renderLogin();

    await act(async () => {
      fireEvent.change(screen.getByTestId('login-page-input-email'), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByTestId('login-page-input-password'), {
        target: { value: 'Password123!' },
      });
      fireEvent.click(screen.getByTestId('login-page-btn-login'));
    });
    expect(mockNavigate).toHaveBeenCalledWith('/users');
  });
});
