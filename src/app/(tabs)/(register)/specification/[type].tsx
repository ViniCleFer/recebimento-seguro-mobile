import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
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
import {
  Box,
  HStack,
  Icon,
  Input,
  Pressable,
  Radio,
  Select,
  Text,
  useTheme,
  VStack,
} from 'native-base';
import { shade } from 'polished';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert } from 'react-native';
import { mask } from 'remask';
import * as z from 'zod';

import { Button } from '@/components/Button';
import { InputNormal } from '@/components/InputNormal';
import { Loading } from '@/components/Loading';
import { ScrollScreenContainer } from '@/components/ScrollScreenContainer';
import { SelectWithLabel } from '@/components/SelectWithLabel';

import { ConformidadesCheckboxControlled } from '@/components/ConformidadesCheckboxControlled';
import { InputWithLabelControlled } from '@/components/InputControlled';
import { RadioInput } from '@/components/RadioInput';
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
import { formatEnunciadoList } from '@/utils/formatEnunciadoList';
import { listaUPsOrigem } from '@/utils/listaUPs';

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
  const { colors } = useTheme();
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
    selectedFormPtp?.id,
    tipoCodigoProduto,
    codProduto,
    handleClear,
    rootNavigation,
    type,
    getSpecificationType,
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
    <>
      {isLoading && (
        <Loading
          flex={1}
          position={'absolute'}
          top={0}
          left={0}
          right={0}
          bottom={0}
          zIndex={100}
          backgroundColor={'rgba(000, 000, 000, 0.6)'}
        />
      )}
      <ScrollScreenContainer subtitle="PTP Logístico - RECEBIMENTO DE TRANSFERÊNCIAS EXTERNA C-PTP0046">
        <VStack px={2} space={6} mb={4} pt={2}>
          <Title>{getSpecificationType().text}</Title>
          <Pressable
            // onPress={() => {
            //   setIsDatePickerVisible(prevState => !prevState);
            // }}
            backgroundColor="primary.700"
            px={2}
            py={1}
            borderRadius={4}
            shadow={2}
            disabled
          >
            <HStack alignItems="center" justifyContent="space-between">
              <VStack>
                <Text color="white" fontWeight="semibold">
                  Data da identificação
                </Text>
                <Text color="white" fontWeight="bold">
                  {dayjs(dataIdentificacao).format('DD/MM/YYYY')}
                </Text>
              </VStack>
              <MaterialCommunityIcons
                name="calendar"
                color={colors.white}
                size={28}
              />
            </HStack>
          </Pressable>

          {isDatePickerVisible && (
            <Box alignSelf="center" pl={0}>
              <DateTimePicker
                mode="date"
                value={dataIdentificacao}
                locale="pt-BR"
                onChange={onChange}
                is24Hour={true}
                display="spinner"
                maximumDate={new Date()}
              />
            </Box>
          )}

          <Box mb={1}>
            <Text mb={-2} color="gray.750">
              Conferente/Técnico:
            </Text>

            <Input
              w="full"
              variant="underlined"
              height={14}
              size="md"
              fontSize="md"
              pb={0}
              placeholderTextColor="gray.700"
              value={conferente}
              onChangeText={setConferente}
              _focus={{ borderColor: 'primary.700' }}
              isDisabled={showEnunciados}
              autoComplete="off"
            />
          </Box>

          {getSpecificationType()?.type !== TipoEspecificacao.ARMAZENAMENTO && (
            <Box mb={1}>
              <Text mb={-2} color="gray.750">
                Nota Fiscal/DT:
              </Text>
              <Input
                w="full"
                variant="underlined"
                height={14}
                size="md"
                fontSize="md"
                pb={0}
                placeholderTextColor="gray.700"
                value={nota}
                onChangeText={setNota}
                _focus={{ borderColor: 'primary.700' }}
                placeholder=""
                isDisabled={showEnunciados}
                autoComplete="off"
                keyboardType="numeric"
                maxLength={10}
              />
            </Box>
          )}

          {getSpecificationType()?.type === TipoEspecificacao.RECEBIMENTO && (
            <SelectWithLabel
              label="UP de Origem"
              selectedValue={up}
              onValueChange={setUp}
              options={listaUPsOrigem?.map(s => (
                <Select.Item key={s?.value} label={s?.label} value={s?.value} />
              ))}
              isDisabled={showEnunciados}
            />
          )}

          {getSpecificationType()?.type === TipoEspecificacao.RECEBIMENTO && (
            <SelectWithLabel
              label="Quantidade analisada"
              selectedValue={qtdAnalisada}
              onValueChange={setQtdAnalisada}
              options={Array.from({ length: 30 })?.map((_, index) => (
                <Select.Item
                  key={String(index + 1)}
                  label={String(index + 1)}
                  value={String(index + 1)}
                />
              ))}
              isDisabled={showEnunciados}
            />
          )}

          <Box mb={1} width="100%">
            <Text mb={3} color="gray.750">
              Tipo do Código Produto
            </Text>
            <Radio.Group
              name="tipoCodigoProduto"
              value={tipoCodigoProduto}
              onChange={t => setTipoCodigoProduto(t as TipoCodigoProduto)}
              flexDirection="row"
              space={3}
              alignItems={'center'}
              width="100%"
              style={{ gap: 10 }}
              isDisabled={showEnunciados}
            >
              <RadioInput
                isDisabled={showEnunciados}
                value={TipoCodigoProduto.MISTO}
              >
                <Text>Misto</Text>
              </RadioInput>
              <RadioInput
                isDisabled={showEnunciados}
                value={TipoCodigoProduto.EXCLUSIVO}
                ml={5}
              >
                <Text>Excluisivo</Text>
              </RadioInput>
            </Radio.Group>
          </Box>

          {!showEnunciados && (
            <HStack width="100%" justifyContent="space-between" mt={4}>
              <Button
                width="48%"
                h="50px"
                backgroundColor="gray.700"
                title="Cancelar"
                _pressed={{ bg: 'gray.600' }}
                variant={'solid'}
                _text={{
                  color: 'white',
                }}
                onPress={() => {
                  handleCancel();
                }}
                disabled={isLoading}
                leftIcon={<Icon as={MaterialIcons} name="delete" size="md" />}
              />

              <Button
                width="48%"
                h="50px"
                backgroundColor="primary.700"
                title="Salvar"
                _pressed={{ bg: shade(0.3, '#2e2efe') }}
                variant={'solid'}
                _text={{
                  color: 'white',
                }}
                onPress={handleSaveInitialFormPtp}
                isLoading={isLoading}
                disabled={isLoading}
                leftIcon={<Icon as={MaterialIcons} name="save" size="md" />}
              />
            </HStack>
          )}
        </VStack>

        {showEnunciados && (
          <>
            {isLoadingEnunciados ? (
              <VStack
                justifyContent="center"
                alignItems="center"
                space={2}
                mb="20%"
                pt={2}
              >
                <Text color="primary.700" fontSize="2xl" fontWeight="bold">
                  Carregando Enunciados...
                </Text>
              </VStack>
            ) : (
              <VStack px={2} space={2} mb="20%" pt={2}>
                {enunciadosList?.length > 0 && (
                  <>
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
                              <VStack key={index} space={3} mb={3} pt={2}>
                                <Text
                                  color="gray.800"
                                  fontSize={'lg'}
                                  fontWeight={'semibold'}
                                  mb={4}
                                >
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

                                <Box mb={1} width="100%">
                                  <Text mb={3} color="gray.750">
                                    Há não conformidade?
                                  </Text>

                                  <Controller
                                    control={control}
                                    name={`respostas.${index}.naoConformidade`}
                                    render={({ field }) => (
                                      <Radio.Group
                                        name="naoConformidade"
                                        value={String(field.value)}
                                        onChange={t => {
                                          field.onChange(t);
                                          setValue(
                                            `respostas.${index}.enunciado_id`,
                                            item?.id,
                                          );
                                        }}
                                        flexDirection="row"
                                        space={3}
                                        alignItems={'center'}
                                        width="100%"
                                        style={{ gap: 10 }}
                                      >
                                        <RadioInput value="sim">
                                          <Text>Sim</Text>
                                        </RadioInput>
                                        <RadioInput value="nao" ml={5}>
                                          <Text>Não</Text>
                                        </RadioInput>
                                      </Radio.Group>
                                    )}
                                  />
                                </Box>

                                {respostas[index]?.naoConformidade ===
                                  'sim' && (
                                  <>
                                    {item?.temLote && (
                                      <InputWithLabelControlled
                                        label="Lote"
                                        control={control}
                                        index={index}
                                        name="lote"
                                        keyboardType="numeric"
                                        autoCorrect={false}
                                        maxLength={10}
                                      />
                                    )}

                                    {item?.temDetalheNaoConformidade && (
                                      <Box mb={1} width="100%">
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
                                      </Box>
                                    )}

                                    {item?.temQtdPalletsNaoConforme && (
                                      <SelectWithLabelControlled
                                        label="Qtde de pallets não conforme?"
                                        control={control}
                                        index={index}
                                        name="qtdPalletsNaoConforme"
                                        options={Array.from({
                                          length: 30,
                                        })?.map((_, index) => (
                                          <Select.Item
                                            key={String(index + 1)}
                                            label={String(index + 1)}
                                            value={String(index + 1)}
                                          />
                                        ))}
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
                                  </>
                                )}
                              </VStack>
                            );
                          })}
                        </Fragment>
                      );
                    })}
                    <HStack width="100%" justifyContent="center" mt={4}>
                      <Button
                        h="50px"
                        backgroundColor="primary.700"
                        title="Salvar Respostas"
                        _pressed={{ bg: shade(0.3, '#2e2efe') }}
                        variant={'solid'}
                        _text={{
                          color: 'white',
                        }}
                        onPress={() => handleSaveFormPtpAnswers()}
                        isLoading={isLoading}
                        disabled={isLoading}
                        leftIcon={
                          <Icon as={MaterialIcons} name="save" size="md" />
                        }
                      />
                    </HStack>
                  </>
                )}
              </VStack>
            )}
          </>
        )}
      </ScrollScreenContainer>
    </>
  );
}
