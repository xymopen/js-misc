/**
 * Returns a supplied numeric expression rounded to 0.
 *
 * @param {number} n
 */
export const fix = n => n - n % 1;
