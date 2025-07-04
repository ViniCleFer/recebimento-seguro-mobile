import { useState } from 'react';
import { Checkbox, Text, View } from 'native-base';
import { tiposNaoConformidade } from '@/utils/tiposNaoConformidade';
import { Control, Controller } from 'react-hook-form';

interface ConformidadesCheckboxControlledProps {
  label: string;
  isOnlyView?: boolean;
  control: Control<any>;
  index: number;
  name: string;
  optionNaoConformidadesList: string[];
  isChecked?: boolean;
}

export const ConformidadesCheckboxControlled = ({
  label,
  isOnlyView = false,
  control,
  index,
  name,
  optionNaoConformidadesList,
  isChecked = false,
}: ConformidadesCheckboxControlledProps) => {
  // const handleCheckbox = (
  //   naoConformidade: string,
  //   value: any,
  //   onChange: any,
  // ) => {
  //   const existsNaoConformidadeSelecionada = value.some(
  //     d => d === naoConformidade,
  //   );

  //   if (existsNaoConformidadeSelecionada) {
  //     const indexNaoConformidade = value.findIndex(d => d === naoConformidade);

  //     console.log('indexNaoConformidade', indexNaoConformidade);

  //     setListaNaoConformidades(prevState => {
  //       const newState = [...prevState];
  //       newState.splice(indexNaoConformidade, 1);
  //       return newState;
  //     });
  //   } else {
  //     setListaNaoConformidades(prevState => [
  //       ...prevState,
  //       { naoConformidade },
  //     ]);
  //   }
  // };

  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleCheckboxChange = (value: string, onChange: any) => {
    setSelectedItems(prevState => {
      if (prevState.includes(value)) {
        const res = prevState.filter(item => item !== value);
        onChange(res);
        return res;
      } else {
        const res = [...prevState, value];
        onChange(res);
        return res;
      }
    });
  };

  return (
    <View>
      <Text mb={3} color="gray.750">
        {label}
      </Text>

      {tiposNaoConformidade
        ?.filter(tipo => optionNaoConformidadesList?.includes(tipo?.value))
        ?.map((item: any) => (
          <View key={item?.value} mb={4}>
            <Controller
              control={control}
              name={`respostas.${index}.${name}`}
              render={({ field }) => (
                <Checkbox
                  value={field?.value}
                  isChecked={
                    isChecked
                      ? true
                      : isOnlyView
                      ? selectedItems?.includes(item?.value)
                      : undefined
                  }
                  _text={{
                    color: 'gray.750',
                  }}
                  onChange={() => {
                    handleCheckboxChange(item?.value, field.onChange);
                    // field.onChange(selectedItems);
                  }}
                  isDisabled={isChecked ? true : isOnlyView}
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
              )}
            />
          </View>
        ))}
    </View>
  );
};
