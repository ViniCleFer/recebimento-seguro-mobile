import { Box, Button, type IButtonProps, Spinner, Text } from 'native-base';
import React from 'react';

type MinuteButtonProps = IButtonProps & {
  status: 'loading' | 'signed' | 'unsigned';
};

export const MinuteButton = ({
  status = 'loading',
  ...rest
}: MinuteButtonProps) => {
  return (
    <Button
      variant={status === 'unsigned' ? 'solid' : 'outline'}
      bg={status === 'unsigned' ? 'primary.700' : 'white'}
      borderColor={status === 'signed' ? 'green.700' : 'primary.700'}
      borderWidth={1}
      minW="210px"
      minH={10}
      disabled={status === 'signed' || status === 'loading'}
      _pressed={{
        backgroundColor: 'primary.900',
      }}
      {...rest}
    >
      {status === 'loading' && (
        <Box display="flex" alignItems="center" flexDir="row">
          <Text fontSize="sm" color="primary.700" mr={2}>
            VERIFICANDO ASSINATURA
          </Text>
          <Spinner color="primary.700" size="sm" />
        </Box>
      )}
      {status === 'signed' && (
        <Text fontSize="sm" color="green.700">
          DOCUMENTO ASSINADO
        </Text>
      )}
      {status === 'unsigned' && (
        <Text fontSize="sm" color="white">
          ASSINAR DOCUMENTO
        </Text>
      )}
    </Button>
  );
};
