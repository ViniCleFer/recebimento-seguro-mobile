import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { StackActions } from '@react-navigation/native';
import { decode } from 'base64-arraybuffer';
import dayjs from 'dayjs';
import {
  type CameraPictureOptions,
  CameraView,
  useCameraPermissions,
} from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { router, useNavigationContainerRef } from 'expo-router';
import mime from 'mime';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
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

import { Button } from '@/components/Button';
import { Loading } from '@/components/Loading';
import { ScrollScreenContainer } from '@/components/ScrollScreenContainer';
import { SelectWithLabel } from '@/components/SelectWithLabel';
import Title from '@/components/Title';

import { generateFolderName } from '@/utils/generateFoldername';
import { listaTurnos } from '@/utils/listaTurnos';
import { tiposEvidenciaCartaControle } from '@/utils/tiposEvidenciaCartaControle';

import { supabase } from '@/lib/supabase';

import useAuthStore from '@/store/auth';

import {
  CartaControlePost,
  TipoEvidenciaCartaControle,
} from '@/services/requests/cartas-controle/types';
import {
  createCartaControleRequest,
  updateEvidenciasCartaControleRequest,
} from '@/services/requests/cartas-controle/utils';
import { Turno } from '@/services/requests/laudos/types';
import { colors } from '@/styles/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
    backgroundColor: 'rgba(000, 000, 000, 0.7)',
  },
  takePictureContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    bottom: '-90%',
    position: 'relative',
    backgroundColor: 'transparent',
  },
  closeCamera: {
    position: 'absolute',
    right: 30,
  },
  formContainer: {
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 80,
    gap: 24,
  },
  dateContainer: {
    backgroundColor: '#084077',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 8,
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
  evidenceSection: {
    marginBottom: 16,
  },
  evidenceTitle: {
    color: '#6b7280',
    marginBottom: 16,
  },
  evidenceList: {
    marginTop: 4,
    marginBottom: 12,
  },
  evidenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  evidenceImage: {
    width: 100,
    height: 100,
    borderRadius: 4,
  },
  evidenceActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 24,
    gap: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 16,
  },
});

