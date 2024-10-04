export const getLastDayOfMonth = () => {
  const today = new Date();
  const year = today.getUTCFullYear();
  const month = today.getUTCMonth(); // Get the current month (0 = January, 11 = December)

  // Create a date object for the first day of the next month, then subtract one day
  const lastDay = new Date(Date.UTC(year, month + 1, 0)); // This will give the last day of the current month
  lastDay.setUTCHours(0, 0, 0, 0); // Set to midnight in UTC

  return lastDay.toUTCString(); // Return the date as a string in ISO format
};
