export const safeParseJSON = <T = Record<string, any>>(text?: string) => {
  if (typeof text !== 'string') return;

  let json: T;
  try {
    json = JSON.parse(text);
  } catch {
    return;
  }

  return json;
};
