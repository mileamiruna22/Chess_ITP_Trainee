import { render, screen } from '@testing-library/react';
import App from './App';

test('renders chess app title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Șah React/i);
  expect(titleElement).toBeInTheDocument();
});