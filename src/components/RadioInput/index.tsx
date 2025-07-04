import { IRadioProps, Radio } from 'native-base';
import React from 'react';

type InputProps = IRadioProps;

export function RadioInput({ ...rest }: InputProps) {
  return (
    <Radio
      _icon={{
        color: 'primary.700',
      }}
      _checked={{
        borderColor: 'primary.700',
      }}
      {...rest}
    />
  );
}
