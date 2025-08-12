import { MaterialCommunityIcons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { StackActions } from '@react-navigation/native';
import dayjs from 'dayjs';
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
  useNavigationContainerRef,
} from 'expo-router';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { mask } from 'remask';
import * as z from 'zod';

import { Button } from '@/components/Button';
import { ConformidadesCheckboxControlled } from '@/components/ConformidadesCheckboxControlled';
import { InputWithLabelControlled } from '@/components/InputControlled';
import { InputNormal } from '@/components/InputNormal';
import { Loading } from '@/components/Loading';
import { RadioInput } from '@/components/RadioInput';
import { ScrollScreenContainer } from '@/components/ScrollScreenContainer';
import { SelectWithLabel } from '@/components/SelectWithLabel';
import { SelectWithLabelControlled } from '@/components/SelectWithLabelControlled';
import Title from '@/components/Title';

import {
  EnunciadoToList,
  GrupoEnunciado,
  TipoEspecificacao,
} from '@/services/requests/enunciados/types';
import { getEnunciadosRequest } from '@/services/requests/enunciados/utils';
import { FormPtpAnswerPost } from '@/services/requests/form-ptp-answers/types';
import { createFormPtpAnswerRequest } from '@/services/requests/form-ptp-answers/utils';
import {
  FormPtpStatus,
  TipoCodigoProduto,
} from '@/services/requests/forms-ptp/types';
import { createFormPtpRequest } from '@/services/requests/forms-ptp/utils';
import useAuthStore from '@/store/auth';
import useFormPtpStore from '@/store/forms-ptp';
import { colors } from '@/styles/theme';
import { formatEnunciadoList } from '@/utils/formatEnunciadoList';
import { listaUPsOrigem } from '@/utils/listaUPs';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 24,
    paddingBottom: 16,
    gap: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  dateContainer: {
    backgroundColor: '#084077',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 4,
  },
  dateContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateLabel: {
    color: 'white',
    fontWeight: '600',
  },
  dateValue: {
    color: 'white',
    fontWeight: 'bold',
  },
  inputGroup: {
    marginBottom: 4,
  },
  inputLabel: {
    marginBottom: -8,
    color: '#6b7280',
  },
  textInput: {
    width: '100%',
    height: 56,
    fontSize: 16,
    paddingBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    width: '100%',
  },
  radioLabel: {
    color: '#6b7280',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  loadingOverlay: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  enunciadosContainer: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    paddingBottom: '20%',
    gap: 8,
  },
  enunciadosLoadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: '20%',
    paddingTop: 8,
  },
  enunciadosLoadingText: {
    color: '#084077',
    fontSize: 20,
    fontWeight: 'bold',
  },
  enunciadoItem: {
    gap: 12,
    marginBottom: 12,
    paddingTop: 8,
  },
  enunciadoText: {
    color: '#1f2937',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  centerButton: {
    width: '100%',
    justifyContent: 'center',
    marginTop: 16,
  },
});

const formAnswersSchema = z.object({
  respostas: z
    .array(
      z.object({
        form_ptp_id: z.string().min(1, 'Campo obrigatório'),
        enunciado_id: z.string().min(1, 'Campo obrigatório'),
        codProduto: z.string().min(1, 'Campo obrigatório'),
        naoConformidade: z.string().min(1, 'Campo obrigatório'),
        detalheNaoConformidade: z.array(z.string()).optional(),
        lote: z.string().optional(),
        qtdPalletsNaoConforme: z.number().min(1, 'Campo obrigatório'),
        qtdCaixasNaoConforme: z.number().min(1, 'Campo obrigatório'),
      }),
    )
    .nonempty(),
});

