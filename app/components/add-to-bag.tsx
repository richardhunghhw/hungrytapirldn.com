import { Button } from './ui/button';
import { cn } from './ui/lib/utils';

export interface AddToBagProps
    extends React.HTMLAttributes<HTMLDivElement> {}

function AddToBag({ className, ...props }: AddToBagProps) {
    return (
        <Button
            variant="dark"
            size="lg"
            className={cn("uppercase md:w-full", className)}
        >
            Add to bag
        </Button>
    );
}

export { AddToBag };
