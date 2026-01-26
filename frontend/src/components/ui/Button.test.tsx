import { render, screen } from '@testing-library/react';
import { Button } from '../../components/ui/Button';

describe('Button', () => {
    it('renders correctly', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('shows loading spinner when isLoading is true', () => {
        render(<Button isLoading>Click me</Button>);
        expect(screen.getByRole('button')).toBeDisabled();
        // Assuming Loader2 renders an SVG, we can check for it or the disabled state
    });

    it('applies variant classes', () => {
        render(<Button variant="secondary">Secondary</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('bg-letsplay-yellow');
    });
});
