import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { decode } from 'base64-arraybuffer';
import dayjs from 'dayjs';
import {
  type CameraPictureOptions,
  CameraView,
  useCameraPermissions,
} from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
  useNavigationContainerRef,
} from 'expo-router';
import mime from 'mime';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { mask } from 'remask';
import { v4 as uuidv4 } from 'uuid';

import { Button } from '@/components/Button';
import { ConformidadesCheckbox } from '@/components/ConformidadesCheckbox';
import { Loading } from '@/components/Loading';
import { RadioInput } from '@/components/RadioInput';
import { ScrollScreenContainer } from '@/components/ScrollScreenContainer';
import { SelectWithLabel } from '@/components/SelectWithLabel';
import Title from '@/components/Title';
import { supabase } from '@/lib/supabase';
import {
  DivergenciaPost,
  TipoDivergencia,
} from '@/services/requests/divergences/types';
import { createDivergenceRequest } from '@/services/requests/divergences/utils';
import {
  LaudoCrmPost,
  TipoEvidencia,
  Turno,
} from '@/services/requests/laudos/types';
import { createLaudoCrmRequest } from '@/services/requests/laudos/utils';
import useAuthStore from '@/store/auth';
import useFormPtpStore from '@/store/forms-ptp';
import { generateFolderName } from '@/utils/generateFoldername';
import { getNextStepsByDivergencyType } from '@/utils/getNextStepsByDivergencyType';
import { listaTurnos } from '@/utils/listaTurnos';
import { listaCDsOrigem, listaUPsOrigem } from '@/utils/listaUPs';
import { tiposDivergencia } from '@/utils/tiposDivergencia';
import { StackActions } from '@react-navigation/native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  takePictureContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    bottom: '-88%',
    position: 'relative',
  },
  closeCamera: {
    position: 'absolute',
    right: 30,
  },
  loadingOverlay: {
    flex: 1,
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  captureButton: {
    backgroundColor: '#fff',
    height: 60,
    width: 60,
    borderRadius: 30,
  },
});

// pegar codigoProduto, notaFiscal, UpOrigem do FormPtp

