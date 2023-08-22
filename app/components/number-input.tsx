import { Input } from '~/components/ui/input';
import { cn } from './ui/lib/utils';
import { useState } from 'react';
import { cva } from 'class-variance-authority';

export interface NumberInputProps extends React.HTMLAttributes<HTMLDivElement> {}

const inputSpinnerVariants = cva('cursor-pointer border-0 bg-transparent px-8 font-bold', {
  variants: {
    position: {
      page: 'py-2.5',
      sidebar: '',
    },
  },
});

function InputSpinner({
  children,
  onClick,
  position = 'page',
}: {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLAnchorElement> | undefined;
  position?: 'page' | 'sidebar';
}) {
  return (
    <button
      onClick={(e) => typeof onClick === 'function' && onClick(e)}
      className={cn(inputSpinnerVariants({ position }))}
    >
      {children}
    </button>
  );
}

const numberInputVariants = cva('inline-flex w-full rounded-full border-2 border-ht-black font-mono', {
  variants: {
    position: {
      page: '',
      sidebar: '',
    },
  },
});

function NumberInput({
  id,
  className,
  position = 'page',
  ...props
}: NumberInputProps & {
  position?: 'page' | 'sidebar';
}) {
  const [value, setValue] = useState(0);

  const handleIncrement = () => {
    setValue(value + 1);
  };

  const handleDecrement = () => {
    setValue(value - 1);
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <div className={cn(numberInputVariants({ position }))}>
      <InputSpinner position={position} onClick={() => handleDecrement()}>
        -
      </InputSpinner>
      <Input
        type='number'
        id={id}
        name={id}
        className='appearance-none border-0 text-center text-lg'
        min='0'
        max='10'
        value={value}
      />
      <InputSpinner position={position} onClick={() => handleIncrement()}>
        +
      </InputSpinner>
    </div>
  );
}

export { NumberInput };
