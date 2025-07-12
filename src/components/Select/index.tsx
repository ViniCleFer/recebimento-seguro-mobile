import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import {
  type Control,
  Controller,
  type FieldError,
  type RegisterOptions,
} from 'react-hook-form';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ViewProps,
} from 'react-native';

type SelectProps = ViewProps & {
  control: Control<any>;
  register: (rules?: RegisterOptions) => (ref: any) => void;
  name: string;
  label: string;
  error?: FieldError;
  isWhite?: boolean;
  options: { label: string; value: string }[];
  placeholder?: string;
  marginBottom?: number;
};

export function Select({
  name,
  label,
  control,
  error,
  isWhite = false,
  register,
  options = [],
  placeholder = 'Selecione uma opção',
  marginBottom = 32,
  style,
  ...rest
}: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <View style={[styles.container, { marginBottom }, style]} {...rest}>
      <Text style={styles.label}>{label}</Text>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field: { onChange, value } }) => (
          <>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setIsOpen(true)}
            >
              <Text
                style={[styles.selectText, !value && styles.placeholderText]}
              >
                {value
                  ? options.find(opt => opt.value === value)?.label
                  : placeholder}
              </Text>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={20}
                color="#9e9e9e"
              />
            </TouchableOpacity>

            <Modal
              visible={isOpen}
              transparent
              animationType="slide"
              onRequestClose={() => setIsOpen(false)}
            >
              <TouchableOpacity
                style={styles.modalOverlay}
                onPress={() => setIsOpen(false)}
              >
                <View style={styles.modalContent}>
                  <FlatList
                    data={options}
                    keyExtractor={item => item.value}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.optionItem}
                        onPress={() => {
                          onChange(item.value);
                          setIsOpen(false);
                        }}
                      >
                        <Text style={styles.optionText}>{item.label}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </TouchableOpacity>
            </Modal>

            {error && <Text style={styles.errorText}>{error.message}</Text>}
          </>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: '#084077',
    marginBottom: 8,
  },
  selectButton: {
    width: '100%',
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
  },
  selectText: {
    fontSize: 16,
    color: '#000',
  },
  placeholderText: {
    color: '#9e9e9e',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    width: '80%',
    maxHeight: '60%',
    padding: 16,
  },
  optionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionText: {
    fontSize: 16,
    color: '#000',
  },
  errorText: {
    color: '#ff5757',
    fontSize: 12,
    marginTop: 4,
  },
});
