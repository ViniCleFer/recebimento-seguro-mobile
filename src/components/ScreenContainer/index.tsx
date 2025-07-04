import { useNavigation } from '@react-navigation/native';
import {
  Box,
  Container,
  type IContainerProps,
  Text,
  VStack,
} from 'native-base';
import { Dimensions } from 'react-native';

import { CustomBottomTab } from '../CustomBottomTab';
import { Header } from '../Header';

type ContainerProps = IContainerProps & {
  subtitle?: string;
  footerActive?: boolean;
};

export const ScreenContainer = ({
  children,
  subtitle = '',
  footerActive = true,
  ...rest
}: ContainerProps) => {
  const { width } = Dimensions.get('window');

  const navigation = useNavigation();

  return (
    <VStack flex={1} maxW={width} bg="white" mt={!footerActive ? -100 : 0}>
      <Header zIndex={subtitle ? 0 : 999} />
      {subtitle && (
        <Box bg="primary.700" p={1} shadow="5" zIndex={999}>
          <Text color="white" fontWeight="bold" fontSize="sm">
            {subtitle}
          </Text>
        </Box>
      )}
      <Container flex={1} bg="white" padding="10px" maxWidth={width} {...rest}>
        {children}
      </Container>
      {footerActive && <CustomBottomTab navigation={navigation} />}
    </VStack>
  );
};
