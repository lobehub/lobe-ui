export const resolveTooltipDelays = ({
  closeDelay,
  mouseEnterDelay,
  mouseLeaveDelay,
  openDelay,
}: {
  closeDelay?: number;
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
  openDelay?: number;
}) => {
  return {
    close: closeDelay ?? (mouseLeaveDelay !== undefined ? mouseLeaveDelay * 1000 : 100),
    open: openDelay ?? (mouseEnterDelay !== undefined ? mouseEnterDelay * 1000 : 400),
  };
};
