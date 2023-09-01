import { Link, useLocation } from '@remix-run/react';
import { cn } from './ui/lib/utils';
import { cva } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';

const navLinkVariants = cva('whitespace-nowrap focus:outline-none', {
  variants: {
    variant: {
      default: 'text-ht-black',
      active: 'text-ht-black underline',
    },
    position: {
      navbar: '',
      sidebar: 'w-full block',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

function NavLink({
  to,
  children,
  onClick,
  className,
  position = 'navbar',
  asChild = false,
  ...rest
}: Omit<Parameters<typeof Link>['0'], 'to'> & {
  to: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLAnchorElement> | undefined;
  position?: 'navbar' | 'sidebar';
  asChild?: boolean;
}) {
  const location = useLocation();
  const isSelected = to === location.pathname || location.pathname.startsWith(`${to}/`);

  const Comp = asChild ? Slot : Link;
  const variant = isSelected ? (!(position == 'navbar' && to == '/') ? 'active' : 'default') : 'default';

  return (
    <Comp
      prefetch='intent'
      className={cn(navLinkVariants({ variant, position, className }))}
      to={to}
      onClick={(e) => typeof onClick === 'function' && onClick(e)}
      {...rest}
    >
      {children}
    </Comp>
  );
}

export { NavLink };
