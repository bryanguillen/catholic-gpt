interface LoadingDotsProps {
  'data-testid'?: string;
}

function LoadingDots({ 'data-testid': dataTestId }: LoadingDotsProps) {
  return (
    <div
      className="flex items-center justify-center space-x-1"
      data-testid={dataTestId}
    >
      <div className="h-2 w-2 animate-bounce rounded-full bg-black"></div>
      <div className="h-2 w-2 animate-bounce rounded-full bg-black delay-200"></div>
      <div className="h-2 w-2 animate-bounce rounded-full bg-black delay-400"></div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="h-10 w-10 animate-spin rounded-full border-t-4 border-b-4 border-gray-900 dark:border-white"></div>
  );
}

export { LoadingDots, LoadingSpinner };
