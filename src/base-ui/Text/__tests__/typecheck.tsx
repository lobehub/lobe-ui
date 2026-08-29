import { Text } from '@/base-ui';

export const ok1 = <Text>a</Text>;
export const ok2 = (
  <Text shiny shinyDuration="3s">
    a
  </Text>
);
export const ok3 = <Text shiny>a</Text>;
// @ts-expect-error shinyDuration requires shiny
export const bad = <Text shinyDuration="3s">a</Text>;
