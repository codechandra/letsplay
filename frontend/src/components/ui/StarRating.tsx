import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../utils/cn';

interface StarRatingProps {
    rating: number;
    onRatingChange?: (rating: number) => void;
    readonly?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export function StarRating({ rating, onRatingChange, readonly = false, size = 'md' }: StarRatingProps) {
    const [hoverRating, setHoverRating] = useState(0);

    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8'
    };

    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    disabled={readonly}
                    onClick={() => onRatingChange?.(star)}
                    onMouseEnter={() => !readonly && setHoverRating(star)}
                    onMouseLeave={() => !readonly && setHoverRating(0)}
                    className={cn(
                        "transition-colors",
                        readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
                    )}
                >
                    <Star
                        className={cn(
                            sizes[size],
                            (hoverRating || rating) >= star
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-slate-300"
                        )}
                    />
                </button>
            ))}
        </div>
    );
}