export default function Divergency() {
  const { back, push, replace } = router;
  const rootNavigation = useNavigationContainerRef();

  const { selectedFormPtp, setSelectedFormPtp } = useFormPtpStore(
    state => state,
  );

  const { type } = useLocalSearchParams<{ type: string }>();

  const user = useAuthStore(state => state.user);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEnunciados, setIsLoadingEnunciados] = useState(false);

  const [dataIdentificacao, setDataIdentificacao] = useState(new Date());
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [conferente, setConferente] = useState('');
  const [nota, setNota] = useState('');
  const [up, setUp] = useState('');
  const [codProduto, setCodProduto] = useState('');
  const [qtdAnalisada, setQtdAnalisada] = useState('');
  const [tipoCodigoProduto, setTipoCodigoProduto] = useState<TipoCodigoProduto>(
    TipoCodigoProduto.EXCLUSIVO,
  );
  const [enunciadosList, setEnunciadosList] = useState<
    {
      grupoFormatado: string;
      grupo: GrupoEnunciado;
      enunciados: EnunciadoToList[];
      index: number;
    }[]
  >([]);
  const [showEnunciados, setShowEnunciados] = useState(false);
  const [conferenteFocused, setConferenteFocused] = useState(false);
  const [notaFocused, setNotaFocused] = useState(false);

  const { control, watch, getValues, setValue } = useForm<any>({
    resolver: zodResolver(formAnswersSchema),
    defaultValues: {
      respostas: enunciadosList?.flatMap(grupo =>
        grupo?.enunciados?.map(() => ({
          form_ptp_id: '',
          enunciado_id: '',
          codProduto: '',
          naoConformidade: 'nao',
          detalheNaoConformidade: [],
          lote: '',
          qtdPalletsNaoConforme: 0,
          qtdCaixasNaoConforme: 0,
        })),
      ),
    },
  });

  const getSpecificationType = () => {
    if (type && type === 'armazenamento') {
      return {
        type: TipoEspecificacao.ARMAZENAMENTO,
        text: 'Armazenamento',
      };
    }
    if (type && type === 'recebimento') {
      return {
        type: TipoEspecificacao.RECEBIMENTO,
        text: 'Recebimento',
      };
    }
    if (type && type === 'separacao') {
      return {
        type: TipoEspecificacao.SEPARACAO_MONTAGEM,
        text: 'Separação e Montagem',
      };
    }
    return {
      type: TipoEspecificacao.RECEBIMENTO,
      text: 'Recebimento',
    };
  };

  async function loadEnunciados() {
    // setIsLoading(true);
    // try {
    const response = await getEnunciadosRequest();

    console.log(
      'getEnunciadosRequest response',
      JSON.stringify(response, null, 2),
    );
    console.log('getEnunciadosRequest type', getSpecificationType().type);

    if (!response) {
      setIsLoading(false);

      return console.error('Error ActionsList loadEnunciados => ', response);
    }

    // if (response?.status === 200 && response?.data?.enunciadosCount > 0) {
    const enunciadosActiveFormatted = formatEnunciadoList(
      response,
      getSpecificationType().type,
    );

    console.log(
      'enunciadosActiveFormatted',
      JSON.stringify(enunciadosActiveFormatted, null, 2),
    );

    setEnunciadosList([...enunciadosActiveFormatted]);
    // }
    // } catch (error) {
    // console.error('Error ActionsList loadEnunciados => ', error);
    // console.log('enunciadosActiveFormatted', JSON.stringify(response, null, 2));
    // } finally {
    setIsLoading(false);
    // }
  }

  useFocusEffect(
    useCallback(() => {
      if (type) {
        console.log('type', type);
        loadEnunciados();
      }
    }, [type]),
  );

  const onChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date | undefined,
  ) => {
    setDataIdentificacao(selectedDate!);
    setIsDatePickerVisible(false);
  };

  const handleClear = useCallback(() => {
    setConferente('');
    setNota('');
    setUp('');
    setDataIdentificacao(new Date());
    setQtdAnalisada('');
    setCodProduto('');
    setTipoCodigoProduto(TipoCodigoProduto.EXCLUSIVO);
    setIsDatePickerVisible(false);

    setShowEnunciados(false);
    setValue('respostas', []);
  }, [setValue]);

  const handleBack = useCallback(() => {
    setSelectedFormPtp(null);
    back();
    handleClear();
  }, [back, handleClear, setSelectedFormPtp]);

  const handleSaveInitialFormPtp = useCallback(async () => {
    setIsLoading(true);

    if (getSpecificationType()?.type === TipoEspecificacao.RECEBIMENTO) {
      if (
        !type ||
        !dataIdentificacao ||
        !conferente ||
        !nota ||
        !up ||
        !qtdAnalisada
      ) {
        Alert.alert(
          'Salvar PTP',
          'Por favor, preencha todos os campos para responder as perguntas.',
        );
        setIsLoading(false);
        return;
      }
    }
    if (getSpecificationType()?.type === TipoEspecificacao.SEPARACAO_MONTAGEM) {
      if (!type || !dataIdentificacao || !conferente || !nota) {
        Alert.alert(
          'Salvar PTP',
          'Por favor, preencha todos os campos para responder as perguntas.',
        );
        setIsLoading(false);
        return;
      }
    }
    if (getSpecificationType()?.type === TipoEspecificacao.ARMAZENAMENTO) {
      if (!type || !dataIdentificacao || !conferente) {
        Alert.alert(
          'Salvar PTP',
          'Por favor, preencha todos os campos para responder as perguntas.',
        );
        setIsLoading(false);
        return;
      }
    }

    const data = {
      dataExecucao: dataIdentificacao,
      conferente,
      notaFiscal: nota ? nota : null,
      opcaoUp: up ? up : null,
      status: FormPtpStatus.EM_ANDAMENTO,
      qtdAnalisada: qtdAnalisada ? Number(qtdAnalisada) : null,
      tipoCodigoProduto: tipoCodigoProduto,
      tipoEspecificacao: getSpecificationType()?.type!,
    };

    // console.log('formPtp', JSON.stringify(data, null, 2));

    const response = await createFormPtpRequest(data);
    // console.log('response', JSON.stringify(response, null, 2));

    if (response?.status === 201 && response?.data?.length > 0) {
      // console.log('response', JSON.stringify(response, null, 2));

      setSelectedFormPtp({
        ...response?.data[0],
      });

      setShowEnunciados(true);
    } else {
      Alert.alert(
        'Salvar PTP',
        'Ocorreu um erro ao salvar o PTP, tente novamente mais tarde.',
      );
    }
    setIsLoading(false);
  }, [
    dataIdentificacao,
    conferente,
    nota,
    up,
    qtdAnalisada,
    tipoCodigoProduto,
    setSelectedFormPtp,
    type,
    getSpecificationType,
  ]);

  const handleSaveFormPtpAnswers = useCallback(async () => {
    const itensProcessados: any[] = [];
    setIsLoading(true);

    console.log('tipoCodigoProduto', tipoCodigoProduto);
    console.log('codProduto', codProduto);

    const enunciadosListFormatted = enunciadosList
      ?.map(en => en.enunciados?.map(item => item)?.flatMap(f => f))
      ?.flatMap(f => f);
    console.log('ok', JSON.stringify(enunciadosListFormatted, null, 2));

    if (tipoCodigoProduto === TipoCodigoProduto.EXCLUSIVO && !codProduto) {
      Alert.alert(
        'Salvar Respostas PTP',
        'Por favor, preencha o campo Código Produto ele é obrigatório.',
      );
      setIsLoading(false);
      return;
    }

    const respostas = getValues('respostas');
    console.log('respostas', JSON.stringify(respostas, null, 2));

    try {
      for await (const resposta of respostas) {
        const haNaoConformidade = resposta?.naoConformidade === 'sim';
        const codProdutoCorreto =
          tipoCodigoProduto === TipoCodigoProduto.EXCLUSIVO
            ? codProduto
            : resposta?.codProduto;
        const itemEnunciado = enunciadosListFormatted?.find(
          (enunciado: EnunciadoToList) =>
            enunciado?.id === resposta?.enunciado_id,
        );
        const detalheNaoConformidade = itemEnunciado?.opcoesNaoConformidades;

        const data: FormPtpAnswerPost = {
          form_ptp_id: selectedFormPtp?.id!,
          enunciado_id: resposta?.enunciado_id,
          codProduto: codProdutoCorreto,
          naoConformidade: haNaoConformidade,
          detalheNaoConformidade: haNaoConformidade
            ? itemEnunciado?.isChecked
              ? detalheNaoConformidade
              : resposta?.detalheNaoConformidade || []
            : [],
          lote: haNaoConformidade
            ? resposta?.lote
              ? resposta?.lote
              : null
            : null,
          qtdPalletsNaoConforme: haNaoConformidade
            ? resposta?.qtdPalletsNaoConforme
              ? Number(resposta?.qtdPalletsNaoConforme)
              : 0
            : 0,
          qtdCaixasNaoConforme: haNaoConformidade
            ? resposta?.qtdCaixasNaoConforme
              ? Number(resposta?.qtdCaixasNaoConforme)
              : 0
            : 0,
          necessitaCrm: haNaoConformidade,
          tipoEspecificacao: getSpecificationType()?.type!,
        };

        console.log('data', JSON.stringify(data, null, 2));

        const response = await createFormPtpAnswerRequest(data);
        // console.log('response', JSON.stringify(response, null, 2));

        if (
          response?.status === 201 &&
          response?.data &&
          response?.data?.length > 0
        ) {
          itensProcessados.push({
            ...response?.data[0],
            codigoProdutos: haNaoConformidade ? codProdutoCorreto : [],
            qtdCaixasNaoConformes: haNaoConformidade
              ? resposta?.qtdCaixasNaoConforme
              : [],
            status: 'Sucesso',
          });
        } else {
          itensProcessados.push({
            ...resposta,
            status: 'Erro',
            ...data,
          });
        }
      }

      console.log(
        'itensProcessados',
        JSON.stringify(itensProcessados, null, 2),
      );

      setIsLoading(false);

      const todosSucesso = itensProcessados.every(
        item => item.status === 'Sucesso',
      );
      const respostaErro = itensProcessados.filter(
        item => item.status === 'Erro',
      );
      console.log('respostaErro', JSON.stringify(respostaErro, null, 2));

      if (todosSucesso) {
        const haNaoConformidade = itensProcessados.some(
          answer => answer.naoConformidade,
        );

        console.log('haNaoConformidadeQuestionSix', haNaoConformidade);

        if (
          haNaoConformidade &&
          getSpecificationType()?.type === TipoEspecificacao.RECEBIMENTO
        ) {
          const lotesMapped = itensProcessados
            ?.map(item => (item?.lote ? item?.lote?.trim() : item?.lote))
            ?.filter(Boolean) as string[];
          const codigoProdutosMapped = itensProcessados
            ?.map(item =>
              tipoCodigoProduto === TipoCodigoProduto.EXCLUSIVO
                ? item?.codigoProdutos
                : item?.codigoProdutos?.trim(),
            )
            ?.filter(Boolean) as string[];
          const qtdCaixasNaoConformesMapped = itensProcessados
            ?.map(item =>
              item?.qtdCaixasNaoConformes
                ? item?.qtdCaixasNaoConformes
                : item?.qtdCaixasNaoConformes,
            )
            ?.filter(Boolean) as string[];
          const detalheNaoConformidadeMapped = itensProcessados
            ?.map(item => item?.detalheNaoConformidade)
            ?.filter(Boolean)
            ?.flatMap(item => item) as string[];

          console.log('lotesMapped', lotesMapped);
          console.log('codigoProdutosMapped', codigoProdutosMapped);
          console.log(
            'qtdCaixasNaoConformesMapped',
            qtdCaixasNaoConformesMapped,
          );
          console.log(
            'detalheNaoConformidadeMapped',
            detalheNaoConformidadeMapped,
          );

          setSelectedFormPtp({
            ...(selectedFormPtp as any),
            lotes: lotesMapped,
            codigoProdutos: codigoProdutosMapped,
            qtdCaixasNaoConformes: qtdCaixasNaoConformesMapped,
            detalheNaoConformidade: detalheNaoConformidadeMapped,
          });

          return Alert.alert(
            'Sucesso!',
            'Respostas do PTP cadastradas com sucesso!\nVocê será redirecionado para preencher o Laudo CRM',
            [
              {
                text: 'Fechar',
                onPress: () => {
                  push(`/laudo-crm/${selectedFormPtp?.id}`);
                },
              },
            ],
          );
        } else {
          return Alert.alert(
            'Sucesso!',
            'Respostas do PTP cadastradas com sucesso!\nNão há necessidade de preencher o Laudo CRM',
            [
              {
                text: 'Fechar',
                onPress: () => {
                  handleClear();
                  rootNavigation.dispatch(StackActions.popToTop());
                  replace('/(tabs)/(list)');
                },
              },
            ],
          );
        }
      } else {
        Alert.alert(
          'Salvar Resposta do PTP',
          `Ocorreu um erro ao salvar a Resposta do PTP, tente novamente mais tarde.\n 
          ${respostaErro?.length > 1 ? 'Itens com erro' : 'Item com erro'}\n
          ${
            respostaErro?.length > 1
              ? respostaErro?.map(item => item?.enunciado_id).join(', ')
              : respostaErro?.[0]?.enunciado_id
          }
        `,
        );
      }
    } catch (error) {
      console.error('Error handleSaveFormPtpAnswers => ', error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }, [
    push,
    replace,
    getValues,
    setSelectedFormPtp,
    selectedFormPtp,
    tipoCodigoProduto,
    codProduto,
    handleClear,
    rootNavigation,
    getSpecificationType,
    enunciadosList,
  ]);

  const respostas = watch('respostas');

  useEffect(() => {
    console.log('respostas', JSON.stringify(respostas, null, 2));
  }, [respostas]);

  const handleCancel = useCallback(() => {
    Alert.alert(
      'Cancelar PTP',
      'Você deseja cancelar o lançamento? Se sim irá apagar tudo que foi respondido',
      [
        {
          text: 'Não',
        },
        {
          text: 'Sim',
          onPress: () => {
            handleBack();
          },
        },
      ],
    );
  }, [handleBack]);

  return (
    <Fragment>
      {isLoading && <Loading style={styles.loadingOverlay} />}
      <ScrollScreenContainer subtitle="PTP Logístico - RECEBIMENTO DE TRANSFERÊNCIAS EXTERNA C-PTP0046">
        <View style={styles.container}>
          <Title>{getSpecificationType().text}</Title>
          <TouchableOpacity style={styles.dateContainer} disabled>
            <View style={styles.dateContent}>
              <View>
                <Text style={styles.dateLabel}>Data da identificação</Text>
                <Text style={styles.dateValue}>
                  {dayjs(dataIdentificacao).format('DD/MM/YYYY')}
                </Text>
              </View>
              <MaterialCommunityIcons
                name="calendar"
                color="#ffffff"
                size={28}
              />
            </View>
          </TouchableOpacity>

          {isDatePickerVisible && (
            <View style={{ alignSelf: 'center', paddingLeft: 0 }}>
              <DateTimePicker
                mode="date"
                value={dataIdentificacao}
                locale="pt-BR"
                onChange={onChange}
                is24Hour={true}
                display="spinner"
                maximumDate={new Date()}
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Conferente/Técnico:</Text>
            <TextInput
              style={[
                styles.textInput,
                conferenteFocused && {
                  borderBottomColor: '#084077',
                  borderBottomWidth: 2,
                },
              ]}
              value={conferente}
              onChangeText={setConferente}
              placeholderTextColor="#6b7280"
              editable={!showEnunciados}
              autoComplete="off"
              onFocus={() => setConferenteFocused(true)}
              onBlur={() => setConferenteFocused(false)}
            />
          </View>

          {getSpecificationType()?.type !== TipoEspecificacao.ARMAZENAMENTO && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nota Fiscal/DT:</Text>
              <TextInput
                style={[
                  styles.textInput,
                  notaFocused && {
                    borderBottomColor: '#084077',
                    borderBottomWidth: 2,
                  },
                ]}
                value={nota}
                onChangeText={setNota}
                placeholderTextColor="#6b7280"
                placeholder=""
                editable={!showEnunciados}
                autoComplete="off"
                keyboardType="numeric"
                maxLength={10}
                onFocus={() => setNotaFocused(true)}
                onBlur={() => setNotaFocused(false)}
              />
            </View>
          )}

          {getSpecificationType()?.type === TipoEspecificacao.RECEBIMENTO && (
            <SelectWithLabel
              label="UP de Origem"
              value={up}
              onValueChange={setUp}
              options={listaUPsOrigem?.map(s => ({
                label: s?.label,
                value: s?.value,
              }))}
            />
          )}

          {getSpecificationType()?.type === TipoEspecificacao.RECEBIMENTO && (
            <SelectWithLabel
              label="Quantidade analisada"
              value={qtdAnalisada}
              onValueChange={setQtdAnalisada}
              options={Array.from({ length: 30 })?.map((_, index) => ({
                label: String(index + 1),
                value: String(index + 1),
              }))}
            />
          )}

          <View style={[styles.inputGroup, { width: '100%' }]}>
            <Text style={styles.radioLabel}>Tipo do Código Produto</Text>
            <View style={styles.radioGroup}>
              <RadioInput
                value={TipoCodigoProduto.MISTO}
                isSelected={tipoCodigoProduto === TipoCodigoProduto.MISTO}
                onSelect={value =>
                  setTipoCodigoProduto(value as TipoCodigoProduto)
                }
                disabled={showEnunciados}
              >
                <Text>Misto</Text>
              </RadioInput>
              <RadioInput
                value={TipoCodigoProduto.EXCLUSIVO}
                isSelected={tipoCodigoProduto === TipoCodigoProduto.EXCLUSIVO}
                onSelect={value =>
                  setTipoCodigoProduto(value as TipoCodigoProduto)
                }
                disabled={showEnunciados}
              >
                <Text>Exclusivo</Text>
              </RadioInput>
            </View>
          </View>

          {!showEnunciados && (
            <View style={styles.buttonRow}>
              <Button
                title="Cancelar"
                onPress={() => {
                  handleCancel();
                }}
                disabled={isLoading}
                style={{ width: '48%', backgroundColor: colors.gray500 }}
              />

              <Button
                title="Salvar"
                onPress={handleSaveInitialFormPtp}
                disabled={isLoading}
                style={{ width: '48%', backgroundColor: colors.primary }}
              />
            </View>
          )}
        </View>

        {showEnunciados && (
          <Fragment>
            {isLoadingEnunciados ? (
              <View style={styles.enunciadosLoadingContainer}>
                <Text style={styles.enunciadosLoadingText}>
                  Carregando Enunciados...
                </Text>
              </View>
            ) : (
              <View style={styles.enunciadosContainer}>
                {enunciadosList?.length > 0 && (
                  <Fragment>
                    {tipoCodigoProduto === TipoCodigoProduto.EXCLUSIVO && (
                      <InputNormal
                        label="Código Produto"
                        value={codProduto}
                        onChangeText={value =>
                          setCodProduto(mask(value, '99.999999'))
                        }
                        maxLength={9}
                        textTransform="none"
                        keyboardType="numeric"
                      />
                    )}

                    {enunciadosList?.map((enunciado, grupoIndex) => {
                      return (
                        <Fragment key={grupoIndex}>
                          <Title>{enunciado?.grupoFormatado}</Title>
                          {enunciado?.enunciados?.map(item => {
                            const index = item?.index;

                            return (
                              <View key={index} style={styles.enunciadoItem}>
                                <Text style={styles.enunciadoText}>
                                  {`${item?.posicao}) ${item?.descricao}`}
                                </Text>

                                {tipoCodigoProduto ===
                                  TipoCodigoProduto.MISTO && (
                                  <InputWithLabelControlled
                                    label="Código Produto"
                                    control={control}
                                    index={index}
                                    name="codProduto"
                                    keyboardType="numeric"
                                    multiline
                                    numberOfLines={4}
                                  />
                                )}

                                <View
                                  style={[styles.inputGroup, { width: '100%' }]}
                                >
                                  <Text style={styles.radioLabel}>
                                    Há não conformidade?
                                  </Text>

                                  <Controller
                                    control={control}
                                    name={`respostas.${index}.naoConformidade`}
                                    render={({ field }) => (
                                      <View style={styles.radioGroup}>
                                        <RadioInput
                                          value="sim"
                                          isSelected={
                                            String(field.value) === 'sim'
                                          }
                                          onSelect={(value: string) => {
                                            field.onChange(value);
                                            setValue(
                                              `respostas.${index}.enunciado_id`,
                                              item?.id,
                                            );
                                          }}
                                        >
                                          <Text>Sim</Text>
                                        </RadioInput>
                                        <RadioInput
                                          value="nao"
                                          isSelected={
                                            String(field.value) === 'nao'
                                          }
                                          onSelect={(value: string) => {
                                            field.onChange(value);
                                            setValue(
                                              `respostas.${index}.enunciado_id`,
                                              item?.id,
                                            );
                                          }}
                                        >
                                          <Text>Não</Text>
                                        </RadioInput>
                                      </View>
                                    )}
                                  />
                                </View>

                                {respostas[index]?.naoConformidade ===
                                  'sim' && (
                                  <Fragment>
                                    {item?.temLote && (
                                      <InputWithLabelControlled
                                        label="Lote"
                                        control={control}
                                        index={index}
                                        name="lote"
                                        keyboardType="numeric"
                                        autoCorrect={false}
                                        maxLength={100}
                                      />
                                    )}

                                    {item?.temDetalheNaoConformidade && (
                                      <View
                                        style={[
                                          styles.inputGroup,
                                          { width: '100%' },
                                        ]}
                                      >
                                        <ConformidadesCheckboxControlled
                                          label="Selecione as Não conformidades"
                                          control={control}
                                          index={index}
                                          name="detalheNaoConformidade"
                                          optionNaoConformidadesList={
                                            item?.opcoesNaoConformidades
                                          }
                                          isChecked={item?.isChecked}
                                        />
                                      </View>
                                    )}

                                    {item?.temQtdPalletsNaoConforme && (
                                      <SelectWithLabelControlled
                                        label="Qtde de pallets não conforme?"
                                        control={control}
                                        index={index}
                                        name="qtdPalletsNaoConforme"
                                        options={Array.from({
                                          length: 30,
                                        })?.map((_, index) => ({
                                          label: String(index + 1),
                                          value: String(index + 1),
                                        }))}
                                      />
                                    )}

                                    {item?.temQtdCaixasNaoConforme && (
                                      <InputWithLabelControlled
                                        label="Qtde de caixas/fardos não conforme?"
                                        control={control}
                                        index={index}
                                        name="qtdCaixasNaoConforme"
                                        keyboardType="numeric"
                                        autoCorrect={false}
                                      />
                                    )}
                                  </Fragment>
                                )}
                              </View>
                            );
                          })}
                        </Fragment>
                      );
                    })}
                    <View style={styles.centerButton}>
                      <Button
                        title="Salvar Respostas"
                        onPress={() => handleSaveFormPtpAnswers()}
                        disabled={isLoading}
                        style={{ backgroundColor: '#084077' }}
                      />
                    </View>
                  </Fragment>
                )}
              </View>
            )}
          </Fragment>
        )}
      </ScrollScreenContainer>
    </Fragment>
  );
}
