export function toStringOfDay(dateTime: Date, splitString: string = '-'): string {
  if (dateTime === null) {
    return '';
  }
  const year = new Date(dateTime).getFullYear();
  const month = String(new Date(dateTime).getMonth() + 1).padStart(2, '0');
  const day = String(new Date(dateTime).getDate()).padStart(2, '0');
  return `${year}${splitString}${month}${splitString}${day}`;
}
