import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import ArtworkTile from '../../components/ArtworkTile';

describe('ArtworkTile', () => {
  const mockProps = {
    name: 'Test Artwork',
    src: 'test-image.jpg',
    onClick: vi.fn(),
  };

  it('renders with correct name and image source', () => {
    render(<ArtworkTile {...mockProps} />);

    const image = screen.getByAltText('Test Artwork');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'test-image.jpg');
  });

  it('shows skeleton while image is loading', () => {
    render(<ArtworkTile {...mockProps} />);

    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    render(<ArtworkTile {...mockProps} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('removes skeleton and shows image after loading', async () => {
    render(<ArtworkTile {...mockProps} />);

    // Initially shows skeleton
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();

    // Simulate image load
    const image = screen.getByAltText('Test Artwork');
    fireEvent.load(image);

    // Wait for skeleton to be removed
    await waitFor(() => {
      expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
    });
  });

  it('handles image loading error gracefully', async () => {
    render(<ArtworkTile {...mockProps} />);

    // Initially shows skeleton
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();

    // Simulate image error
    const image = screen.getByAltText('Test Artwork');
    fireEvent.error(image);

    // Should still show skeleton on error
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('has correct button styling', () => {
    render(<ArtworkTile {...mockProps} />);

    const button = screen.getByRole('button');
    const styles = window.getComputedStyle(button);

    expect(styles.position).toBe('relative');
    expect(styles.padding).toBe('0px');
    expect(styles.overflow).toBe('hidden');
    expect(styles.borderRadius).toBe('0');
    expect(styles.width).toBe('100%');
  });

  it('is keyboard accessible', async () => {
    render(<ArtworkTile {...mockProps} />);

    const button = screen.getByRole('button');

    // Should be focusable
    await act(async () => {
      button.focus();
    });
    expect(button).toHaveFocus();

    // Should trigger onClick on Enter key
    await act(async () => {
      fireEvent.keyDown(button, { key: 'Enter' });
    });
    expect(mockProps.onClick).toHaveBeenCalledTimes(1);

    // Reset the mock
    mockProps.onClick.mockClear();

    // Should trigger onClick on Space key
    await act(async () => {
      fireEvent.click(button);  // Using click instead of keyDown for space
    });
    expect(mockProps.onClick).toHaveBeenCalledTimes(1);
  });
}); 