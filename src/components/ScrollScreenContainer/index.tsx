import {
  Box,
  type IScrollViewProps,
  ScrollView,
  Text,
  VStack,
} from 'native-base';
import { Dimensions } from 'react-native';

import { Header } from '../Header';

type ContainerProps = IScrollViewProps & {
  subtitle?: string;
};

export const ScrollScreenContainer = ({
  children,
  subtitle = '',
  ...rest
}: ContainerProps) => {
  const { width } = Dimensions.get('window');

  // const navigation = useNavigation();

  return (
    <VStack flex={1} maxW={width} bg="white" {...rest}>
      <Header zIndex={subtitle ? 0 : 999} />
      {/* {subtitle && (
        <Box
          bg="primary.700"
          p={1}
          shadow="5"
          zIndex={999}
          height={'50px'}
          justifyContent="center"
          alignItems="center"
        >
          <Text
            color="white"
            fontWeight="bold"
            fontSize="lg"
            textAlign="center"
          >
            {subtitle}
          </Text>
        </Box>
      )} */}
      <ScrollView
        flex={1}
        _contentContainerStyle={{
          backgroundColor: 'white',
          padding: '10px',
          maxW: width,
        }}
        {...rest}
      >
        {children}
      </ScrollView>
      {/* <CustomBottomTab navigation={navigation} /> */}
    </VStack>
  );
};
