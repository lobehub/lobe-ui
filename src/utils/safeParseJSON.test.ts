import { describe, expect, it } from 'vitest';

import { safeParseJSON } from './safeParseJSON';

describe('safeParseJSON', () => {
  it('should parse valid JSON string', () => {
    const json = '{"name": "test", "value": 123}';
    const result = safeParseJSON(json);
    expect(result).toEqual({ name: 'test', value: 123 });
  });

  it('should return undefined for invalid JSON string', () => {
    const invalidJson = '{invalid json}';
    const result = safeParseJSON(invalidJson);
    expect(result).toBeUndefined();
  });

  it('should return undefined for non-string input', () => {
    expect(safeParseJSON()).toBeUndefined();
    expect(safeParseJSON(null as any)).toBeUndefined();
    expect(safeParseJSON(123 as any)).toBeUndefined();
    expect(safeParseJSON({} as any)).toBeUndefined();
  });

  it('should parse JSON array string', () => {
    const jsonArray = '[1,2,3]';
    const result = safeParseJSON(jsonArray);
    expect(result).toEqual([1, 2, 3]);
  });

  it('should parse nested JSON objects', () => {
    const nestedJson = '{"outer": {"inner": "value"}}';
    const result = safeParseJSON(nestedJson);
    expect(result).toEqual({ outer: { inner: 'value' } });
  });

  it('should handle empty JSON object', () => {
    const emptyJson = '{}';
    const result = safeParseJSON(emptyJson);
    expect(result).toEqual({});
  });

  it('should handle empty JSON array', () => {
    const emptyArray = '[]';
    const result = safeParseJSON(emptyArray);
    expect(result).toEqual([]);
  });

  it('should handle empty string', () => {
    const result = safeParseJSON('');
    expect(result).toBeUndefined();
  });
});