export default function LaudoCrm() {
  const { replace } = router;
  const rootNavigation = useNavigationContainerRef();

  // const id = '111f2687-9f88-4500-bf1b-eb2238d22750';
  const { id: formPtpId } = useLocalSearchParams<{ id: string }>();

  const user = useAuthStore(state => state.user);
  const { selectedFormPtp, setSelectedFormPtp } = useFormPtpStore(
    state => state,
  );

  const [isLoading, setIsLoading] = useState(false);

  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [imagesList, setImagesList] = useState<any[]>([]);

  const [remessa, setRemessa] = useState('');
  const [transportador, setTransportador] = useState('');
  const [placa, setPlaca] = useState('');
  const [notaFiscal, setNotaFiscal] = useState(''); // inicial
  const [conferente, setConferente] = useState(''); // inicial
  const [dataIdentificacao, setDataIdentificacao] = useState(new Date());
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [turno, setTurno] = useState('');
  const [upOrigem, setUpOrigem] = useState('');
  const [cdOrigem, setCdOrigem] = useState('');
  const [lotes, setLotes] = useState('');
  const [codigoProdutos, setCodigoProdutos] = useState('');
  const [qtdCaixasNaoConformes, setQtdCaixasNaoConformes] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [tipoEvidencia, setTipoEvidencia] = useState<TipoEvidencia | null>(
    null,
  );

  const [haDivergencia, setHaDivergencia] = useState('nao');
  const [divergenciaSelecionada, setDivergenciaSelecionada] =
    useState<TipoDivergencia | null>(null);
  const [sku, setSku] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [skuNotaFiscal, setSkuNotaFiscal] = useState('');
  const [quantidadeNotaFiscal, setQuantidadeNotaFiscal] = useState('');

  const [naoConformidadesList, setNaoConformidadesList] = useState<any[]>([]);

  console.log('selectedFormPtp', selectedFormPtp);

  const [permission, requestPermission] = useCameraPermissions();

  const cameraRef = useRef<any>(null);

  useEffect(() => {
    requestPermission();
  }, []);

  if (!permission?.granted) {
    console.log('Não permitiu');
  }

  // async function loadFormPtp() {
  //   setIsLoading(true);
  //   try {
  //     const response = await getFormsPtpAnswerByFormPtpIdRequest(formPtpId);

  //     if (
  //       response?.status === 200 &&
  //       selectedFormPtp?.conferente &&
  //       selectedFormPtp?.notaFiscal
  //     ) {
  //       const formPtpAnswers = response?.data[0];

  //       setNotaFiscal(selectedFormPtp?.notaFiscal);
  //       setConferente(selectedFormPtp?.conferente);
  //       setLotes(selectedFormPtp?.lotes!?.map(lote => lote).join(', '));
  //       setCodigoProdutos(
  //         selectedFormPtp
  //           ?.codigoProdutos!?.map(codProduto => codProduto)
  //           ?.join(', '),
  //       );
  //       setNaoConformidadesList(selectedFormPtp?.detalheNaoConformidade!);

  //       // console.log('formPtpAnswers', JSON.stringify(formPtpAnswers, null, 2));

  //       // if (formPtpAnswers?.length > 0) {
  //       //   const naoConformidades = formPtpAnswers
  //       //     ?.map((formPtpAnswer: FormPtpAnswer) => {
  //       //       if (formPtpAnswer?.detalheNaoConformidade?.length > 0) {
  //       //         return formPtpAnswer?.detalheNaoConformidade?.split(',');
  //       //       } else {
  //       //         return null;
  //       //       }
  //       //     })
  //       //     ?.filter(Boolean)
  //       //     ?.flat();

  //       //   const naoConformidadesWithoutDuplicated =
  //       //     naoConformidades?.length > 0
  //       //       ? removeDuplicatesItems(naoConformidades)
  //       //       : [];

  //       //     }
  //     }
  //   } catch (error) {
  //     console.log('Error loadFormPtp => ', JSON.stringify(error));
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  // useEffect(() => {
  //   if (formPtpId) {
  //     loadFormPtp();
  //   }
  // }, [formPtpId]);

  useFocusEffect(
    useCallback(() => {
      console.log('formPtpId', formPtpId);
      if (selectedFormPtp) {
        // loadFormPtp();
        setNotaFiscal(selectedFormPtp?.notaFiscal!);
        setUpOrigem(selectedFormPtp?.opcaoUp!);
        setConferente(selectedFormPtp?.conferente!);
        setLotes(
          Array.isArray(selectedFormPtp?.lotes)
            ? selectedFormPtp.lotes
                .filter(lote => !!lote && String(lote).trim() !== '')
                .join(', ')
            : '',
        );
        setQtdCaixasNaoConformes(
          Array.isArray(selectedFormPtp?.qtdCaixasNaoConformes)
            ? selectedFormPtp.qtdCaixasNaoConformes
                .filter(
                  item =>
                    !!item &&
                    (!Array.isArray(item) || item.length > 0) &&
                    String(item).trim() !== '',
                )
                .join(', ')
            : '',
        );
        setCodigoProdutos(
          Array.isArray(selectedFormPtp?.codigoProdutos)
            ? selectedFormPtp.codigoProdutos
                .filter(
                  item =>
                    !!item &&
                    (!Array.isArray(item) || item.length > 0) &&
                    String(item).trim() !== '',
                )
                .join(', ')
            : '',
        );
        setNaoConformidadesList(selectedFormPtp?.detalheNaoConformidade!);
      }
    }, [formPtpId, selectedFormPtp]),
  );

  const onChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date | undefined,
  ) => {
    setDataIdentificacao(selectedDate!);
    setIsDatePickerVisible(false);
  };

  const handleBack = useCallback(() => {
    setRemessa('');
    setTransportador('');
    setPlaca('');
    setNotaFiscal('');
    setDataIdentificacao(new Date());
    setIsDatePickerVisible(false);
    setConferente('');
    setTurno('');
    setObservacoes('');
    setCdOrigem('');
    setQtdCaixasNaoConformes('');
    setUpOrigem('');
    setImagesList([]);
    setLotes('');
    setCodigoProdutos('');
    setHaDivergencia('nao');
    setDivergenciaSelecionada(null);
    setSku('');
    setQuantidade('');
    setSkuNotaFiscal('');
    setQuantidadeNotaFiscal('');
    setNaoConformidadesList([]);
    setSelectedFormPtp(null);
    rootNavigation.dispatch(StackActions.popToTop());
    replace('/(tabs)/(list)');
  }, [replace, setSelectedFormPtp, rootNavigation]);

  const pickImageInLibrary = async (tipoEvidencia: TipoEvidencia) => {
    setLoadingPreview(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        base64: true,
        quality: 1,
      });

      if (!result?.canceled && result?.assets?.length > 0) {
        const uri = result?.assets[0]?.uri!;
        const base64 = result?.assets[0]?.base64!;
        const filename =
          result?.assets[0]?.fileName ||
          dayjs().format('DD-MM-YYYY[T]HH:mm:ss');
        const size = result?.assets[0]?.fileSize!;

        const mimetype = mime.getType(uri);

        // console.log('result', JSON.stringify(result, null, 2));

        setImagesList(prevState => [
          ...prevState,
          {
            uri,
            base64,
            mimetype,
            filename,
            size,
            type: tipoEvidencia,
            id: new Date().getTime(),
          },
        ]);

        setTipoEvidencia(null);
      }
    } catch (error) {
      setLoadingPreview(false);
      console.log('Error pickImageInLibrary => ', JSON.stringify(error));
    } finally {
      setLoadingPreview(false);
    }
  };

  const takePicture = useCallback(async () => {
    setLoadingPreview(true);
    try {
      if (cameraRef?.current) {
        const options: CameraPictureOptions = { quality: 1, base64: true };
        const photo = await cameraRef?.current?.takePictureAsync(options);
        const mimetype = mime.getType(photo?.uri);
        const filename = dayjs().format('DD-MM-YYYY[T]HH:mm:ss');
        const size = photo?.uri?.length;
        setImagesList(prevState => [
          ...prevState,
          {
            uri: photo?.uri,
            base64: photo?.base64,
            mimetype,
            size,
            filename,
            type: tipoEvidencia,
            id: new Date().getTime(),
          },
        ]);
        setIsCameraModalOpen(false);
        setTipoEvidencia(null);
      }
    } catch (error) {
      console.log('Error takePicture => ', JSON.stringify(error));
    } finally {
      setLoadingPreview(false);
      setIsCameraModalOpen(false);
    }
  }, [tipoEvidencia]);

  const handleCamera = useCallback(
    (tipoEvidencia: TipoEvidencia) => {
      setTipoEvidencia(tipoEvidencia);
      if (permission && !permission?.granted) {
        requestPermission();
      } else {
        const imagesListFiltered = imagesList?.filter(
          i => i?.type === tipoEvidencia,
        );
        if (imagesListFiltered?.length >= 3) {
          Alert.alert('Atenção', 'Você atingiu o limite de 3 imagens.');
        } else {
          setIsCameraModalOpen(true);
        }
      }
    },
    [permission, requestPermission, imagesList],
  );

  const handleSaveLaudoCrm = useCallback(async () => {
    console.log('imagesList', JSON.stringify(imagesList.length, null, 2));
    console.log(
      'naoConformidadesList',
      JSON.stringify(naoConformidadesList, null, 2),
    );
    console.log('formPtpId', JSON.stringify(formPtpId, null, 2));
    console.log('remessa', JSON.stringify(remessa, null, 2));
    console.log('transportador', JSON.stringify(transportador, null, 2));
    console.log('placa', JSON.stringify(placa, null, 2));
    console.log('notaFiscal', JSON.stringify(notaFiscal, null, 2));
    console.log(
      'dataIdentificacao',
      JSON.stringify(dataIdentificacao, null, 2),
    );
    console.log('conferente', JSON.stringify(conferente, null, 2));
    console.log('turno', JSON.stringify(turno, null, 2));
    console.log('upOrigem', JSON.stringify(upOrigem, null, 2));
    console.log('cdOrigem', JSON.stringify(cdOrigem, null, 2));

    setIsLoading(true);

    if (
      !remessa ||
      !transportador ||
      !placa ||
      !notaFiscal ||
      !dataIdentificacao ||
      !conferente ||
      !turno ||
      !upOrigem ||
      !cdOrigem ||
      imagesList?.length === 0
    ) {
      setIsLoading(false);
      return Alert.alert(
        'Laudo CRM',
        'Por favor, preencha todos os campos para cadastrar o Laudo CRM.',
      );
    }

    if (!formPtpId) {
      setIsLoading(false);

      Alert.alert('Cadastro', 'ID do Formulário PTP não foi encontrado.');
      return;
    }

    if (haDivergencia === 'sim') {
      if (!sku || !quantidade) {
        setIsLoading(false);
        return Alert.alert(
          'Cadastro de Divergência',
          'Por favor, preencha todos os campos para cadastrar o evento.',
        );
      }

      if (divergenciaSelecionada === TipoDivergencia.INVERSAO) {
        if (!skuNotaFiscal || !quantidadeNotaFiscal) {
          setIsLoading(false);
          return Alert.alert(
            'Cadastro de Divergência',
            'Por favor, preencha todos os campos para cadastrar o evento.',
          );
        }
      }

      const proximoPasso = getNextStepsByDivergencyType(
        divergenciaSelecionada!,
        sku,
        quantidade,
        skuNotaFiscal,
        quantidadeNotaFiscal,
      );

      const data: DivergenciaPost = {
        tipoDivergencia: divergenciaSelecionada!,
        evidencias: [],
        skuFaltandoFisicamente:
          divergenciaSelecionada === TipoDivergencia.FALTA ? sku : null,
        qtdFaltandoFisicamente:
          divergenciaSelecionada === TipoDivergencia.FALTA
            ? Number(quantidade)
            : null,
        skuSobrandoFisicamente:
          divergenciaSelecionada === TipoDivergencia.SOBRA ? sku : null,
        qtdSobrandoFisicamente:
          divergenciaSelecionada === TipoDivergencia.SOBRA
            ? Number(quantidade)
            : null,
        skuRecebemosFisicamente:
          divergenciaSelecionada === TipoDivergencia.INVERSAO ? sku : null,
        qtdRecebemosFisicamente:
          divergenciaSelecionada === TipoDivergencia.INVERSAO
            ? Number(quantidade)
            : null,
        skuNotaFiscal:
          divergenciaSelecionada === TipoDivergencia.INVERSAO
            ? skuNotaFiscal
            : null,
        qtdNotaFiscal:
          divergenciaSelecionada === TipoDivergencia.INVERSAO
            ? Number(quantidadeNotaFiscal)
            : null,
        proximoPasso,
        upOrigem,
        cdOrigem,
        notaFiscal,
        user_id: user?.id!,
      };

      console.log('data divergencia', JSON.stringify(data, null, 2));
      const response = await createDivergenceRequest(data);
      console.log('response divergencia', JSON.stringify(response, null, 2));

      if (response?.status !== 201) {
        setIsLoading(false);
        return Alert.alert(
          'Ops!',
          'Ocorreu um erro ao salvar a Divergência, tente novamente mais tarde.',
        );
      }
    }

    console.log('lotes?.split(', ')', lotes?.split(','));
    console.log('codigoProdutos?.split(', ')', codigoProdutos?.split(','));
    console.log(
      'qtdCaixasNaoConformes?.split(',
      ')',
      qtdCaixasNaoConformes?.split(','),
    );

    const data: LaudoCrmPost = {
      remessa,
      transportador,
      placa,
      notaFiscal,
      dataIdentificacao,
      conferente,
      turno: turno as Turno,
      upOrigem: upOrigem,
      cdOrigem: cdOrigem,
      observacoes: observacoes,
      evidencias: [],
      form_ptp_id: formPtpId,
      tiposNaoConformidade: naoConformidadesList,
      lotes:
        typeof lotes === 'string'
          ? lotes
              .split(',')
              .map(item => item.trim())
              .filter(Boolean)
          : [],
      codigoProdutos:
        typeof codigoProdutos === 'string'
          ? codigoProdutos
              .split(',')
              .map(item => item.trim())
              .filter(Boolean)
          : [],
      qtdCaixasNaoConformes:
        typeof qtdCaixasNaoConformes === 'string'
          ? qtdCaixasNaoConformes
              .split(',')
              .map(item => item.trim())
              .filter(Boolean)
          : [],
      user_id: user?.id!,
    };

    // console.log('data', JSON.stringify(opa, null, 2));

    const response = await createLaudoCrmRequest(data);
    // console.log('response', JSON.stringify(response, null, 2));

    if (response?.status === 201 && response?.data?.length > 0) {
      // console.log('response', JSON.stringify(response, null, 2));

      // setLaudos({
      //   ...response?.data[0],
      //   // proximoEnunciadoId: primeiroId,
      //   // proximoEnunciadoGrupo: GrupoEnunciado.PALETE,
      // });
      // const laudo = {
      //   ...response?.data[0],
      //   type: 'laudo',
      // };

      // setLaudos([...laudos, laudo]);

      const evidencias =
        imagesList?.length > 0
          ? imagesList?.map(i => {
              const extension = mime.getExtension(i?.mimetype);

              return {
                type: i?.type,
                base64: i?.base64,
                mimetype: i?.mimetype,
                filename: `${i?.filename}.${extension}`,
              };
            })
          : [];

      if (evidencias?.length > 0) {
        let evidenciasIds: string[] = [];

        for await (const evidencia of evidencias) {
          const folderName = generateFolderName(
            'laudoCrm',
            response?.data[0]?.id,
            evidencia.type,
          );
          console.log('folderName', folderName);

          const { data, error } = await supabase.storage
            .from(folderName)
            .upload(evidencia?.filename, decode(evidencia?.base64), {
              contentType: evidencia?.mimetype,
              upsert: false,
            });

          delete evidencia.base64;

          console.log('evidencia', JSON.stringify(evidencia, null, 2));

          console.log('evidencia data', JSON.stringify(data, null, 2));
          console.log('evidencia error', JSON.stringify(error, null, 2));

          if (error !== null) {
            setIsLoading(false);
            Alert.alert(
              'Ops!',
              'Ocorreu um erro ao salvar as Evidências do Laudo CRM, tente novamente mais tarde.',
            );
          }

          console.log('evidencia2 data', JSON.stringify(data, null, 2));
          console.log('evidencia2 error', JSON.stringify(error, null, 2));

          const path = data?.fullPath?.split('/')?.slice(3)?.join('/');

          evidenciasIds = [...evidenciasIds, path!];
        }

        if (evidenciasIds?.length > 0) {
          const isUnique = evidenciasIds.filter(
            (value, index, self) => self.indexOf(value) === index,
          );

          const responseUpdate = await supabase
            .from('laudos-crm')
            .update({
              evidencias: [...isUnique],
            })
            .eq('id', response?.data[0]?.id)
            .select();
          console.log(
            'responseUpdate',
            JSON.stringify(responseUpdate, null, 2),
          );

          setIsLoading(false);

          if (responseUpdate?.error !== null) {
            return Alert.alert(
              'Ops!',
              'Ocorreu um erro ao vincular as Evidências ao Laudo CRM, tente novamente mais tarde.',
            );
          }

          if (responseUpdate?.status === 200) {
            if (haDivergencia === 'sim') {
              const proximoPasso = getNextStepsByDivergencyType(
                divergenciaSelecionada!,
                sku,
                quantidade,
                skuNotaFiscal,
                quantidadeNotaFiscal,
              );

              return Alert.alert('Próximos Passos', proximoPasso, [
                {
                  text: 'OK, entendi',
                  onPress: () => {
                    handleBack();
                  },
                },
              ]);
            } else {
              return Alert.alert(
                'Sucesso!',
                'Laudo CRM cadastrado com sucesso!',
                [
                  {
                    text: 'Fechar',
                    onPress: () => {
                      handleBack();
                    },
                  },
                ],
              );
            }
          }
        }
      }

      setIsLoading(false);

      if (haDivergencia === 'sim') {
        const proximoPasso = getNextStepsByDivergencyType(
          divergenciaSelecionada!,
          sku,
          quantidade,
          skuNotaFiscal,
          quantidadeNotaFiscal,
        );

        return Alert.alert('Próximos Passos', proximoPasso, [
          {
            text: 'OK, entendi',
            onPress: () => {
              handleBack();
            },
          },
        ]);
      } else {
        return Alert.alert('Sucesso!', 'Laudo CRM cadastrado com sucesso!', [
          {
            text: 'Fechar',
            onPress: () => {
              handleBack();
            },
          },
        ]);
      }
    } else {
      Alert.alert(
        'Salvar Laudo',
        'Ocorreu um erro ao salvar o Laudo CRM, tente novamente mais tarde.',
      );
    }

    setIsLoading(false);
  }, [
    replace,
    imagesList,
    remessa,
    transportador,
    placa,
    notaFiscal,
    dataIdentificacao,
    isDatePickerVisible,
    conferente,
    turno,
    upOrigem,
    cdOrigem,
    selectedFormPtp,
    naoConformidadesList,
    formPtpId,
    observacoes,
    lotes,
    codigoProdutos,
    qtdCaixasNaoConformes,
    divergenciaSelecionada,
    getNextStepsByDivergencyType,
    sku,
    quantidade,
    skuNotaFiscal,
    quantidadeNotaFiscal,
    user,
    setSelectedFormPtp,
    handleBack,
    haDivergencia,
    uuidv4,
  ]);

  const handleCancel = useCallback(() => {
    Alert.alert(
      'Cancelar Laudo',
      'Você deseja cancelar o preenchimento? Se sim irá apagar tudo que foi respondido',
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

  const handlePhotoLibrary = useCallback(
    async (tipoEvidencia: TipoEvidencia) => {
      setTipoEvidencia(tipoEvidencia);
      const imagesListFiltered = imagesList?.filter(
        i => i?.type === tipoEvidencia,
      );

      if (imagesListFiltered?.length >= 3) {
        Alert.alert('Atenção', 'Você atingiu o limite de 3 imagens.');
      } else {
        await pickImageInLibrary(tipoEvidencia);
      }
    },
    [imagesList],
  );

  return (
    <>
      <Modal
        visible={isCameraModalOpen}
        animationType="slide"
        onRequestClose={() => setIsCameraModalOpen(false)}
        transparent={false}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'black',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {loadingPreview && <Loading style={styles.loadingOverlay} />}
          <CameraView
            ref={cameraRef}
            style={{ flex: 1, width: '100%' }}
            facing="back"
          >
            <TouchableOpacity
              onPress={() => setIsCameraModalOpen(false)}
              style={[styles.closeCamera, { bottom: 20, zIndex: 10 }]}
            >
              <MaterialIcons name="close" size={36} color="#fff" />
            </TouchableOpacity>
            <View style={styles.takePictureContainer}>
              <TouchableOpacity onPress={takePicture}>
                <View style={styles.captureButton} />
              </TouchableOpacity>
            </View>
          </CameraView>
        </View>
      </Modal>
      {isLoading && <Loading style={styles.loadingOverlay} />}
      <ScrollScreenContainer subtitle="LAUDO CRM">
        <Title>Laudo CRM</Title>
        <View
          style={{
            paddingHorizontal: 8,
            gap: 24,
            paddingTop: 8,
            marginBottom: '20%',
          }}
        >
          <View style={{ marginBottom: 12, width: '100%' }}>
            <Text style={{ marginBottom: 12, color: '#6b7280' }}>
              Há Divergência?
            </Text>
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
            >
              <RadioInput
                value="sim"
                isSelected={haDivergencia === 'sim'}
                onSelect={() => setHaDivergencia('sim')}
              >
                <Text>Sim</Text>
              </RadioInput>
              <RadioInput
                value="nao"
                isSelected={haDivergencia === 'nao'}
                onSelect={() => setHaDivergencia('nao')}
              >
                <Text>Não</Text>
              </RadioInput>
            </View>
          </View>

          {haDivergencia === 'sim' && (
            <Text
              style={{ color: '#084077', fontSize: 22, fontWeight: 'bold' }}
            >
              Divergência
            </Text>
          )}

          {haDivergencia === 'sim' && (
            <>
              <View style={{ marginBottom: 12 }}>
                <SelectWithLabel
                  label="Selecione o Tipo da Divergência"
                  value={divergenciaSelecionada!}
                  onValueChange={t =>
                    setDivergenciaSelecionada(t as TipoDivergencia)
                  }
                  options={tiposDivergencia?.map(s => ({
                    label: s?.label,
                    value: s?.value,
                  }))}
                />
              </View>

              {divergenciaSelecionada === TipoDivergencia.FALTA && (
                <View style={{ gap: 24, paddingTop: 8 }}>
                  <View style={{ marginBottom: 8 }}>
                    <Text style={{ color: '#6b7280', marginBottom: 4 }}>
                      Qual SKU está faltando fisicamente?
                    </Text>
                    <TextInput
                      style={{
                        borderBottomWidth: 1,
                        borderColor: '#d1d5db',
                        height: 40,
                        fontSize: 16,
                        paddingHorizontal: 8,
                        color: '#222',
                      }}
                      placeholderTextColor="#6b7280"
                      value={sku}
                      onChangeText={setSku}
                      autoComplete="off"
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={{ marginBottom: 8 }}>
                    <Text style={{ color: '#6b7280', marginBottom: 4 }}>
                      Qual a quantidade que está faltando fisicamente?
                    </Text>
                    <TextInput
                      style={{
                        borderBottomWidth: 1,
                        borderColor: '#d1d5db',
                        height: 40,
                        fontSize: 16,
                        paddingHorizontal: 8,
                        color: '#222',
                      }}
                      placeholderTextColor="#6b7280"
                      value={quantidade}
                      onChangeText={setQuantidade}
                      autoComplete="off"
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              )}

              {divergenciaSelecionada === TipoDivergencia.SOBRA && (
                <View style={{ gap: 24, paddingTop: 8 }}>
                  <View style={{ marginBottom: 8 }}>
                    <Text style={{ color: '#6b7280', marginBottom: 4 }}>
                      Qual SKU está sobrando fisicamente?
                    </Text>
                    <TextInput
                      style={{
                        borderBottomWidth: 1,
                        borderColor: '#d1d5db',
                        height: 40,
                        fontSize: 16,
                        paddingHorizontal: 8,
                        color: '#222',
                      }}
                      placeholderTextColor="#6b7280"
                      value={sku}
                      onChangeText={setSku}
                      autoComplete="off"
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={{ marginBottom: 8 }}>
                    <Text style={{ color: '#6b7280', marginBottom: 4 }}>
                      Qual a quantidade que está sobrando fisicamente?
                    </Text>
                    <TextInput
                      style={{
                        borderBottomWidth: 1,
                        borderColor: '#d1d5db',
                        height: 40,
                        fontSize: 16,
                        paddingHorizontal: 8,
                        color: '#222',
                      }}
                      placeholderTextColor="#6b7280"
                      value={quantidade}
                      onChangeText={setQuantidade}
                      autoComplete="off"
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              )}

              {divergenciaSelecionada === TipoDivergencia.INVERSAO && (
                <View style={{ gap: 24, paddingTop: 8 }}>
                  <View style={{ marginBottom: 8 }}>
                    <Text style={{ color: '#6b7280', marginBottom: 4 }}>
                      Qual SKU recebemos fisicamente?
                    </Text>
                    <TextInput
                      style={{
                        borderBottomWidth: 1,
                        borderColor: '#d1d5db',
                        height: 40,
                        fontSize: 16,
                        paddingHorizontal: 8,
                        color: '#222',
                      }}
                      placeholderTextColor="#6b7280"
                      value={sku}
                      onChangeText={setSku}
                      autoComplete="off"
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={{ marginBottom: 8 }}>
                    <Text style={{ color: '#6b7280', marginBottom: 4 }}>
                      Qual a quantidade que recebemos fisicamente?
                    </Text>
                    <TextInput
                      style={{
                        borderBottomWidth: 1,
                        borderColor: '#d1d5db',
                        height: 40,
                        fontSize: 16,
                        paddingHorizontal: 8,
                        color: '#222',
                      }}
                      placeholderTextColor="#6b7280"
                      value={quantidade}
                      onChangeText={setQuantidade}
                      autoComplete="off"
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={{ marginBottom: 8 }}>
                    <Text style={{ color: '#6b7280', marginBottom: 4 }}>
                      Qual SKU está na nota fiscal?
                    </Text>
                    <TextInput
                      style={{
                        borderBottomWidth: 1,
                        borderColor: '#d1d5db',
                        height: 40,
                        fontSize: 16,
                        paddingHorizontal: 8,
                        color: '#222',
                      }}
                      placeholderTextColor="#6b7280"
                      value={skuNotaFiscal}
                      onChangeText={setSkuNotaFiscal}
                      autoComplete="off"
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={{ marginBottom: 8 }}>
                    <Text style={{ color: '#6b7280', marginBottom: 4 }}>
                      Qual a quantidade que está na nota fiscal?
                    </Text>
                    <TextInput
                      style={{
                        borderBottomWidth: 1,
                        borderColor: '#d1d5db',
                        height: 40,
                        fontSize: 16,
                        paddingHorizontal: 8,
                        color: '#222',
                      }}
                      placeholderTextColor="#6b7280"
                      value={quantidadeNotaFiscal}
                      onChangeText={setQuantidadeNotaFiscal}
                      autoComplete="off"
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              )}

              <View style={{ gap: 24, paddingTop: 8 }}>
                <SelectWithLabel
                  label="UP Origem"
                  value={upOrigem}
                  options={listaUPsOrigem?.map(s => ({
                    label: s?.label,
                    value: s?.value,
                  }))}
                />
                <SelectWithLabel
                  label="CD Origem"
                  value={cdOrigem}
                  onValueChange={setCdOrigem}
                  options={listaCDsOrigem?.map(s => ({
                    label: s?.label,
                    value: s?.value,
                  }))}
                />
              </View>
            </>
          )}

          {haDivergencia === 'sim' && (
            <Text
              style={{ color: '#084077', fontSize: 22, fontWeight: 'bold' }}
            >
              Laudo CRM
            </Text>
          )}

          <View style={{ marginBottom: 8 }}>
            <Text style={{ color: '#6b7280', marginBottom: 4 }}>Remessa:</Text>
            <TextInput
              style={{
                borderBottomWidth: 1,
                borderColor: '#d1d5db',
                height: 40,
                fontSize: 16,
                paddingHorizontal: 8,
                color: '#222',
              }}
              placeholderTextColor="#6b7280"
              value={remessa}
              onChangeText={setRemessa}
              keyboardType="numeric"
            />
          </View>

          <View style={{ marginBottom: 8 }}>
            <Text style={{ color: '#6b7280', marginBottom: 4 }}>
              Transportador:
            </Text>
            <TextInput
              style={{
                borderBottomWidth: 1,
                borderColor: '#d1d5db',
                height: 40,
                fontSize: 16,
                paddingHorizontal: 8,
                color: '#222',
              }}
              placeholderTextColor="#6b7280"
              value={transportador}
              onChangeText={setTransportador}
            />
          </View>

          <View style={{ marginBottom: 8 }}>
            <Text style={{ color: '#6b7280', marginBottom: 4 }}>Placa:</Text>
            <TextInput
              style={{
                borderBottomWidth: 1,
                borderColor: '#d1d5db',
                height: 40,
                fontSize: 16,
                paddingHorizontal: 8,
                color: '#222',
              }}
              placeholderTextColor="#6b7280"
              value={placa}
              onChangeText={t => setPlaca(mask(t, 'SSS-SSSS'))}
              maxLength={8}
              placeholder="000-0000"
              autoComplete="off"
            />
          </View>

          <SelectWithLabel
            label="Turno"
            value={turno}
            onValueChange={setTurno}
            options={listaTurnos?.map(s => ({
              label: s?.label,
              value: s?.value,
            }))}
          />

          <View style={{ marginBottom: 8 }}>
            <Text style={{ color: '#6b7280', marginBottom: 4 }}>
              Nota Fiscal/DT:
            </Text>
            <TextInput
              style={{
                borderBottomWidth: 1,
                borderColor: '#d1d5db',
                height: 40,
                fontSize: 16,
                paddingHorizontal: 8,
                color: '#222',
                backgroundColor: '#f3f4f6',
              }}
              placeholderTextColor="#6b7280"
              value={notaFiscal}
              editable={false}
              keyboardType="numeric"
            />
          </View>

          <View style={{ marginBottom: 8 }}>
            <Text style={{ color: '#6b7280', marginBottom: 4 }}>Lotes:</Text>
            <TextInput
              style={{
                borderBottomWidth: 1,
                borderColor: '#d1d5db',
                minHeight: 40,
                fontSize: 16,
                paddingHorizontal: 8,
                color: '#222',
                backgroundColor: '#f3f4f6',
              }}
              placeholderTextColor="#6b7280"
              value={lotes}
              editable={false}
              multiline
            />
          </View>

          <View style={{ marginBottom: 8 }}>
            <Text style={{ color: '#6b7280', marginBottom: 4 }}>
              Códigos dos Produtos:
            </Text>
            <TextInput
              style={{
                borderBottomWidth: 1,
                borderColor: '#d1d5db',
                minHeight: 40,
                fontSize: 16,
                paddingHorizontal: 8,
                color: '#222',
                backgroundColor: '#f3f4f6',
              }}
              placeholderTextColor="#6b7280"
              value={codigoProdutos}
              editable={false}
              multiline
            />
          </View>

          <View style={{ marginBottom: 8 }}>
            <Text style={{ color: '#6b7280', marginBottom: 4 }}>
              Qtd Caixas Não Conforme:
            </Text>
            <TextInput
              style={{
                borderBottomWidth: 1,
                borderColor: '#d1d5db',
                minHeight: 40,
                fontSize: 16,
                paddingHorizontal: 8,
                color: '#222',
                backgroundColor: '#f3f4f6',
              }}
              placeholderTextColor="#6b7280"
              value={qtdCaixasNaoConformes}
              editable={false}
              multiline
            />
          </View>

          <TouchableOpacity
            // onPress={() => setIsDatePickerVisible(prevState => !prevState)}
            style={{
              backgroundColor: '#084077',
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 4,
              marginBottom: 8,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
            disabled
          >
            <View>
              <Text style={{ color: 'white', fontWeight: '600' }}>
                Data da identificação
              </Text>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>
                {dayjs(dataIdentificacao).format('DD/MM/YYYY')}
              </Text>
            </View>
            <MaterialCommunityIcons name="calendar" color="#fff" size={28} />
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

          <View style={{ marginBottom: 8 }}>
            <Text style={{ color: '#6b7280', marginBottom: 4 }}>
              Conferente/Técnico:
            </Text>
            <TextInput
              style={{
                borderBottomWidth: 1,
                borderColor: '#d1d5db',
                height: 40,
                fontSize: 16,
                paddingHorizontal: 8,
                color: '#222',
                backgroundColor: '#f3f4f6',
              }}
              placeholderTextColor="#6b7280"
              value={conferente}
              editable={false}
            />
          </View>

          <SelectWithLabel
            label="UP Origem"
            value={upOrigem}
            options={listaUPsOrigem?.map(s => ({
              label: s?.label,
              value: s?.value,
            }))}
          />

          <SelectWithLabel
            label="CD Origem"
            value={cdOrigem}
            onValueChange={setCdOrigem}
            options={listaCDsOrigem?.map(s => ({
              label: s?.label,
              value: s?.value,
            }))}
          />

          <View style={{ marginBottom: 8 }}>
            <Text style={{ color: '#6b7280', marginBottom: 4 }}>
              Observações Gerais:
            </Text>
            <TextInput
              style={{
                borderBottomWidth: 1,
                borderColor: '#d1d5db',
                minHeight: 40,
                fontSize: 16,
                paddingHorizontal: 8,
                color: '#222',
              }}
              placeholderTextColor="#6b7280"
              value={observacoes}
              onChangeText={setObservacoes}
              multiline
              maxLength={1000}
            />
          </View>

          <View style={{ marginBottom: 8 }}>
            <Text style={{ color: '#6b7280', marginBottom: 16 }}>
              Evidência(s) UC
            </Text>
            {imagesList && imagesList?.length > 0 && (
              <View style={{ marginTop: 4, marginBottom: 12 }}>
                {imagesList
                  ?.filter(img => img?.type === TipoEvidencia.UC)
                  ?.map((image, index) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: 'row',
                        marginBottom: 16,
                        width: '100%',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 8,
                        }}
                      >
                        <Image
                          key={index}
                          source={{ uri: image?.uri }}
                          style={{ width: 100, height: 100, borderRadius: 4 }}
                          resizeMode="cover"
                        />
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          const newImagesList = imagesList?.filter(
                            img => img.id !== image.id,
                          );
                          setImagesList(newImagesList);
                        }}
                      >
                        <MaterialIcons
                          name="delete"
                          color="#dc2626"
                          size={24}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
              </View>
            )}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 24,
                gap: 20,
              }}
            >
              <TouchableOpacity
                onPress={() => handlePhotoLibrary(TipoEvidencia.UC)}
              >
                <MaterialIcons name="photo" color="#374151" size={28} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleCamera(TipoEvidencia.UC)}>
                <MaterialCommunityIcons
                  name="camera"
                  color="#374151"
                  size={28}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ marginBottom: 8 }}>
            <Text style={{ color: '#6b7280', marginBottom: 16 }}>
              Evidência(s) Etiqueta Caixa
            </Text>
            {imagesList && imagesList?.length > 0 && (
              <View style={{ marginTop: 4, marginBottom: 12 }}>
                {imagesList
                  ?.filter(img => img?.type === TipoEvidencia.ETIQUETA_CAIXA)
                  ?.map((image, index) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: 'row',
                        marginBottom: 16,
                        width: '100%',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 8,
                        }}
                      >
                        <Image
                          key={index}
                          source={{ uri: image?.uri }}
                          style={{ width: 100, height: 100, borderRadius: 4 }}
                          resizeMode="cover"
                        />
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          const newImagesList = imagesList?.filter(
                            img => img.id !== image.id,
                          );
                          setImagesList(newImagesList);
                        }}
                      >
                        <MaterialIcons
                          name="delete"
                          color="#dc2626"
                          size={24}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
              </View>
            )}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 24,
                gap: 20,
              }}
            >
              <TouchableOpacity
                onPress={() => handlePhotoLibrary(TipoEvidencia.ETIQUETA_CAIXA)}
              >
                <MaterialIcons name="photo" color="#374151" size={28} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleCamera(TipoEvidencia.ETIQUETA_CAIXA)}
              >
                <MaterialCommunityIcons
                  name="camera"
                  color="#374151"
                  size={28}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ marginBottom: 8 }}>
            <Text style={{ color: '#6b7280', marginBottom: 16 }}>
              Evidência(s) Avarias
            </Text>
            {imagesList && imagesList?.length > 0 && (
              <View style={{ marginTop: 4, marginBottom: 12 }}>
                {imagesList
                  ?.filter(img => img?.type === TipoEvidencia.AVARIAS)
                  ?.map((image, index) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: 'row',
                        marginBottom: 16,
                        width: '100%',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 8,
                        }}
                      >
                        <Image
                          key={index}
                          source={{ uri: image?.uri }}
                          style={{ width: 100, height: 100, borderRadius: 4 }}
                          resizeMode="cover"
                        />
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          const newImagesList = imagesList?.filter(
                            img => img.id !== image.id,
                          );
                          setImagesList(newImagesList);
                        }}
                      >
                        <MaterialIcons
                          name="delete"
                          color="#dc2626"
                          size={24}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
              </View>
            )}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 24,
                gap: 20,
              }}
            >
              <TouchableOpacity
                onPress={() => handlePhotoLibrary(TipoEvidencia.AVARIAS)}
              >
                <MaterialIcons name="photo" color="#374151" size={28} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleCamera(TipoEvidencia.AVARIAS)}
              >
                <MaterialCommunityIcons
                  name="camera"
                  color="#374151"
                  size={28}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ marginBottom: 8 }}>
            <Text style={{ color: '#6b7280', marginBottom: 16 }}>
              Evidência(s) Pallets
            </Text>
            {imagesList && imagesList?.length > 0 && (
              <View style={{ marginTop: 4, marginBottom: 12 }}>
                {imagesList
                  ?.filter(img => img?.type === TipoEvidencia.PALLETS)
                  ?.map((image, index) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: 'row',
                        marginBottom: 16,
                        width: '100%',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 8,
                        }}
                      >
                        <Image
                          key={index}
                          source={{ uri: image?.uri }}
                          style={{ width: 100, height: 100, borderRadius: 4 }}
                          resizeMode="cover"
                        />
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          const newImagesList = imagesList?.filter(
                            img => img.id !== image.id,
                          );
                          setImagesList(newImagesList);
                        }}
                      >
                        <MaterialIcons
                          name="delete"
                          color="#dc2626"
                          size={24}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
              </View>
            )}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 24,
                gap: 20,
              }}
            >
              <TouchableOpacity
                onPress={() => handlePhotoLibrary(TipoEvidencia.PALLETS)}
              >
                <MaterialIcons name="photo" color="#374151" size={28} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleCamera(TipoEvidencia.PALLETS)}
              >
                <MaterialCommunityIcons
                  name="camera"
                  color="#374151"
                  size={28}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ marginBottom: 8, width: '100%' }}>
            <ConformidadesCheckbox
              listaNaoConformidades={naoConformidadesList}
              setListaNaoConformidades={setNaoConformidadesList}
              label="Anomalias encontradas:"
              isOnlyView
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
              marginTop: 16,
            }}
          >
            <Button
              style={{ width: '48%', height: 50, backgroundColor: '#374151' }}
              title="Cancelar"
              onPress={handleCancel}
              disabled={isLoading}
              textStyle={{ color: 'white' }}
            />
            <Button
              style={{ width: '48%', height: 50, backgroundColor: '#084077' }}
              title="Salvar"
              onPress={handleSaveLaudoCrm}
              disabled={isLoading}
              textStyle={{ color: 'white' }}
            />
          </View>
        </View>
      </ScrollScreenContainer>
    </>
  );
}
