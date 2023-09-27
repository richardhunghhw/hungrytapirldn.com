import { NumberInput } from './number-input';
import { Button } from './ui/button';
import { cn } from './ui/lib/utils';
import { useFetcher } from '@remix-run/react';

export interface AddToBagProps extends React.HTMLAttributes<HTMLDivElement> {
  slug: string;
  enabled: boolean;
}

function AddToBag({ slug, enabled, className, ...props }: AddToBagProps) {
  const fetcher = useFetcher();

  // console.log(fetcher);

  return (
    <fetcher.Form
      id={`${slug}-add-to-bag-form`}
      action='/'
      method='post'
      className={cn('flex flex-col items-center', className)}
    >
      <input type='hidden' name='slug' value={slug} />
      <input type='hidden' name='action' value='add' />
      <NumberInput slug={slug} />
      <Button
        type='submit'
        id={`${slug}-add-to-bag`}
        variant='dark'
        size='lg'
        className='mt-6 w-full uppercase'
        enabled={enabled}
      >
        {enabled ? 'Add to bag' : 'Not available'}
      </Button>
    </fetcher.Form>
  );
}

export { AddToBag };
