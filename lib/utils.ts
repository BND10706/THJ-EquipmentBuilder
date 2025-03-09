import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { useRouter } from 'next/router';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAssetPath(path: string): string {
  // In the browser, we can use window.location to check if we're on GitHub Pages
  if (typeof window !== 'undefined') {
    const isGitHubPages = window.location.hostname.includes('github.io');
    // Remove any leading slash from the path to avoid double slashes
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return isGitHubPages ? `/THJ-EquipmentBuilder/${cleanPath}` : `/${cleanPath}`;
  }
  // During SSR/build, return the path as is
  return path;
} 