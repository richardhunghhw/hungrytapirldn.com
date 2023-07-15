import { Input } from '~/components/ui/input';
import { cn } from './ui/lib/utils';

export interface NumberInputProps extends React.HTMLAttributes<HTMLDivElement> {}

function NumberInput({ id, className, ...props }: NumberInputProps) {
  return (
    <Input
      type='number'
      id={id}
      name={id}
      className={cn('appearance-none rounded-full border border-ht-black text-center text-lg', className)}
      min='0'
      max='10'
      defaultValue='0'
    />
  );
}

export { NumberInput };
