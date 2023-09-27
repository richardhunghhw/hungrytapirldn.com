import { type ChangeEvent, useState, useEffect } from 'react';
import { cva } from 'class-variance-authority';

import { Input } from '~/components/ui/input';
import { cn } from './ui/lib/utils';

const inputSpinnerVariants = cva('cursor-pointer border-0 bg-transparent px-6 sm:px-8 font-bold', {
  variants: {
    position: {
      page: 'py-2.5',
      sidebar: '',
    },
  },
});

function InputSpinner({
  id,
  children,
  onClick,
  position = 'page',
}: {
  id: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  position?: 'page' | 'sidebar';
}) {
  return (
    <button
      id={id}
      onClick={(e) => typeof onClick === 'function' && onClick(e)}
      className={cn(inputSpinnerVariants({ position }))}
    >
      {children}
    </button>
  );
}

const numberInputVariants = cva(
  'inline-flex w-full rounded-full border-2 border-ht-black font-mono items-center max-w-56',
  {
    variants: {
      position: {
        page: '',
        sidebar: '',
      },
    },
  },
);

export interface NumberInputProps extends React.HTMLAttributes<HTMLDivElement> {
  slug: string;
  position?: 'page' | 'sidebar';
  initValue?: number;
  disabled?: boolean;
  onUpdate?: (slug: string, quantity: number) => void;
}

function NumberInput({
  className,
  slug,
  position = 'page',
  initValue = 1,
  disabled,
  onUpdate,
  ...props
}: NumberInputProps) {
  const [value, setValue] = useState(initValue);

  useEffect(() => {
    setValue(initValue);
  }, [initValue]);

  const handleIncrement = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const newValue = Math.min(value + 1, 10);
    setValue(newValue);
    if (typeof onUpdate === 'function') onUpdate(slug, newValue);
  };

  const handleDecrement = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const newValue = Math.max(value - 1, 0);
    setValue(newValue);
    if (typeof onUpdate === 'function') onUpdate(slug, newValue);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const newValue = parseInt(e.target.value);
    if (isNaN(newValue)) {
      setValue(0);
      if (typeof onUpdate === 'function') onUpdate(slug, 0);
    } else {
      const constrainedValue = Math.min(Math.max(newValue, 0), 10);
      setValue(constrainedValue);
      if (typeof onUpdate === 'function') onUpdate(slug, constrainedValue);
    }
  };

  return (
    <div className={cn(numberInputVariants({ position, className }))}>
      <InputSpinner id={`${slug}-increment`} position={position} onClick={(e) => handleDecrement(e)}>
        -
      </InputSpinner>
      <Input
        type='number'
        id={`${slug}-quantity-input`}
        name={`${slug}-quantity-input`}
        className='appearance-none border-0 text-center text-lg'
        min='0'
        max='10'
        value={value}
        // disabled={disabled}
        onChange={(e) => handleChange(e)}
        {...props}
      />
      <InputSpinner id={`${slug}-decrement`} position={position} onClick={(e) => handleIncrement(e)}>
        +
      </InputSpinner>
    </div>
  );
}

export { NumberInput };
