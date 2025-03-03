function LoadingDots() {
  return (
    <div className="flex items-center justify-center space-x-1">
      <div className="h-2 w-2 animate-bounce rounded-full bg-black"></div>
      <div className="h-2 w-2 animate-bounce rounded-full bg-black delay-200"></div>
      <div className="h-2 w-2 animate-bounce rounded-full bg-black delay-400"></div>
    </div>
  );
}

export { LoadingDots };
