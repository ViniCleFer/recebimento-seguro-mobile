import { Checkbox, Text, View } from 'native-base';
import { tiposNaoConformidade } from '@/utils/tiposNaoConformidade';

interface ConformidadesCheckboxProps {
  listaNaoConformidades: any[];
  setListaNaoConformidades: React.Dispatch<React.SetStateAction<any[]>>;
  label?: string;
  isOnlyView?: boolean;
}

export const ConformidadesCheckbox = ({
  listaNaoConformidades,
  setListaNaoConformidades,
  label,
  isOnlyView = false,
}: ConformidadesCheckboxProps) => {
  const handleCheckbox = (naoConformidade: string) => {
    const existsNaoConformidadeSelecionada = listaNaoConformidades.some(
      (d) => d === naoConformidade
    );

    if (existsNaoConformidadeSelecionada) {
      const indexNaoConformidade = listaNaoConformidades.findIndex(
        (d) => d === naoConformidade
      );

      console.log('indexNaoConformidade', indexNaoConformidade);

      setListaNaoConformidades((prevState) => {
        const newState = [...prevState];
        newState.splice(indexNaoConformidade, 1);
        return newState;
      });
    } else {
      setListaNaoConformidades((prevState) => [
        ...prevState,
        { naoConformidade },
      ]);
    }
  };

  return (
    <View>
      <Text mb={3} color='gray.750'>
        {label ? label : 'Selecione as Não conformidades'}
      </Text>

      {tiposNaoConformidade?.map((item: any) => (
        <View key={item?.value} mb={4}>
          <Checkbox
            value={item?.value}
            isChecked={
              isOnlyView
                ? listaNaoConformidades?.includes(item?.value)
                : undefined
            }
            _text={{
              color: 'gray.750',
            }}
            onChange={() => {
              handleCheckbox(item?.value);
            }}
            isDisabled={isOnlyView}
            _checked={{
              backgroundColor: 'primary.700',
              borderColor: 'primary.700',
            }}
            _disabled={{
              opacity: 1,
            }}
          >
            {item?.label}
          </Checkbox>
        </View>
      ))}
    </View>
  );
};
