
/**
 * Converts the given number of seconds into a formatted time string
 * @param {number} secs - The number of seconds to convert
 * @return {string} The formatted time string
 */
export const secondsToTimeString = (secs: number): string => {
  // Return "unknown" if input is zero or negative
  if (secs <= 0) {
    return "unknown";
  }

  // Define the time intervals used in the formatted time string
  const intervals = [
    {period: "day", divisor: 24 * 3600},
    {period: "hour", divisor: 3600},
    {period: "min", divisor: 60},
    {period: "sec", divisor: 1}
  ];

  // Initialize an array to store the time parts
  const parts: string[] = [];

  // Calculate the time parts
  for (let interval of intervals) {
    const part = Math.floor(secs / interval.divisor);
    secs = secs % interval.divisor;
    if (part !== 0) {
      const name = part > 1 ? interval.period + "s" : interval.period;
      parts.push(`${part} ${name}`);
    }
  }

  // Join the time parts and return the formatted time string
  return parts.join(" ");
}
