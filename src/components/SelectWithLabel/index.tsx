import { colors } from '@/styles/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ViewProps,
} from 'react-native';

type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = ViewProps & {
  label: string;
  labelColor?: string;
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  marginBottom?: number;
};

export function SelectWithLabel({
  label,
  labelColor = colors.gray750,
  options = [],
  value,
  onValueChange,
  placeholder = 'Selecione uma opção',
  marginBottom = 24,
  style,
  ...rest
}: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <View style={[styles.container, { marginBottom }, style]} {...rest}>
      <Text style={[styles.label, { color: labelColor }]}>{label}</Text>

      <TouchableOpacity
        style={styles.selectButton}
        onPress={() => setIsOpen(true)}
      >
        <Text style={[styles.selectText, !value && styles.placeholderText]}>
          {value
            ? options.find(opt => opt.value === value)?.label
            : placeholder}
        </Text>
        <MaterialCommunityIcons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          color="#9e9e9e"
          size={24}
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
                    onValueChange?.(item.value);
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    marginBottom: 12,
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
    backgroundColor: 'transparent',
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
});
