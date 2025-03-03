import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function logErrorInDev(...args: any[]) {
  if (import.meta.env.MODE === 'development') {
    console.log(...args);
  }
}
