import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from './lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-mono font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background rounded-full',
  {
    variants: {
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 text-sm',
        lg: 'h-12 px-8 text-xl sm:text-2xl',
      },
      variant: {
        dark: 'border border-ht-black text-ht-off-white bg-ht-black hover:text-ht-black hover:bg-transparent focus:text-ht-black focus:bg-transparent',
        outline: 'border border-ht-black hover:text-ht-green hover:bg-ht-black focus:text-ht-green focus:bg-ht-black',
        link: 'underline-offset-4 px-0 underline',
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'dark',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  enabled?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, size, variant, asChild = false, enabled = true, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ size, variant, className }))} ref={ref} {...props} disabled={!enabled} />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
