export const getHeadersAndData = (data: string) => {
  const headers: { [key: string]: string } = {};
  for (const line of data.slice(0, data.indexOf('\r\n\r\n')).split('\r\n')) {
    const [key, value] = line.split(':', 2);
    headers[key] = value;
  }
  return { data: data.slice(data.indexOf('\r\n\r\n') + 4), headers };
};
