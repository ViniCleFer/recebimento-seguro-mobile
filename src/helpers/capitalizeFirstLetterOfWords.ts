export function capitalizeFirstLetterOfWords(str: string) {
  if (!str) {
    return '';
  }
  return str.replace(/\b\w/g, (char: string) => {
    return char.toUpperCase();
  });
}
