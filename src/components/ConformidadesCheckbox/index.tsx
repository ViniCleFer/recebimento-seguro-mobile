import { colors } from '@/styles/theme';
import { tiposNaoConformidade } from '@/utils/tiposNaoConformidade';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
      d => d === naoConformidade,
    );

    if (existsNaoConformidadeSelecionada) {
      const indexNaoConformidade = listaNaoConformidades.findIndex(
        d => d === naoConformidade,
      );

      setListaNaoConformidades(prevState => {
        const newState = [...prevState];
        newState.splice(indexNaoConformidade, 1);
        return newState;
      });
    } else {
      setListaNaoConformidades(prevState => [
        ...prevState,
        { naoConformidade },
      ]);
    }
  };

  const isChecked = (value: string) => {
    return listaNaoConformidades?.includes(value);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label ? label : 'Selecione as Não conformidades'}
      </Text>

      {tiposNaoConformidade?.map((item: any) => (
        <TouchableOpacity
          key={item?.value}
          style={styles.checkboxContainer}
          onPress={() => handleCheckbox(item?.value)}
          disabled={isOnlyView}
        >
          <View
            style={[
              styles.checkbox,
              isChecked(item?.value) && styles.checkboxChecked,
              isOnlyView && styles.checkboxDisabled,
            ]}
          >
            {isChecked(item?.value) && <View style={styles.checkboxInner} />}
          </View>
          <Text
            style={[
              styles.checkboxText,
              isOnlyView && styles.checkboxTextDisabled,
            ]}
          >
            {item?.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    marginBottom: 12,
    color: colors.gray750,
    fontSize: 14,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#084077',
    borderColor: '#084077',
  },
  checkboxDisabled: {
    opacity: 1,
  },
  checkboxInner: {
    width: 10,
    height: 10,
    backgroundColor: 'white',
    borderRadius: 2,
  },
  checkboxText: {
    color: colors.gray750,
    fontSize: 14,
    flex: 1,
  },
  checkboxTextDisabled: {
    opacity: 1,
  },
});
