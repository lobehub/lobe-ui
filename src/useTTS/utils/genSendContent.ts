export const genSendContent = (header: { [key: string]: string }, data: string) => {
  const content = [];
  for (const [key, value] of Object.entries(header)) {
    content.push(`${key}:${value}`);
  }
  content.push('', data);
  return content.join('\r\n');
};
