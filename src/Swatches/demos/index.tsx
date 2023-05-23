import {
  blue,
  cyan,
  geekblue,
  gold,
  green,
  lime,
  magenta,
  orange,
  purple,
  red,
  volcano,
  yellow,
} from '@ant-design/colors';
import { Swatches } from '@lobehub/ui';

const STEP = 4;

export default () => {
  return (
    <Swatches
      colors={[
        red[STEP],
        orange[STEP],
        gold[STEP],
        yellow[STEP],
        lime[STEP],
        green[STEP],
        cyan[STEP],
        blue[STEP],
        geekblue[STEP],
        purple[STEP],
        magenta[STEP],
        volcano[STEP],
      ]}
    />
  );
};
