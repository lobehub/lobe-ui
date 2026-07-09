import { Flexbox } from '@lobehub/ui';
import { InputNumber, InputOTP, InputPassword } from '@lobehub/ui/base-ui';
import { useState } from 'react';

export default () => {
  const [otp, setOtp] = useState('');

  return (
    <Flexbox gap={16} padding={16} style={{ maxWidth: 480 }} width={'100%'}>
      <InputPassword defaultValue={'secret-password'} placeholder={'Password'} />
      <InputPassword placeholder={'No toggle'} visibilityToggle={false} />
      <Flexbox horizontal gap={16}>
        <InputNumber defaultValue={42} max={100} min={0} placeholder={'Number'} />
        <InputNumber controls={false} defaultValue={0.5} step={0.1} />
      </Flexbox>
      <InputNumber changeOnWheel defaultValue={10} size={'small'} step={5} />
      <InputOTP length={6} value={otp} onChange={setOtp} />
      <InputOTP mask length={4} size={'small'} />
    </Flexbox>
  );
};
