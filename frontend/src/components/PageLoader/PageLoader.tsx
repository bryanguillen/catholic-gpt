import { cn } from '@/lib/utils';

export function PageLoader({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex h-screen w-screen items-center justify-center',
        className
      )}
      {...props}
    >
      <div className="h-10 w-10 animate-spin rounded-full border-t-4 border-b-4 border-gray-900 dark:border-white"></div>
    </div>
  );
}
