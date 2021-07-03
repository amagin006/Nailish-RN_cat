/**
 * Formate to string from Date Object
 * @param date - Date formart - e.g) new Date()
 * @returns {string} - 2021-08-01
 */
export function dateFormate(date) {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
    .getDate()
    .toString()
    .padStart(2, '0')}`;
}

export function getWeeksInMonth(year, month_number) {
  let firstOfMonth = new Date(year, month_number - 1, 1);
  let lastOfMonth = new Date(year, month_number, 0);

  let used = firstOfMonth.getDay() + lastOfMonth.getDate();

  return Math.ceil(used / 7);
}
