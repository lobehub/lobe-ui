import { Spotlight, SpotlightProps, StroyBook, useControls, useCreateStore } from '@lobehub/ui';
import styled from 'styled-components';

const Card = styled.div`
  position: relative;

  width: 100%;
  height: 36px;

  background: ${({ theme }) => theme.colorBgLayout};
  border: 1px solid ${({ theme }) => theme.colorBorder};
  border-radius: ${({ theme }) => theme.borderRadius}px;
`;

export default () => {
  const store = useCreateStore();
  const control: SpotlightProps | any = useControls(
    {
      size: 64,
    },
    { store },
  );

  return (
    <StroyBook levaStore={store}>
      <Card>
        <Spotlight {...control} />
      </Card>
    </StroyBook>
  );
};
