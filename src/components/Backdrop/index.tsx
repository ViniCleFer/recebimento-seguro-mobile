import {
  type ISpinnerProps,
  PresenceTransition,
  Spinner,
  View,
} from 'native-base';

type BackdropProps = ISpinnerProps & {
  visible: boolean;
};

export const Backdrop = ({
  visible,
  color = 'white',
  ...rest
}: BackdropProps) => {
  return (
    <PresenceTransition
      style={{
        position: 'absolute',
        zIndex: 900,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        flex: 1,
        backgroundColor: 'rgba(100,100,100,0.3)',
      }}
      visible={visible}
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
        transition: {
          duration: 250,
        },
      }}
    >
      <View flex={1} justifyContent={'center'} alignItems={'center'}>
        <Spinner color={color} size="lg" {...rest} />
      </View>
    </PresenceTransition>
  );
};
