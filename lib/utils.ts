import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getCDNUrl =(path: string ) => `https://github.com/jemmy344/cdn-images/blob/main/${path}?raw=true`