export default function CartaControle() {
  const { replace } = router;
  const rootNavigation = useNavigationContainerRef();

  const user = useAuthStore(state => state.user);

  const [isLoading, setIsLoading] = useState(false);

  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [imagesList, setImagesList] = useState<any[]>([]);

  const [dataIdentificacao, setDataIdentificacao] = useState(new Date());
  const [turno, setTurno] = useState('');
  const [documentoTransporte, setDocumentoTransporte] = useState('');
  const [remessa, setRemessa] = useState('');
  const [conferente, setConferente] = useState(''); // inicial
  const [doca, setDoca] = useState(''); // inicial
  const [capacidadeVeiculo, setCapacidadeVeiculo] = useState(''); // inicial
  const [observacoes, setObservacoes] = useState(''); // inicial
  const [tipoEvidencia, setTipoEvidencia] =
    useState<TipoEvidenciaCartaControle | null>(null);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [scanned, setScanned] = useState(false);

  const [permission, requestPermission] = useCameraPermissions();

  const cameraRef = useRef<any>(null);

  useEffect(() => {
    requestPermission();
  }, []);

  if (!permission?.granted) {
    console.log('Não permitiu');
  }

  const handleBack = useCallback(() => {
    setDataIdentificacao(new Date());
    setTurno('');
    setDocumentoTransporte('');
    setRemessa('');
    setConferente('');
    setDoca('');
    setCapacidadeVeiculo('');
    setImagesList([]);
    setObservacoes('');
    setTipoEvidencia(null);
    setIsLoading(false);
    setIsCameraModalOpen(false);
    setLoadingPreview(false);

    rootNavigation.dispatch(StackActions.popToTop());
    replace('/(tabs)/(list)');
  }, [replace, rootNavigation]);

  const pickImageInLibrary = async (
    tipoEvidencia: TipoEvidenciaCartaControle,
  ) => {
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

        // console.log('photo', JSON.stringify(photo, null, 2));

        console.log('tipoEvidencia', tipoEvidencia);

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
        setLoadingPreview(false);
        setTipoEvidencia(null);
      }
      setIsCameraModalOpen(false);
      setLoadingPreview(false);
    } catch (error) {
      console.log('Error takePicture => ', JSON.stringify(error));
      setIsCameraModalOpen(false);
      setLoadingPreview(false);
    } finally {
      setLoadingPreview(false);
    }
  }, [tipoEvidencia]);

  const handleCamera = useCallback(
    (tipoEvidencia: TipoEvidenciaCartaControle) => {
      setTipoEvidencia(tipoEvidencia);
      if (permission && !permission?.granted) {
        requestPermission();
      } else {
        const imagesListFiltered = imagesList?.filter(
          i => i?.type === tipoEvidencia,
        );
        if (imagesListFiltered?.length >= 5) {
          Alert.alert('Atenção', 'Você atingiu o limite de 5 imagens.');
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
      'imagesList',
      JSON.stringify(imagesList.map(i => i?.type)?.join(', '), null, 2),
    );

    setIsLoading(true);

    // pelo menos uma imagem de cada tipo de evidencia

    const imagesListCargaDoca = imagesList?.filter(
      i => i?.type === TipoEvidenciaCartaControle.CARGA_DOCA,
    );
    const imagesListOrdemCarregamento = imagesList?.filter(
      i => i?.type === TipoEvidenciaCartaControle.ORDEM_CARREGAMENTO,
    );
    const imagesListInicioCarregamento = imagesList?.filter(
      i => i?.type === TipoEvidenciaCartaControle.INICIO_CARREGAMENTO,
    );
    const imagesListMeioCarregamento = imagesList?.filter(
      i => i?.type === TipoEvidenciaCartaControle.MEIO_CARREGAMENTO,
    );
    const imagesListFimCarregamento = imagesList?.filter(
      i => i?.type === TipoEvidenciaCartaControle.FINAL_CARREGAMENTO,
    );
    const imagesListPlacaVeiculo = imagesList?.filter(
      i => i?.type === TipoEvidenciaCartaControle.PLACA_VEICULO,
    );

    console.log(
      'imagesListCargaDoca',
      JSON.stringify(imagesListCargaDoca?.length, null, 2),
    );
    console.log(
      'imagesListOrdemCarregamento',
      JSON.stringify(imagesListOrdemCarregamento?.length, null, 2),
    );
    console.log(
      'imagesListInicioCarregamento',
      JSON.stringify(imagesListInicioCarregamento?.length, null, 2),
    );
    console.log(
      'imagesListMeioCarregamento',
      JSON.stringify(imagesListMeioCarregamento?.length, null, 2),
    );
    console.log(
      'imagesListFimCarregamento',
      JSON.stringify(imagesListFimCarregamento?.length, null, 2),
    );
    console.log(
      'imagesListPlacaVeiculo',
      JSON.stringify(imagesListPlacaVeiculo?.length, null, 2),
    );

    if (!dataIdentificacao || !turno || !documentoTransporte || !remessa) {
      setIsLoading(false);
      return Alert.alert(
        'Carta Controle',
        'Por favor, preencha os campos TURNO, DT e REMESSA para salvar a Carta Controle.',
      );
    }

    let status: 'EM_ANDAMENTO' | 'FINALIZADO' | 'CANCELADO' = 'EM_ANDAMENTO';

    if (
      imagesListCargaDoca?.length === 0 ||
      imagesListOrdemCarregamento?.length === 0 ||
      imagesListInicioCarregamento?.length === 0 ||
      imagesListMeioCarregamento?.length === 0 ||
      imagesListFimCarregamento?.length === 0 ||
      imagesListPlacaVeiculo?.length === 0 ||
      !dataIdentificacao ||
      !turno ||
      !remessa ||
      !conferente ||
      !doca ||
      !capacidadeVeiculo
    ) {
      status = 'EM_ANDAMENTO';
    } else {
      status = 'FINALIZADO';
    }

    const data: CartaControlePost = {
      dataIdentificacao,
      turno: turno as Turno,
      documentoTransporte,
      remessa,
      doca: doca ? doca : null,
      conferente: conferente ? conferente : null,
      capacidadeVeiculo: capacidadeVeiculo ? capacidadeVeiculo : null,
      observacoes: observacoes ? observacoes : null,
      evidencias: [],
      user_id: user?.id!,
      status,
    };

    // console.log('data', JSON.stringify(data, null, 2));

    const response = await createCartaControleRequest(data);
    // console.log('response', JSON.stringify(response, null, 2));

    if (response?.status === 201 && response?.data?.length > 0) {
      // console.log('response', JSON.stringify(response, null, 2));

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

      // console.log('evidencias', JSON.stringify(evidencias, null, 2));

      if (evidencias?.length > 0) {
        let evidenciasIds: string[] = [];

        for await (const evidencia of evidencias) {
          const folderName = generateFolderName(
            'carta-controle',
            response?.data[0]?.id,
            evidencia?.type,
          );
          // console.log('folderName', folderName);

          const { data, error } = await supabase.storage
            .from(folderName)
            .upload(evidencia?.filename, decode(evidencia?.base64), {
              contentType: evidencia?.mimetype,
              upsert: false,
            });

          delete evidencia.base64;

          // console.log('evidencia', JSON.stringify(evidencia, null, 2));

          // console.log('evidencia data', JSON.stringify(data, null, 2));
          // console.log('evidencia error', JSON.stringify(error, null, 2));

          if (error !== null) {
            setIsLoading(false);
            Alert.alert(
              'Ops!',
              'Ocorreu um erro ao salvar as Evidências do Carta Controle, tente novamente mais tarde.',
            );
          }

          // console.log('evidencia2 data', JSON.stringify(data, null, 2));
          // console.log('evidencia2 error', JSON.stringify(error, null, 2));

          const path = data?.fullPath?.split('/')?.slice(3)?.join('/');

          evidenciasIds = [...evidenciasIds, path!];
        }

        if (evidenciasIds?.length > 0) {
          const isUnique = evidenciasIds.filter(
            (value, index, self) => self.indexOf(value) === index,
          );
          const cartaControleId = response?.data[0]?.id;

          const responseUpdate = await updateEvidenciasCartaControleRequest(
            cartaControleId,
            isUnique,
          );

          // console.log(
          //   'responseUpdate',
          //   JSON.stringify(responseUpdate, null, 2),
          // );

          setIsLoading(false);

          if (responseUpdate?.data === null) {
            return Alert.alert(
              'Ops!',
              'Ocorreu um erro ao vincular as Evidências ao Carta Controle, tente novamente mais tarde.',
            );
          }

          if (responseUpdate && responseUpdate?.status === 200) {
            return Alert.alert(
              'Sucesso!',
              'Carta Controle cadastrado com sucesso!',
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
      } else {
        setIsLoading(false);

        return Alert.alert(
          'Sucesso!',
          'Carta Controle cadastrado com sucesso!',
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

      setIsLoading(false);
    } else {
      Alert.alert(
        'Salvar Laudo',
        'Ocorreu um erro ao salvar o Carta Controle, tente novamente mais tarde.',
      );
    }

    setIsLoading(false);
  }, [
    dataIdentificacao,
    turno,
    documentoTransporte,
    remessa,
    conferente,
    doca,
    capacidadeVeiculo,
    imagesList,
    observacoes,
    user,
    handleBack,
  ]);

  const handleCancel = useCallback(() => {
    Alert.alert(
      'Cancelar Carta Controle',
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
    async (tipoEvidencia: TipoEvidenciaCartaControle) => {
      setTipoEvidencia(tipoEvidencia);
      const imagesListFiltered = imagesList?.filter(
        i => i?.type === tipoEvidencia,
      );

      if (imagesListFiltered?.length >= 5) {
        Alert.alert('Atenção', 'Você atingiu o limite de 5 imagens.');
      } else {
        await pickImageInLibrary(tipoEvidencia);
      }
    },
    [imagesList],
  );

  return (
    <Fragment>
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
                <View
                  style={{
                    backgroundColor: '#fff',
                    height: 60,
                    width: 60,
                    borderRadius: 30,
                  }}
                />
              </TouchableOpacity>
            </View>
          </CameraView>
        </View>
      </Modal>
      <Fragment>
        {isLoading && <Loading style={styles.loadingOverlay} />}
        <ScrollScreenContainer subtitle="Carta Controle">
          <View style={styles.formContainer}>
            <Title>Carta Controle</Title>

            <View style={styles.dateContainer}>
              <View style={styles.dateContent}>
                <View>
                  <Text style={styles.dateLabel}>Data da identificação</Text>
                  <Text style={styles.dateValue}>
                    {dayjs(dataIdentificacao).format('DD/MM/YYYY')}
                  </Text>
                </View>
                <MaterialCommunityIcons
                  name="calendar"
                  color="white"
                  size={28}
                />
              </View>
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

            <View style={styles.inputGroup}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Text style={styles.inputLabel}>
                  Documento de Transporte (DT):
                </Text>
                <TouchableOpacity
                  onPress={() => setShowBarcodeScanner(true)}
                  style={{ marginLeft: 8 }}
                >
                  <MaterialCommunityIcons
                    name="barcode-scan"
                    size={24}
                    color="#4b5563"
                  />
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="Digite o documento de transporte"
                placeholderTextColor="#6b7280"
                value={documentoTransporte}
                onChangeText={t => {
                  setDocumentoTransporte(t);
                }}
                keyboardType="numeric"
                maxLength={7}
              />
            </View>

            <Modal
              visible={showBarcodeScanner}
              animationType="slide"
              onRequestClose={() => setShowBarcodeScanner(false)}
              transparent={false}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'black',
                }}
              >
                <CameraView
                  style={{ width: '100%', height: '80%' }}
                  facing="back"
                  barcodeScannerSettings={{
                    barcodeTypes: [
                      'code128',
                      'code39',
                      'ean13',
                      'ean8',
                      'upc_a',
                      'upc_e',
                      'qr',
                    ],
                  }}
                  onBarcodeScanned={
                    scanned
                      ? undefined
                      : ({ data }: { data: string }) => {
                          setDocumentoTransporte(data);
                          setScanned(true);
                          setShowBarcodeScanner(false);
                        }
                  }
                />
                <TouchableOpacity
                  onPress={() => setShowBarcodeScanner(false)}
                  style={{
                    marginTop: 24,
                    backgroundColor: '#222',
                    padding: 16,
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 16 }}>Fechar</Text>
                </TouchableOpacity>
              </View>
            </Modal>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Remessa:</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Digite a remessa"
                placeholderTextColor="#6b7280"
                value={remessa}
                onChangeText={t => {
                  setRemessa(t);
                }}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Conferente/Técnico:</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Digite o nome do conferente"
                placeholderTextColor="#6b7280"
                value={conferente}
                onChangeText={setConferente}
                editable={false}
              />
            </View>

            <SelectWithLabel
              label="Doca"
              value={doca}
              onValueChange={setDoca}
              options={Array.from({ length: 50 }).map((_, index) => ({
                label: String(index + 1),
                value: String(index + 1),
              }))}
            />

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Capacidade Veículo (N° Palles):
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="00"
                placeholderTextColor="#6b7280"
                value={capacidadeVeiculo}
                onChangeText={setCapacidadeVeiculo}
                keyboardType="numeric"
                maxLength={2}
              />
            </View>

            <View style={styles.evidenceSection}>
              <Text style={styles.evidenceTitle}>
                Evidência(s){' '}
                {
                  tiposEvidenciaCartaControle?.find(
                    t =>
                      t.value === TipoEvidenciaCartaControle.ORDEM_CARREGAMENTO,
                  )?.label
                }
              </Text>

              {imagesList && imagesList?.length > 0 && (
                <View style={styles.evidenceList}>
                  {imagesList
                    ?.filter(
                      img =>
                        img?.type ===
                        TipoEvidenciaCartaControle.ORDEM_CARREGAMENTO,
                    )
                    ?.map((image, index) => (
                      <View key={index} style={styles.evidenceItem}>
                        <Image
                          source={{ uri: image?.uri }}
                          style={styles.evidenceImage}
                          alt="image"
                        />
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

              <View style={styles.evidenceActions}>
                <TouchableOpacity
                  onPress={() =>
                    handlePhotoLibrary(
                      TipoEvidenciaCartaControle.ORDEM_CARREGAMENTO,
                    )
                  }
                >
                  <MaterialIcons name="photo" color="#4b5563" size={28} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    handleCamera(TipoEvidenciaCartaControle.ORDEM_CARREGAMENTO);
                  }}
                >
                  <MaterialCommunityIcons
                    name="camera"
                    color="#4b5563"
                    size={28}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.evidenceSection}>
              <Text style={styles.evidenceTitle}>
                Evidência(s){' '}
                {
                  tiposEvidenciaCartaControle?.find(
                    t => t.value === TipoEvidenciaCartaControle.CARGA_DOCA,
                  )?.label
                }
              </Text>

              {imagesList && imagesList?.length > 0 && (
                <View style={styles.evidenceList}>
                  {imagesList
                    ?.filter(
                      img =>
                        img?.type === TipoEvidenciaCartaControle.CARGA_DOCA,
                    )
                    ?.map((image, index) => (
                      <View key={index} style={styles.evidenceItem}>
                        <Image
                          source={{ uri: image?.uri }}
                          style={styles.evidenceImage}
                          alt="image"
                        />
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

              <View style={styles.evidenceActions}>
                <TouchableOpacity
                  onPress={() =>
                    handlePhotoLibrary(TipoEvidenciaCartaControle.CARGA_DOCA)
                  }
                >
                  <MaterialIcons name="photo" color="#4b5563" size={28} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    handleCamera(TipoEvidenciaCartaControle.CARGA_DOCA);
                  }}
                >
                  <MaterialCommunityIcons
                    name="camera"
                    color="#4b5563"
                    size={28}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.evidenceSection}>
              <Text style={styles.evidenceTitle}>
                Evidência(s){' '}
                {
                  tiposEvidenciaCartaControle?.find(
                    t =>
                      t.value ===
                      TipoEvidenciaCartaControle.INICIO_CARREGAMENTO,
                  )?.label
                }
              </Text>

              {imagesList && imagesList?.length > 0 && (
                <View style={styles.evidenceList}>
                  {imagesList
                    ?.filter(
                      img =>
                        img?.type ===
                        TipoEvidenciaCartaControle.INICIO_CARREGAMENTO,
                    )
                    ?.map((image, index) => (
                      <View key={index} style={styles.evidenceItem}>
                        <Image
                          source={{ uri: image?.uri }}
                          style={styles.evidenceImage}
                          alt="image"
                        />
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

              <View style={styles.evidenceActions}>
                <TouchableOpacity
                  onPress={() =>
                    handlePhotoLibrary(
                      TipoEvidenciaCartaControle.INICIO_CARREGAMENTO,
                    )
                  }
                >
                  <MaterialIcons name="photo" color="#4b5563" size={28} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    handleCamera(
                      TipoEvidenciaCartaControle.INICIO_CARREGAMENTO,
                    );
                  }}
                >
                  <MaterialCommunityIcons
                    name="camera"
                    color="#4b5563"
                    size={28}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.evidenceSection}>
              <Text style={styles.evidenceTitle}>
                Evidência(s){' '}
                {
                  tiposEvidenciaCartaControle?.find(
                    t =>
                      t.value === TipoEvidenciaCartaControle.MEIO_CARREGAMENTO,
                  )?.label
                }
              </Text>

              {imagesList && imagesList?.length > 0 && (
                <View style={styles.evidenceList}>
                  {imagesList
                    ?.filter(
                      img =>
                        img?.type ===
                        TipoEvidenciaCartaControle.MEIO_CARREGAMENTO,
                    )
                    ?.map((image, index) => (
                      <View key={index} style={styles.evidenceItem}>
                        <Image
                          source={{ uri: image?.uri }}
                          style={styles.evidenceImage}
                          alt="image"
                        />
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

              <View style={styles.evidenceActions}>
                <TouchableOpacity
                  onPress={() =>
                    handlePhotoLibrary(
                      TipoEvidenciaCartaControle.MEIO_CARREGAMENTO,
                    )
                  }
                >
                  <MaterialIcons name="photo" color="#4b5563" size={28} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    handleCamera(TipoEvidenciaCartaControle.MEIO_CARREGAMENTO);
                  }}
                >
                  <MaterialCommunityIcons
                    name="camera"
                    color="#4b5563"
                    size={28}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.evidenceSection}>
              <Text style={styles.evidenceTitle}>
                Evidência(s){' '}
                {
                  tiposEvidenciaCartaControle?.find(
                    t =>
                      t.value === TipoEvidenciaCartaControle.FINAL_CARREGAMENTO,
                  )?.label
                }
              </Text>

              {imagesList && imagesList?.length > 0 && (
                <View style={styles.evidenceList}>
                  {imagesList
                    ?.filter(
                      img =>
                        img?.type ===
                        TipoEvidenciaCartaControle.FINAL_CARREGAMENTO,
                    )
                    ?.map((image, index) => (
                      <View key={index} style={styles.evidenceItem}>
                        <Image
                          source={{ uri: image?.uri }}
                          style={styles.evidenceImage}
                          alt="image"
                        />
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

              <View style={styles.evidenceActions}>
                <TouchableOpacity
                  onPress={() =>
                    handlePhotoLibrary(
                      TipoEvidenciaCartaControle.FINAL_CARREGAMENTO,
                    )
                  }
                >
                  <MaterialIcons name="photo" color="#4b5563" size={28} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    handleCamera(TipoEvidenciaCartaControle.FINAL_CARREGAMENTO);
                  }}
                >
                  <MaterialCommunityIcons
                    name="camera"
                    color="#4b5563"
                    size={28}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.evidenceSection}>
              <Text style={styles.evidenceTitle}>
                Evidência(s){' '}
                {
                  tiposEvidenciaCartaControle?.find(
                    t => t.value === TipoEvidenciaCartaControle.PLACA_VEICULO,
                  )?.label
                }
              </Text>

              {imagesList && imagesList?.length > 0 && (
                <View style={styles.evidenceList}>
                  {imagesList
                    ?.filter(
                      img =>
                        img?.type === TipoEvidenciaCartaControle.PLACA_VEICULO,
                    )
                    ?.map((image, index) => (
                      <View key={index} style={styles.evidenceItem}>
                        <Image
                          source={{ uri: image?.uri }}
                          style={styles.evidenceImage}
                          alt="image"
                        />
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

              <View style={styles.evidenceActions}>
                <TouchableOpacity
                  onPress={() =>
                    handlePhotoLibrary(TipoEvidenciaCartaControle.PLACA_VEICULO)
                  }
                >
                  <MaterialIcons name="photo" color="#4b5563" size={28} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    handleCamera(TipoEvidenciaCartaControle.PLACA_VEICULO);
                  }}
                >
                  <MaterialCommunityIcons
                    name="camera"
                    color="#4b5563"
                    size={28}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Observações Gerais:</Text>
              <TextInput
                style={[styles.textInput, { minHeight: 56 }]}
                placeholder="Digite suas observações"
                placeholderTextColor="#6b7280"
                value={observacoes}
                onChangeText={setObservacoes}
                multiline
                maxLength={300}
              />
            </View>

            <View style={styles.buttonRow}>
              <Button
                style={{ width: '48%', height: 50, backgroundColor: '#374151' }}
                title="Cancelar"
                onPress={handleCancel}
                disabled={isLoading}
                textStyle={{ color: colors.white }}
              />

              <Button
                style={{
                  width: '48%',
                  height: 50,
                  backgroundColor: colors.primary,
                }}
                title="Salvar"
                onPress={handleSaveLaudoCrm}
                disabled={isLoading}
                textStyle={{ color: colors.white }}
              />
            </View>
          </View>
        </ScrollScreenContainer>
      </Fragment>
    </Fragment>
  );
}
