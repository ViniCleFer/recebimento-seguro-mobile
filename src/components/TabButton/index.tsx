import { Button, type IButtonProps, Text } from 'native-base';

type Props = IButtonProps & {
  title: string;
  isActive?: boolean;
};

export function TabButton({ title, isActive = false, ...rest }: Props) {
  return (
    <Button
      variant="outline"
      borderColor="transparent"
      borderBottomWidth={2}
      borderBottomColor={isActive ? 'primary.700' : 'transparent'}
      bgColor="gray.200"
      borderRadius={0}
      px={6}
      {...rest}
    >
      <Text
        color={isActive ? 'primary.700' : 'gray.600'}
        fontSize="sm"
        textTransform="uppercase"
        textAlign="center"
      >
        {title}
      </Text>
    </Button>
  );
}
