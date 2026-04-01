export function generateRequestCode() {
  const year = new Date().getFullYear();
  const randomPart = Math.floor(10000 + Math.random() * 90000);
  return `PMR-${year}-${randomPart}`;
}