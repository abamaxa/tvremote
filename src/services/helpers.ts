
/**
 * Converts the given number of seconds into a formatted time string
 * of the form `d days h hours m mins s secs`
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

/**
 * Converts the given number of seconds into a formatted string
 * containing the number of hours, minutes and seconds in the
 * form `HH:MM:SS`
 * @param {number} secs - The number of seconds to convert
 * @return {string} The formatted time string
 */
export const secondsToHMSString = (secs: number): string => {
  // Return "unknown" if input is zero or negative
  if (secs <= 0) {
    return "-00:00:01";
  }

  // Define the time intervals used in the formatted time string
  const intervals = [ 3600, 60, 1];

  // Initialize an array to store the time parts
  const parts: string[] = [];

  // Calculate the time parts
  for (let interval of intervals) {
    const part = Math.floor(secs / interval);
    secs = secs % interval;
    if (part !== 0 || parts.length || interval == 60) {
      parts.push(part.toString().padStart(2, "0"));
    }
  }

  // Join the time parts and return the formatted time string
  return parts.join(":");
}
