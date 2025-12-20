/**
 * Composes two event handlers together, calling the external handler first,
 * then the internal handler if the event hasn't been prevented.
 *
 * @template E - The event type
 * @param theirHandler - The external event handler (may be undefined)
 * @param ourHandler - The internal event handler
 * @returns A composed event handler that calls both handlers in sequence
 *
 * @example
 * ```tsx
 * <button
 *   onClick={composeEventHandlers(externalOnClick, (e) => {
 *     // Internal handler logic
 *   })}
 * />
 * ```
 */
export const composeEventHandlers =
  <E>(
    theirHandler: ((event: E) => void) | undefined,
    ourHandler: (event: E) => void,
  ): ((event: E) => void) =>
  (event) => {
    theirHandler?.(event);
    // @ts-ignore - compatible with React SyntheticEvent shape
    if (event?.defaultPrevented) return;
    ourHandler(event);
  };
