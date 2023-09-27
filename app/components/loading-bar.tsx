import { useNavigation } from '@remix-run/react';
import { cn } from './ui/lib/utils';

function LoadingBar() {
  const navigation = useNavigation();
  const active = navigation.state !== 'idle';

  return (
    <div
      role='progressbar'
      aria-hidden={!active}
      aria-valuetext={active ? 'Loading' : undefined}
      className='fixed inset-x-0 top-0 z-50 h-1 animate-pulse'
    >
      <div
        className={cn(
          'h-full bg-gradient-to-r from-violet-500 to-teal-500 transition-all duration-500 ease-in',
          navigation.state === 'idle' && 'w-0 opacity-0 transition-none',
          navigation.state === 'submitting' && 'w-1/2',
          navigation.state === 'loading' && 'w-full',
        )}
      />
    </div>
  );
}

export { LoadingBar };
