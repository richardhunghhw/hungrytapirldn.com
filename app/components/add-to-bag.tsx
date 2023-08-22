import { NumberInput } from './number-input';
import { Button } from './ui/button';
import { cn } from './ui/lib/utils';

export interface AddToBagProps extends React.HTMLAttributes<HTMLDivElement> {}

function AddToBag({ id, className, ...props }: AddToBagProps) {
  return (
    <>
      <div className='hidden md:block'>
        <NumberInput id={id} />
      </div>
      <Button variant='dark' size='lg' className={cn('uppercase md:w-full', className)}>
        Add to bag
      </Button>
    </>
  );
}

export { AddToBag };
