/**
 * DateTime class to handle date and time formatting.
 */
export class DateTime {
  now: Date;
  date: string;
  time: string;

  constructor() {
    this.now = new Date();
    this.date = formatDate(this.now);
    this.time = this.currentTimeInOneMinute;
  }

  get currentTime(): string {
    return formatTime(this.now);
  }

  get currentTimeInOneMinute(): string {
    return formatTime(addMinutes(this.now, 1));
  }
}

/**
 * Adds minutes to a given date.
 * @param {Date} date - The date to which minutes will be added.
 * @param {number} minutes - The number of minutes to add.
 * @returns {Date} - The new date with added minutes.
 */
export const addMinutes = (date: Date, minutes: number): Date => {
  const newDate = new Date(date);
  newDate.setMinutes(newDate.getMinutes() + minutes);
  return newDate;
}


/**
 * Formats a date to 'YYYY-MM-DD' format.
 * @param {Date} date - The date to format.
 * @returns {string} - The formatted date string.
 */
export const formatDate = (date: Date): string =>
  date.toISOString().split("T")[0];


/**
 * Formats a time to 'HH:MM' format.
 * @param {Date} date - The date to format.
 * @returns {string} - The formatted time string.
 */
export const formatTime = (date: Date): string =>
  date.toTimeString().split(" ")[0].substring(0, 5);


/**
 * Returns the End of Business (EOB) time.
 * @returns {string} - The EOB time in 'HH:MM' format.
 */
export const eobTime = (): string => "17:00";