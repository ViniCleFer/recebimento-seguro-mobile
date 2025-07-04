import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import {
  type CameraPictureOptions,
  CameraView,
  useCameraPermissions,
} from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import mime from 'mime';
import {
  Box,
  HStack,
  Icon,
  Image,
  Input,
  Pressable,
  Radio,
  Select,
  Text,
  useTheme,
  View,
  VStack,
} from 'native-base';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { shade } from 'polished';
import { router, useNavigationContainerRef } from 'expo-router';
import { decode } from 'base64-arraybuffer';
import { StackActions } from '@react-navigation/native';

import Title from '@/components/Title';
import { Button } from '@/components/Button';
import { Loading } from '@/components/Loading';
import { SelectWithLabel } from '@/components/SelectWithLabel';
import { ScrollScreenContainer } from '@/components/ScrollScreenContainer';

import { listaTurnos } from '@/utils/listaTurnos';
import { generateFolderName } from '@/utils/generateFoldername';
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
    bottom: '-40%',
    position: 'relative',
  },
  closeCamera: {
    position: 'absolute',
    right: 30,
  },
});

export default function CartaControle() {
  const { colors } = useTheme();
  const { replace } = router;
  const rootNavigation = useNavigationContainerRef();

  const user = useAuthStore(state => state.user);

  const [isLoading, setIsLoading] = useState(false);

  const [isCameraActive, setIsCameraActive] = useState(false);
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
    setIsCameraActive(false);
    setLoadingPreview(false);

    rootNavigation.dispatch(StackActions.popToTop());
    replace('/(tabs)/(list)');
  }, [replace, rootNavigation, StackActions]);

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

        setIsCameraActive(false);
        setLoadingPreview(false);
        setTipoEvidencia(null);
      }
      setIsCameraActive(false);
      setLoadingPreview(false);
    } catch (error) {
      console.log('Error takePicture => ', JSON.stringify(error));
      setIsCameraActive(false);
      setLoadingPreview(false);
    } finally {
      setIsCameraActive(false);
      setLoadingPreview(false);
    }
  }, [tipoEvidencia]);

  const handleCamera = useCallback(
    (tipoEvidencia: TipoEvidenciaCartaControle) => {
      console.log('permission', permission);
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
          setIsCameraActive(true);
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

  return isCameraActive ? (
    <View style={styles.container}>
      {loadingPreview && (
        <Loading
          flex={1}
          height="100%"
          position={'absolute'}
          top={0}
          left={0}
          right={0}
          bottom={0}
          zIndex={100}
          backgroundColor={'rgba(000, 000, 000, 0.7)'}
        />
      )}
      <CameraView
        ref={cameraRef}
        style={{ flex: 1, flexDirection: 'row' }}
        facing="back"
      >
        <Box style={styles.takePictureContainer} backgroundColor="transparent">
          <TouchableOpacity onPress={takePicture}>
            <Box
              borderRadius="full"
              style={{
                backgroundColor: '#fff',
                height: 60,
                width: 60,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeCamera}
            onPress={() => {
              setIsCameraActive(false);
            }}
          >
            <MaterialIcons name="cancel" size={40} color="white" />
          </TouchableOpacity>
        </Box>
      </CameraView>
    </View>
  ) : (
    <Fragment>
      {isLoading && (
        <Loading
          flex={1}
          height="100%"
          position={'absolute'}
          top={0}
          left={0}
          right={0}
          bottom={0}
          zIndex={100}
          backgroundColor={'rgba(000, 000, 000, 0.6)'}
        />
      )}
      <ScrollScreenContainer subtitle="Carta Controle">
        <VStack px={2} space={6} mb="20%" pt={2}>
          <Title>Carta Controle</Title>
          <Pressable
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

          <SelectWithLabel
            label="Turno"
            selectedValue={turno}
            onValueChange={setTurno}
            options={listaTurnos?.map(s => (
              <Select.Item key={s?.value} label={s?.label} value={s?.value} />
            ))}
          />

          <Box mb={1}>
            <Text mb={-2} color="gray.750">
              Documento de Transporte (DT):
            </Text>
            <Input
              w="full"
              variant="underlined"
              height={14}
              size="md"
              fontSize="md"
              pb={0}
              placeholderTextColor="gray.700"
              value={documentoTransporte}
              onChangeText={t => {
                setDocumentoTransporte(t);
              }}
              _focus={{ borderColor: 'primary.700' }}
              autoComplete="off"
              keyboardType="numeric"
              maxLength={7}
            />
          </Box>

          <Box mb={1}>
            <Text mb={-2} color="gray.750">
              Remessa:
            </Text>
            <Input
              w="full"
              variant="underlined"
              height={14}
              size="md"
              fontSize="md"
              pb={0}
              placeholderTextColor="gray.700"
              value={remessa}
              onChangeText={t => {
                setRemessa(t);
              }}
              _focus={{ borderColor: 'primary.700' }}
              autoComplete="off"
              keyboardType="numeric"
              maxLength={10}
            />
          </Box>

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
              _disabled={{
                color: 'gray.900',
                opacity: 1,
                borderColor: 'gray.700',
              }}
              _focus={{ borderColor: 'primary.700' }}
              autoComplete="off"
              maxLength={30}
            />
          </Box>

          <SelectWithLabel
            label="Doca"
            selectedValue={doca}
            onValueChange={setDoca}
            options={Array.from({ length: 50 })?.map((_, index) => (
              <Select.Item
                key={String(index + 1)}
                label={String(index + 1)}
                value={String(index + 1)}
              />
            ))}
          />

          <Box mb={1}>
            <Text mb={-2} color="gray.750">
              Capacidade Veículo (N° Palles):
            </Text>
            <Input
              w="full"
              variant="underlined"
              height={14}
              size="md"
              fontSize="md"
              pb={0}
              placeholderTextColor="gray.700"
              value={capacidadeVeiculo}
              onChangeText={setCapacidadeVeiculo}
              maxLength={2}
              _focus={{ borderColor: 'primary.700' }}
              placeholder="00"
              autoComplete="off"
              keyboardType="numeric"
            />
          </Box>

          <VStack>
            <Text color="gray.750" mb={4}>
              Evidência(s){' '}
              {
                tiposEvidenciaCartaControle?.find(
                  t =>
                    t.value === TipoEvidenciaCartaControle.ORDEM_CARREGAMENTO,
                )?.label
              }
            </Text>

            {imagesList && imagesList?.length > 0 && (
              <VStack mt={1} mb={3}>
                {imagesList
                  ?.filter(
                    img =>
                      img?.type ===
                      TipoEvidenciaCartaControle.ORDEM_CARREGAMENTO,
                  )
                  ?.map((image, index) => (
                    <HStack
                      key={index}
                      space={2}
                      mb={4}
                      w="full"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <HStack space={2} alignItems="center">
                        <Image
                          key={index}
                          source={{ uri: image?.uri }}
                          alt="image"
                          size="sm"
                          width="100px"
                          height="100px"
                          borderRadius={4}
                        />
                      </HStack>
                      <Pressable
                        onPress={() => {
                          const newImagesList = imagesList?.filter(
                            img => img.id !== image.id,
                          );

                          setImagesList(newImagesList);
                        }}
                      >
                        <MaterialIcons
                          name="delete"
                          color={colors.secondary[700]}
                          size={24}
                        />
                      </Pressable>
                    </HStack>
                  ))}
              </VStack>
            )}

            <HStack
              alignItems="center"
              justifyContent="flex-start"
              mb="24px"
              space={5}
            >
              <Pressable
                onPress={() =>
                  handlePhotoLibrary(
                    TipoEvidenciaCartaControle.ORDEM_CARREGAMENTO,
                  )
                }
              >
                <MaterialIcons
                  name="photo"
                  color={colors.gray[800]}
                  size={28}
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  handleCamera(TipoEvidenciaCartaControle.ORDEM_CARREGAMENTO);
                }}
              >
                <MaterialCommunityIcons
                  name="camera"
                  color={colors.gray[800]}
                  size={28}
                />
              </Pressable>
            </HStack>
          </VStack>

          <VStack>
            <Text color="gray.750" mb={4}>
              Evidência(s){' '}
              {
                tiposEvidenciaCartaControle?.find(
                  t => t.value === TipoEvidenciaCartaControle.CARGA_DOCA,
                )?.label
              }
            </Text>

            {imagesList && imagesList?.length > 0 && (
              <VStack mt={1} mb={3}>
                {imagesList
                  ?.filter(
                    img => img?.type === TipoEvidenciaCartaControle.CARGA_DOCA,
                  )
                  ?.map((image, index) => (
                    <HStack
                      key={index}
                      space={2}
                      mb={4}
                      w="full"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <HStack space={2} alignItems="center">
                        <Image
                          key={index}
                          source={{ uri: image?.uri }}
                          alt="image"
                          size="sm"
                          width="100px"
                          height="100px"
                          borderRadius={4}
                        />
                      </HStack>
                      <Pressable
                        onPress={() => {
                          const newImagesList = imagesList?.filter(
                            img => img.id !== image.id,
                          );

                          setImagesList(newImagesList);
                        }}
                      >
                        <MaterialIcons
                          name="delete"
                          color={colors.secondary[700]}
                          size={24}
                        />
                      </Pressable>
                    </HStack>
                  ))}
              </VStack>
            )}

            <HStack
              alignItems="center"
              justifyContent="flex-start"
              mb="24px"
              space={5}
            >
              <Pressable
                onPress={() =>
                  handlePhotoLibrary(TipoEvidenciaCartaControle.CARGA_DOCA)
                }
              >
                <MaterialIcons
                  name="photo"
                  color={colors.gray[800]}
                  size={28}
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  handleCamera(TipoEvidenciaCartaControle.CARGA_DOCA);
                }}
              >
                <MaterialCommunityIcons
                  name="camera"
                  color={colors.gray[800]}
                  size={28}
                />
              </Pressable>
            </HStack>
          </VStack>

          <VStack>
            <Text color="gray.750" mb={4}>
              Evidência(s){' '}
              {
                tiposEvidenciaCartaControle?.find(
                  t =>
                    t.value === TipoEvidenciaCartaControle.INICIO_CARREGAMENTO,
                )?.label
              }
            </Text>

            {imagesList && imagesList?.length > 0 && (
              <VStack mt={1} mb={3}>
                {imagesList
                  ?.filter(
                    img =>
                      img?.type ===
                      TipoEvidenciaCartaControle.INICIO_CARREGAMENTO,
                  )
                  ?.map((image, index) => (
                    <HStack
                      key={index}
                      space={2}
                      mb={4}
                      w="full"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <HStack space={2} alignItems="center">
                        <Image
                          key={index}
                          source={{ uri: image?.uri }}
                          alt="image"
                          size="sm"
                          width="100px"
                          height="100px"
                          borderRadius={4}
                        />
                      </HStack>
                      <Pressable
                        onPress={() => {
                          const newImagesList = imagesList?.filter(
                            img => img.id !== image.id,
                          );

                          setImagesList(newImagesList);
                        }}
                      >
                        <MaterialIcons
                          name="delete"
                          color={colors.secondary[700]}
                          size={24}
                        />
                      </Pressable>
                    </HStack>
                  ))}
              </VStack>
            )}

            <HStack
              alignItems="center"
              justifyContent="flex-start"
              mb="24px"
              space={5}
            >
              <Pressable
                onPress={() =>
                  handlePhotoLibrary(
                    TipoEvidenciaCartaControle.INICIO_CARREGAMENTO,
                  )
                }
              >
                <MaterialIcons
                  name="photo"
                  color={colors.gray[800]}
                  size={28}
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  handleCamera(TipoEvidenciaCartaControle.INICIO_CARREGAMENTO);
                }}
              >
                <MaterialCommunityIcons
                  name="camera"
                  color={colors.gray[800]}
                  size={28}
                />
              </Pressable>
            </HStack>
          </VStack>

          <VStack>
            <Text color="gray.750" mb={4}>
              Evidência(s){' '}
              {
                tiposEvidenciaCartaControle?.find(
                  t => t.value === TipoEvidenciaCartaControle.MEIO_CARREGAMENTO,
                )?.label
              }
            </Text>

            {imagesList && imagesList?.length > 0 && (
              <VStack mt={1} mb={3}>
                {imagesList
                  ?.filter(
                    img =>
                      img?.type ===
                      TipoEvidenciaCartaControle.MEIO_CARREGAMENTO,
                  )
                  ?.map((image, index) => (
                    <HStack
                      key={index}
                      space={2}
                      mb={4}
                      w="full"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <HStack space={2} alignItems="center">
                        <Image
                          key={index}
                          source={{ uri: image?.uri }}
                          alt="image"
                          size="sm"
                          width="100px"
                          height="100px"
                          borderRadius={4}
                        />
                      </HStack>
                      <Pressable
                        onPress={() => {
                          const newImagesList = imagesList?.filter(
                            img => img.id !== image.id,
                          );

                          setImagesList(newImagesList);
                        }}
                      >
                        <MaterialIcons
                          name="delete"
                          color={colors.secondary[700]}
                          size={24}
                        />
                      </Pressable>
                    </HStack>
                  ))}
              </VStack>
            )}

            <HStack
              alignItems="center"
              justifyContent="flex-start"
              mb="24px"
              space={5}
            >
              <Pressable
                onPress={() =>
                  handlePhotoLibrary(
                    TipoEvidenciaCartaControle.MEIO_CARREGAMENTO,
                  )
                }
              >
                <MaterialIcons
                  name="photo"
                  color={colors.gray[800]}
                  size={28}
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  handleCamera(TipoEvidenciaCartaControle.MEIO_CARREGAMENTO);
                }}
              >
                <MaterialCommunityIcons
                  name="camera"
                  color={colors.gray[800]}
                  size={28}
                />
              </Pressable>
            </HStack>
          </VStack>

          <VStack>
            <Text color="gray.750" mb={4}>
              Evidência(s){' '}
              {
                tiposEvidenciaCartaControle?.find(
                  t =>
                    t.value === TipoEvidenciaCartaControle.FINAL_CARREGAMENTO,
                )?.label
              }
            </Text>

            {imagesList && imagesList?.length > 0 && (
              <VStack mt={1} mb={3}>
                {imagesList
                  ?.filter(
                    img =>
                      img?.type ===
                      TipoEvidenciaCartaControle.FINAL_CARREGAMENTO,
                  )
                  ?.map((image, index) => (
                    <HStack
                      key={index}
                      space={2}
                      mb={4}
                      w="full"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <HStack space={2} alignItems="center">
                        <Image
                          key={index}
                          source={{ uri: image?.uri }}
                          alt="image"
                          size="sm"
                          width="100px"
                          height="100px"
                          borderRadius={4}
                        />
                      </HStack>
                      <Pressable
                        onPress={() => {
                          const newImagesList = imagesList?.filter(
                            img => img.id !== image.id,
                          );

                          setImagesList(newImagesList);
                        }}
                      >
                        <MaterialIcons
                          name="delete"
                          color={colors.secondary[700]}
                          size={24}
                        />
                      </Pressable>
                    </HStack>
                  ))}
              </VStack>
            )}

            <HStack
              alignItems="center"
              justifyContent="flex-start"
              mb="24px"
              space={5}
            >
              <Pressable
                onPress={() =>
                  handlePhotoLibrary(
                    TipoEvidenciaCartaControle.FINAL_CARREGAMENTO,
                  )
                }
              >
                <MaterialIcons
                  name="photo"
                  color={colors.gray[800]}
                  size={28}
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  handleCamera(TipoEvidenciaCartaControle.FINAL_CARREGAMENTO);
                }}
              >
                <MaterialCommunityIcons
                  name="camera"
                  color={colors.gray[800]}
                  size={28}
                />
              </Pressable>
            </HStack>
          </VStack>

          <VStack>
            <Text color="gray.750" mb={4}>
              Evidência(s){' '}
              {
                tiposEvidenciaCartaControle?.find(
                  t => t.value === TipoEvidenciaCartaControle.PLACA_VEICULO,
                )?.label
              }
            </Text>

            {imagesList && imagesList?.length > 0 && (
              <VStack mt={1} mb={3}>
                {imagesList
                  ?.filter(
                    img =>
                      img?.type === TipoEvidenciaCartaControle.PLACA_VEICULO,
                  )
                  ?.map((image, index) => (
                    <HStack
                      key={index}
                      space={2}
                      mb={4}
                      w="full"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <HStack space={2} alignItems="center">
                        <Image
                          key={index}
                          source={{ uri: image?.uri }}
                          alt="image"
                          size="sm"
                          width="100px"
                          height="100px"
                          borderRadius={4}
                        />
                      </HStack>
                      <Pressable
                        onPress={() => {
                          const newImagesList = imagesList?.filter(
                            img => img.id !== image.id,
                          );

                          setImagesList(newImagesList);
                        }}
                      >
                        <MaterialIcons
                          name="delete"
                          color={colors.secondary[700]}
                          size={24}
                        />
                      </Pressable>
                    </HStack>
                  ))}
              </VStack>
            )}

            <HStack
              alignItems="center"
              justifyContent="flex-start"
              mb="24px"
              space={5}
            >
              <Pressable
                onPress={() =>
                  handlePhotoLibrary(TipoEvidenciaCartaControle.PLACA_VEICULO)
                }
              >
                <MaterialIcons
                  name="photo"
                  color={colors.gray[800]}
                  size={28}
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  handleCamera(TipoEvidenciaCartaControle.PLACA_VEICULO);
                }}
              >
                <MaterialCommunityIcons
                  name="camera"
                  color={colors.gray[800]}
                  size={28}
                />
              </Pressable>
            </HStack>
          </VStack>

          <Box mb={1}>
            <Text mb={-2} color="gray.750">
              Observações Gerais:
            </Text>
            <Input
              w="full"
              variant="underlined"
              minHeight={14}
              size="md"
              fontSize="md"
              pb={0}
              placeholderTextColor="gray.700"
              value={observacoes}
              onChangeText={setObservacoes}
              _focus={{ borderColor: 'primary.700' }}
              autoComplete="off"
              multiline
              maxLength={300}
            />
          </Box>

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
              onPress={handleSaveLaudoCrm}
              isLoading={isLoading}
              disabled={isLoading}
              leftIcon={<Icon as={MaterialIcons} name="save" size="md" />}
            />
          </HStack>
        </VStack>
      </ScrollScreenContainer>
    </Fragment>
  );
}
