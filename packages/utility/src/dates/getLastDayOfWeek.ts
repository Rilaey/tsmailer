export const getLastDayOfWeek = () => {
  const today = new Date();
  const dayOfWeek = today.getUTCDay(); // Get the current day of the week (0 = Sunday, 6 = Saturday)

  // Calculate how many days until the next Sunday. If today is Sunday, it will move 7 days ahead.
  const daysUntilSunday = 7 - dayOfWeek;

  const lastDay = new Date(today);
  lastDay.setUTCDate(today.getUTCDate() + daysUntilSunday); // Move to the next Sunday
  lastDay.setUTCHours(0, 0, 0, 0); // Set to midnight in UTC

  return lastDay.toUTCString(); // Return the date as a string in ISO format
};
