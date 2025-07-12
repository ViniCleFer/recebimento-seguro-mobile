import { colors } from '@/styles/theme';
import { tiposNaoConformidade } from '@/utils/tiposNaoConformidade';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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

  const isItemChecked = (value: string) => {
    return isChecked ? true : selectedItems?.includes(value);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      {tiposNaoConformidade
        ?.filter(tipo => optionNaoConformidadesList?.includes(tipo?.value))
        ?.map((item: any) => (
          <View key={item?.value} style={styles.checkboxContainer}>
            <Controller
              control={control}
              name={`respostas.${index}.${name}`}
              render={({ field }) => (
                <TouchableOpacity
                  style={styles.checkboxRow}
                  activeOpacity={0.7}
                  onPress={() =>
                    handleCheckboxChange(item?.value, field.onChange)
                  }
                  disabled={isChecked ? true : isOnlyView}
                >
                  <View
                    style={[
                      styles.checkbox,
                      isItemChecked(item?.value) && styles.checkboxChecked,
                      (isChecked || isOnlyView) && styles.checkboxDisabled,
                    ]}
                  >
                    {isItemChecked(item?.value) && (
                      <Icon
                        name="check"
                        color={colors.white}
                        size={24}
                        style={styles.checkboxInner}
                      />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.checkboxText,
                      (isChecked || isOnlyView) && styles.checkboxTextDisabled,
                    ]}
                  >
                    {item?.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
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
    marginBottom: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
    position: 'relative',
  },
  checkboxChecked: {
    backgroundColor: '#084077',
    borderColor: '#084077',
  },
  checkboxDisabled: {
    opacity: 1,
  },
  checkboxInner: {
    zIndex: 999,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    left: -2,
    bottom: -3,
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
