/**
 * Conditionally joins class names together.
 * @param classes - An array of class names or conditional class objects.
 * @returns A string with the joined class names.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ');
  }
  