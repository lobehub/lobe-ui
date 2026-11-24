export interface AnimatedNumberProps {
  /**
   * Length of one transition, in milliseconds.
   * @default 500
   */
  duration?: number;
  /**
   * Renders the in-flight value, which is fractional while it moves. Without it the
   * value is rounded and rendered with `toLocaleString`.
   */
  formatter?: (value: number) => string;
  /** The number to show. Changing it counts the display up or down to the new value. */
  value: number;
}
