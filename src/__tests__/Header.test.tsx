import { render, screen } from '@testing-library/react';
import Header from '../components/Header';

test('renders CourseMaster title', () => {
  render(<Header />);
  const linkElement = screen.getByText(/CourseMaster/i);
  expect(linkElement).toBeInTheDocument();
});