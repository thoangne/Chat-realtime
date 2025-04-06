export function formatMessageTime(date) {
  const options = { hour: "2-digit", minute: "2-digit" };
  return new Date(date).toLocaleTimeString([], options);
}
