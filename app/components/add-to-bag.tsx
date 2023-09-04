import { NumberInput } from './number-input';
import { Button } from './ui/button';
import { cn } from './ui/lib/utils';
import { useFetcher } from '@remix-run/react';

export interface AddToBagProps extends React.HTMLAttributes<HTMLDivElement> {
  slug: string;
}

function AddToBag({ slug, className, ...props }: AddToBagProps) {
  const fetcher = useFetcher();

  // console.log(fetcher);

  return (
    <fetcher.Form id={`${slug}-add-to-bag-form`} action='/' method='post' className='flex flex-col'>
      <input type='hidden' name='slug' value={slug} />
      <input type='hidden' name='action' value='add' />
      <div className='md:block'>
        <NumberInput slug={slug} />
      </div>
      <Button
        type='submit'
        id={`${slug}-add-to-bag`}
        variant='dark'
        size='lg'
        className={cn('mt-6 uppercase md:w-full', className)}
      >
        Add to bag
      </Button>
    </fetcher.Form>
  );
}

export { AddToBag };
