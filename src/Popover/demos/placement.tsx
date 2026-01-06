import { Button, Flexbox, Popover, PopoverGroup } from '@lobehub/ui';

const content = (placement: string) => `Placement: ${placement}`;
export default () => {
  const buttonStyle = { width: 80 };

  return (
    <PopoverGroup>
      <Flexbox gap={4} style={{ padding: 40 }}>
        {/* Top row */}
        <Flexbox gap={4} horizontal justify="center" style={{ marginLeft: 84 }}>
          <Popover content={content('topLeft')} placement="topLeft">
            <Button size="small" style={buttonStyle}>
              topLeft
            </Button>
          </Popover>
          <Popover content={content('top')} placement="top">
            <Button size="small" style={buttonStyle}>
              top
            </Button>
          </Popover>
          <Popover content={content('topRight')} placement="topRight">
            <Button size="small" style={buttonStyle}>
              topRight
            </Button>
          </Popover>
        </Flexbox>

        {/* Middle rows */}
        <Flexbox gap={4} horizontal justify="space-between">
          <Flexbox gap={4}>
            <Popover content={content('leftTop')} placement="leftTop">
              <Button size="small" style={buttonStyle}>
                leftTop
              </Button>
            </Popover>
            <Popover content={content('left')} placement="left">
              <Button size="small" style={buttonStyle}>
                left
              </Button>
            </Popover>
            <Popover content={content('leftBottom')} placement="leftBottom">
              <Button size="small" style={buttonStyle}>
                leftBottom
              </Button>
            </Popover>
          </Flexbox>
          <Flexbox gap={4}>
            <Popover content={content('rightTop')} placement="rightTop">
              <Button size="small" style={buttonStyle}>
                rightTop
              </Button>
            </Popover>
            <Popover content={content('right')} placement="right">
              <Button size="small" style={buttonStyle}>
                right
              </Button>
            </Popover>
            <Popover content={content('rightBottom')} placement="rightBottom">
              <Button size="small" style={buttonStyle}>
                rightBottom
              </Button>
            </Popover>
          </Flexbox>
        </Flexbox>

        {/* Bottom row */}
        <Flexbox gap={4} horizontal justify="center" style={{ marginLeft: 84 }}>
          <Popover content={content('bottomLeft')} placement="bottomLeft">
            <Button size="small" style={buttonStyle}>
              bottomLeft
            </Button>
          </Popover>
          <Popover content={content('bottom')} placement="bottom">
            <Button size="small" style={buttonStyle}>
              bottom
            </Button>
          </Popover>
          <Popover content={content('bottomRight')} placement="bottomRight">
            <Button size="small" style={buttonStyle}>
              bottomRight
            </Button>
          </Popover>
        </Flexbox>
      </Flexbox>
    </PopoverGroup>
  );
};
