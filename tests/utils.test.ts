import { describe, expect, it } from 'vitest';

import { splitKeysByPlus, startCase } from '../src/HotKeys/utils';

describe('splitKeysByPlus', () => {
  it('should split string by plus sign', () => {
    expect(splitKeysByPlus('cmd+a')).toEqual(['cmd', 'a']);
  });

  it('should handle empty string', () => {
    expect(splitKeysByPlus('')).toEqual([]);
  });

  it('should handle plus with spaces', () => {
    expect(splitKeysByPlus('cmd + a')).toEqual(['cmd ', ' a']);
  });

  it('should handle input with no plus signs', () => {
    expect(splitKeysByPlus('cmd')).toEqual(['cmd']);
  });
});

describe('startCase', () => {
  it('should add spaces before capital letters', () => {
    expect(startCase('camelCase')).toBe('Camel Case');
  });

  it('should capitalize first letter', () => {
    expect(startCase('test')).toBe('Test');
  });

  it('should handle multiple capital letters', () => {
    expect(startCase('thisIsATest')).toBe('This Is A Test');
  });

  it('should handle already capitalized first letter', () => {
    expect(startCase('ThisIsATest')).toBe('This Is A Test');
  });

  it('should handle single letter', () => {
    expect(startCase('a')).toBe('A');
  });

  it('should handle empty string', () => {
    expect(startCase('')).toBe('');
  });

  it('should handle all caps', () => {
    expect(startCase('ABC')).toBe('A B C');
  });

  it('should handle special characters', () => {
    expect(startCase('hello-world')).toBe('Hello-world');
  });

  it('should handle numbers', () => {
    expect(startCase('test123Test')).toBe('Test123 Test');
  });

  it('should handle spaces', () => {
    expect(startCase('hello  world')).toBe('Hello  world');
  });

  it('should handle mixed case with numbers', () => {
    expect(startCase('iHave2Dogs')).toBe('I Have2 Dogs');
  });

  it('should handle string with no uppercase letters', () => {
    expect(startCase('hello')).toBe('Hello');
  });

  it('should handle string with trailing whitespace', () => {
    expect(startCase('helloWorld ')).toBe('Hello World');
  });

  it('should handle string with uppercase at the end', () => {
    expect(startCase('helloWorldA')).toBe('Hello World A');
  });
});
