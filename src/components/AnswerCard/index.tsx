import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { GrupoEnunciado } from '@/services/requests/enunciados/types';
import useQuestionStore from '@/store/questions';
import { ConformidadesCheckbox } from '../ConformidadesCheckbox';
import { RadioInput } from '../RadioInput';
import { SelectWithLabel } from '../SelectWithLabel';

interface AnswerCardProps {
  enunciadoId: string;
  descricao: string;
  posicao: number;
  grupo: GrupoEnunciado;
  data: any;
  onChange: any;
}

export default function AnswerCard({
  enunciadoId,
  descricao,
  posicao,
  grupo,
  data,
  onChange,
}: AnswerCardProps) {
  const { selectedInitialQuestion } = useQuestionStore(state => state);

  return (
    <View style={styles.cardContainer}>
      <Text style={styles.title}>{`${posicao}) ${descricao}`}</Text>

      <SelectWithLabel
        label="Quantidade analisada"
        onValueChange={t => {
          onChange((prevState: any[]) => {
            return prevState?.map((item, index) => {
              if (index + 1 === posicao && item?.grupo === grupo) {
                return {
                  ...item,
                  qtdAnalisada: t,
                  enunciado_id: enunciadoId,
                  form_ptp_id: selectedInitialQuestion?.id,
                  grupo,
                  posicao,
                };
              } else {
                return {
                  qtdAnalisada: t,
                  enunciado_id: enunciadoId,
                  form_ptp_id: selectedInitialQuestion?.id,
                  grupo,
                  posicao,
                };
              }
            });
          });
        }}
        options={Array.from({ length: 30 }).map((_, index) => ({
          label: String(index + 1),
          value: String(index + 1),
        }))}
      />

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Código Produto</Text>
        <TextInput
          style={styles.input}
          maxLength={10}
          placeholder=""
          autoComplete="off"
          onChangeText={t => {
            onChange((prevState: any[]) => {
              return prevState?.map((item, index) => {
                if (index + 1 === posicao && item?.grupo === grupo) {
                  return {
                    ...item,
                    codProduto: t,
                    enunciado_id: enunciadoId,
                    form_ptp_id: selectedInitialQuestion?.id,
                    grupo,
                    posicao,
                  };
                } else {
                  return {
                    codProduto: t,
                    enunciado_id: enunciadoId,
                    form_ptp_id: selectedInitialQuestion?.id,
                    grupo,
                    posicao,
                  };
                }
              });
            });
          }}
        />
      </View>

      <View style={styles.radioContainer}>
        <Text style={styles.label}>Há não conformidade?</Text>
        <View style={styles.radioGroup}>
          <RadioInput value="sim">
            <Text>Sim</Text>
          </RadioInput>
          <RadioInput value="nao" style={{ marginLeft: 20 }}>
            <Text>Não</Text>
          </RadioInput>
        </View>
      </View>

      {data[posicao]?.haNaoConformidade === 'sim' && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Lote</Text>
          <TextInput
            style={styles.input}
            maxLength={10}
            placeholder=""
            autoComplete="off"
            onChangeText={t => {
              onChange((prevState: any[]) => {
                return prevState?.map((item, index) => {
                  if (index + 1 === posicao && item?.grupo === grupo) {
                    return {
                      ...item,
                      lote: t,
                      enunciado_id: enunciadoId,
                      form_ptp_id: selectedInitialQuestion?.id,
                      grupo,
                      posicao,
                    };
                  } else {
                    return {
                      lote: t,
                      enunciado_id: enunciadoId,
                      form_ptp_id: selectedInitialQuestion?.id,
                      grupo,
                      posicao,
                    };
                  }
                });
              });
            }}
          />
        </View>
      )}

      {data[posicao]?.haNaoConformidade === 'sim' && (
        <View style={styles.checkboxContainer}>
          <ConformidadesCheckbox
            listaNaoConformidades={data[posicao]?.listaNaoConformidades}
            setListaNaoConformidades={t => {
              onChange((prevState: any[]) => {
                return prevState?.map((item, index) => {
                  if (index + 1 === posicao && item?.grupo === grupo) {
                    return {
                      ...item,
                      listaNaoConformidades: t,
                      enunciado_id: enunciadoId,
                      form_ptp_id: selectedInitialQuestion?.id,
                      grupo,
                      posicao,
                    };
                  } else {
                    return {
                      listaNaoConformidades: t,
                      enunciado_id: enunciadoId,
                      form_ptp_id: selectedInitialQuestion?.id,
                      grupo,
                      posicao,
                    };
                  }
                });
              });
            }}
          />
        </View>
      )}

      <SelectWithLabel
        label="Qtde de pallets não conforme?"
        onValueChange={t => {
          onChange((prevState: any[]) => {
            return prevState?.map((item, index) => {
              if (index + 1 === posicao && item?.grupo === grupo) {
                return {
                  ...item,
                  qtdPalletsNaoConforme: t,
                  enunciado_id: enunciadoId,
                  form_ptp_id: selectedInitialQuestion?.id,
                  grupo,
                  posicao,
                };
              } else {
                return {
                  qtdPalletsNaoConforme: t,
                  enunciado_id: enunciadoId,
                  form_ptp_id: selectedInitialQuestion?.id,
                  grupo,
                  posicao,
                };
              }
            });
          });
        }}
        options={Array.from({ length: 30 }).map((_, index) => ({
          label: String(index + 1),
          value: String(index + 1),
        }))}
      />

      <SelectWithLabel
        label="Qtde de caixas não conforme?"
        onValueChange={t => {
          onChange((prevState: any[]) => {
            return prevState?.map((item, index) => {
              if (index + 1 === posicao && item?.grupo === grupo) {
                return {
                  ...item,
                  qtdCaixasNaoConforme: t,
                  enunciado_id: enunciadoId,
                  form_ptp_id: selectedInitialQuestion?.id,
                  grupo,
                  posicao,
                };
              } else {
                return {
                  qtdCaixasNaoConforme: t,
                  enunciado_id: enunciadoId,
                  form_ptp_id: selectedInitialQuestion?.id,
                  grupo,
                  posicao,
                };
              }
            });
          });
        }}
        options={Array.from({ length: 30 }).map((_, index) => ({
          label: String(index + 1),
          value: String(index + 1),
        }))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    color: '#222',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  label: {
    color: '#444',
    fontSize: 15,
    marginBottom: 4,
  },
  inputContainer: {
    marginBottom: 12,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#bbb',
    height: 40,
    fontSize: 16,
    paddingHorizontal: 8,
    marginBottom: 4,
    color: '#222',
  },
  radioContainer: {
    marginBottom: 12,
    width: '100%',
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  checkboxContainer: {
    marginBottom: 12,
    width: '100%',
  },
});
