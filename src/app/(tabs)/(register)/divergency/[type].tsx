import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { decode } from 'base64-arraybuffer';
import dayjs from 'dayjs';
import {
  type CameraPictureOptions,
  CameraView,
  useCameraPermissions,
} from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import mime from 'mime';
import {
  Box,
  HStack,
  Icon,
  Image,
  Input,
  Pressable,
  Select,
  Text,
  useTheme,
  View,
  VStack,
} from 'native-base';
import { shade } from 'polished';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import * as z from 'zod';

import { Button } from '@/components/Button';
import { Loading } from '@/components/Loading';
import { ScrollScreenContainer } from '@/components/ScrollScreenContainer';
import { SelectWithLabel } from '@/components/SelectWithLabel';
import Title from '@/components/Title';

import { supabase } from '@/lib/supabase';
import {
  DivergenciaPost,
  TipoDivergencia,
} from '@/services/requests/divergences/types';
import { createDivergenceRequest } from '@/services/requests/divergences/utils';
import useAuthStore from '@/store/auth';
import { generateFolderName } from '@/utils/generateFoldername';
import { getNextStepsByDivergencyType } from '@/utils/getNextStepsByDivergencyType';
import { listaCDsOrigem, listaUPsOrigem } from '@/utils/listaUPs';

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

const formDivergenceSchema = z.object({
  respostas: z
    .array(
      z.object({
        tipoDivergencia: z.string().min(1, 'Campo obrigatório'),
        evidencias: z.array(z.string()).optional(),
        skuFaltandoFisicamente: z.string().optional(),
        qtdFaltandoFisicamente: z.number().optional(),
        skuSobrandoFisicamente: z.string().optional(),
        qtdSobrandoFisicamente: z.number().optional(),
        skuRecebemosFisicamente: z.string().optional(),
        qtdRecebemosFisicamente: z.number().optional(),
        skuNotaFiscal: z.string().optional(),
        qtdNotaFiscal: z.number().optional(),
        proximoPasso: z.string().min(1, 'Campo obrigatório'),
        user_id: z.string().min(1, 'Campo obrigatório'),
      }),
    )
    .nonempty(),
});

export default function Divergency() {
  const { colors } = useTheme();

  const { back } = router;
  const { type } = useLocalSearchParams<{ type: string }>();

  const user = useAuthStore(state => state.user);

  const [isLoading, setIsLoading] = useState(false);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [imagesList, setImagesList] = useState<any[]>([]);

  const [sku, setSku] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [skuNotaFiscal, setSkuNotaFiscal] = useState('');
  const [quantidadeNotaFiscal, setQuantidadeNotaFiscal] = useState('');
  const [up, setUp] = useState('');
  const [cd, setCd] = useState('');
  const [nota, setNota] = useState('');

  const [permission, requestPermission] = useCameraPermissions();

  const cameraRef = useRef<any>(null);

  useEffect(() => {
    requestPermission();
  }, []);

  const divergencyType = () => {
    if (type && type === 'falta') {
      return {
        type: TipoDivergencia.FALTA,
        text: 'Falta',
      };
    }
    if (type && type === 'sobra') {
      return {
        type: TipoDivergencia.SOBRA,
        text: 'Sobra',
      };
    }
    if (type && type === 'inversa') {
      return {
        type: TipoDivergencia.INVERSAO,
        text: 'Inversão',
      };
    }
  };

  const { control, handleSubmit, watch, getValues } = useForm<any>({
    resolver: zodResolver(formDivergenceSchema),
    defaultValues: {
      tipoDivergencia: '',
      evidencias: [],
      skuFaltandoFisicamente: '',
      qtdFaltandoFisicamente: 0,
      skuSobrandoFisicamente: '',
      qtdSobrandoFisicamente: 0,
      skuRecebemosFisicamente: '',
      qtdRecebemosFisicamente: 0,
      skuNotaFiscal: '',
      qtdNotaFiscal: 0,
      proximoPasso: '',
      user_id: '',
    },
  });

  if (!permission?.granted) {
    console.log('Não permitiu');
  }

  const handleBack = useCallback(() => {
    setSku('');
    setQuantidade('');
    setImagesList([]);
    setSkuNotaFiscal('');
    setQuantidadeNotaFiscal('');
    setNota('');
    back();
  }, [back]);

  const pickImageInLibrary = async () => {
    setLoadingPreview(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        base64: true,
        quality: 1,
      });

      if (!result.canceled && result?.assets?.length > 0) {
        const uri = result?.assets[0]?.uri;
        const fileBase64 = result?.assets[0]?.base64;
        const filename =
          result?.assets[0]?.fileName ||
          dayjs().format('DD-MM-YYYY[T]HH:mm:ss');
        const size = result?.assets[0]?.fileSize;

        const mimetype = mime.getType(uri);

        console.log('result', JSON.stringify(result, null, 2));

        setImagesList(prevState => [
          ...prevState,
          { uri, base64: fileBase64, mimetype, filename, size },
        ]);
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

        const size = photo?.size;

        console.log('photo', JSON.stringify(photo, null, 2));

        setImagesList(prevState => [
          ...prevState,
          { uri: photo?.uri, base64: photo?.base64, filename, mimetype, size },
        ]);

        setIsCameraActive(false);
        setLoadingPreview(false);
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
  }, []);

  const handleCamera = useCallback(() => {
    console.log('permission', permission);
    if (permission && !permission?.granted) {
      requestPermission();
    } else {
      if (imagesList?.length >= 3) {
        Alert.alert('Atenção', 'Você atingiu o limite de 3 imagens.');
      } else {
        setIsCameraActive(true);
      }
    }
  }, [permission, requestPermission, imagesList]);

  const handleSaveDivergence = useCallback(async () => {
    if (
      !sku ||
      !nota ||
      !quantidade ||
      !cd ||
      !up ||
      imagesList?.length === 0
    ) {
      setIsLoading(false);
      return Alert.alert(
        'Cadastro de Divergência',
        'Por favor, preencha todos os campos para cadastrar o evento.',
      );
    }

    if (divergencyType()?.type === TipoDivergencia.INVERSAO) {
      if (!skuNotaFiscal || !quantidadeNotaFiscal) {
        setIsLoading(false);
        return Alert.alert(
          'Cadastro de Divergência',
          'Por favor, preencha todos os campos para cadastrar o evento.',
        );
      }
    }

    setIsLoading(true);

    // try {

    const proximoPasso = getNextStepsByDivergencyType(
      divergencyType()?.type!,
      sku,
      quantidade,
      skuNotaFiscal,
      quantidadeNotaFiscal,
    );

    const data: DivergenciaPost = {
      tipoDivergencia: divergencyType()?.type!,
      evidencias: [],
      skuFaltandoFisicamente:
        divergencyType()?.type === TipoDivergencia.FALTA ? sku : null,
      qtdFaltandoFisicamente:
        divergencyType()?.type === TipoDivergencia.FALTA
          ? Number(quantidade)
          : null,
      skuSobrandoFisicamente:
        divergencyType()?.type === TipoDivergencia.SOBRA ? sku : null,
      qtdSobrandoFisicamente:
        divergencyType()?.type === TipoDivergencia.SOBRA
          ? Number(quantidade)
          : null,
      skuRecebemosFisicamente:
        divergencyType()?.type === TipoDivergencia.INVERSAO ? sku : null,
      qtdRecebemosFisicamente:
        divergencyType()?.type === TipoDivergencia.INVERSAO
          ? Number(quantidade)
          : null,
      skuNotaFiscal:
        divergencyType()?.type === TipoDivergencia.INVERSAO
          ? skuNotaFiscal
          : null,
      qtdNotaFiscal:
        divergencyType()?.type === TipoDivergencia.INVERSAO
          ? Number(quantidadeNotaFiscal)
          : null,
      proximoPasso,
      upOrigem: up,
      cdOrigem: cd,
      notaFiscal: nota,
      user_id: user?.id!,
    };

    console.log('data', JSON.stringify(data, null, 2));
    const response = await createDivergenceRequest(data);
    console.log('response', JSON.stringify(response, null, 2));

    if (response?.status === 201 && response?.data?.length > 0) {
      // console.log('response', JSON.stringify(response, null, 2));

      // push(`/(home)/enunciado/${routeParams}`);

      const evidencias =
        imagesList?.length > 0
          ? imagesList?.map(i => {
              const extension = mime.getExtension(i?.mimetype);

              return {
                base64: i?.base64,
                mimetype: i?.mimetype,
                filename: `${i?.filename}.${extension}`,
              };
            })
          : [];

      if (evidencias?.length > 0) {
        const folderName = generateFolderName(
          'divergencia',
          response?.data[0]?.id,
        );

        let evidenciasIds: string[] = [];

        for await (const evidencia of evidencias) {
          console.log('folderName', folderName);

          const { data, error } = await supabase.storage
            .from(folderName)
            .upload(evidencia?.filename, decode(evidencia?.base64), {
              contentType: evidencia?.mimetype,
              upsert: false,
            });

          delete evidencia.base64;

          console.log('evidencia', JSON.stringify(evidencia, null, 2));

          console.log('test data', JSON.stringify(data, null, 2));
          console.log('test error', JSON.stringify(error, null, 2));

          if (error !== null) {
            Alert.alert(
              'Ops!',
              'Ocorreu um erro ao salvar as Evidências da Divergência, tente novamente mais tarde.',
            );
          }

          console.log('test data', JSON.stringify(data, null, 2));
          console.log('test error', JSON.stringify(error, null, 2));

          const path = data?.fullPath?.split('/')?.slice(3)?.join('/');

          evidenciasIds = [...evidenciasIds, path!];
        }

        if (evidenciasIds?.length > 0) {
          const isUnique = evidenciasIds.filter(
            (value, index, self) => self.indexOf(value) === index,
          );

          const responseUpdate = await supabase
            .from('divergencias')
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
              'Ocorreu um erro ao vincular as Evidências a Divergência, tente novamente mais tarde.',
            );
          }

          if (responseUpdate?.status === 200) {
            return Alert.alert('Próximos Passos', proximoPasso, [
              {
                text: 'OK, entendi',
                onPress: () => {
                  handleBack();
                },
              },
            ]);
          }
        }
      } else {
        setIsLoading(false);

        return Alert.alert('Próximos Passos', proximoPasso, [
          {
            text: 'OK, entendi',
            onPress: () => {
              handleBack();
            },
          },
        ]);
      }
    } else {
      Alert.alert(
        'Ops!',
        'Ocorreu um erro ao salvar a Divergência, tente novamente mais tarde.',
      );
    }
    setIsLoading(false);

    //   const response = await createDivergenceRequest(data);

    //   if (response?.status === 201) {
    //     console.log('response', JSON.stringify(response?.data, null, 2));

    //     Alert.alert('Próximos Passos', proximoPasso, [
    //       {
    //         text: 'OK, entendi',
    //         onPress: () => {
    //           handleBack();
    //         },
    //       },
    //     ]);
    //   } else {
    //     Alert.alert(
    //       'Ops!',
    //       'Ocorreu um erro ao salvar a Divergência, tente novamente mais tarde.',
    //     );
    //   }
    // } catch (error) {
    //   Alert.alert('Ops!', 'Ocorreu um erro ao salvar a Divergência.');
    //   console.log('Error response', JSON.stringify(error, null, 2));
    // } finally {
    //   setIsLoading(false);
    // }
  }, [
    handleBack,
    imagesList,
    divergencyType,
    getNextStepsByDivergencyType,
    sku,
    quantidade,
    skuNotaFiscal,
    quantidadeNotaFiscal,
    supabase,
    up,
    cd,
    nota,
    uuidv4,
  ]);

  const handleCancel = useCallback(() => {
    Alert.alert(
      'Cancelar Divergência',
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

  const handlePhotoLibrary = useCallback(async () => {
    if (imagesList?.length >= 3) {
      Alert.alert('Atenção', 'Você atingiu o limite de 3 imagens.');
    } else {
      await pickImageInLibrary();
    }
  }, [imagesList]);

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
    <>
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
      <ScrollScreenContainer subtitle="Divergência">
        <VStack px={2}>
          <Title mb={3}>{`Divergência - ${divergencyType()?.text}`}</Title>

          <Text color="gray.750" mb={4}>
            Evidência(s)
          </Text>

          {imagesList && imagesList?.length > 0 && (
            <VStack mt={1} mb={3}>
              {imagesList?.map((image, index) => (
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
                        (_, idx) => idx !== index,
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
            <Pressable onPress={handlePhotoLibrary}>
              <MaterialIcons name="photo" color={colors.gray[800]} size={28} />
            </Pressable>
            <Pressable
              onPress={() => {
                handleCamera();
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

        <Box mb={1} px={2}>
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
            autoComplete="off"
            keyboardType="numeric"
            maxLength={10}
          />
        </Box>

        {divergencyType()?.type === TipoDivergencia.FALTA && (
          <VStack px={2} space={6} pt={2}>
            <Box mb={1}>
              <Text mb={-2} color="gray.750">
                Qual SKU está faltando fisicamente?
              </Text>
              <Input
                w="full"
                variant="underlined"
                height={14}
                size="md"
                fontSize="md"
                pb={0}
                placeholderTextColor="gray.700"
                value={sku}
                onChangeText={t => {
                  setSku(t);
                }}
                _focus={{ borderColor: 'primary.700' }}
                autoComplete="off"
                keyboardType="numeric"
              />
            </Box>
            <Box mb={1}>
              <Text mb={-2} color="gray.750">
                Qual a quantidade que está faltando fisicamente?
              </Text>
              <Input
                w="full"
                variant="underlined"
                height={14}
                size="md"
                fontSize="md"
                pb={0}
                placeholderTextColor="gray.700"
                value={quantidade}
                onChangeText={t => {
                  setQuantidade(t);
                }}
                _focus={{ borderColor: 'primary.700' }}
                autoComplete="off"
                keyboardType="numeric"
              />
            </Box>

            {/* {isAlertVisible && (
              <HStack
                space={3}
                alignItems={'center'}
                background={'gray.100'}
                py={2}
                px={4}
                borderRadius={4}
              >
                <MaterialCommunityIcons
                  name="alert"
                  color={colors.primary[700]}
                  size={24}
                />
                <VStack>
                  <Text
                    fontSize={'md'}
                    fontWeight={'semibold'}
                    mb={-2}
                    color="black"
                  >
                    Próximo passo:
                  </Text>
                  <Text
                    fontSize={'md'}
                    fontWeight={'semibold'}
                    mt={2}
                    color="primary.700"
                  >
                    {`Solicitar o envio do saldo para a origem. (${sku} - ${quantidade})`}
                  </Text>
                </VStack>
              </HStack>
            )} */}
          </VStack>
        )}

        {divergencyType()?.type === TipoDivergencia.SOBRA && (
          <VStack px={2} space={6} pt={2}>
            <Box mb={1}>
              <Text mb={-2} color="gray.750">
                Qual SKU está sobrando fisicamente?
              </Text>
              <Input
                w="full"
                variant="underlined"
                height={14}
                size="md"
                fontSize="md"
                pb={0}
                placeholderTextColor="gray.700"
                value={sku}
                onChangeText={t => {
                  setSku(t);
                }}
                _focus={{ borderColor: 'primary.700' }}
                autoComplete="off"
                keyboardType="numeric"
              />
            </Box>
            <Box mb={1}>
              <Text mb={-2} color="gray.750">
                Qual a quantidade que está sobrando fisicamente?
              </Text>
              <Input
                w="full"
                variant="underlined"
                height={14}
                size="md"
                fontSize="md"
                pb={0}
                placeholderTextColor="gray.700"
                value={quantidade}
                onChangeText={t => {
                  setQuantidade(t);
                }}
                _focus={{ borderColor: 'primary.700' }}
                autoComplete="off"
                keyboardType="numeric"
              />
            </Box>
          </VStack>
        )}

        {divergencyType()?.type === TipoDivergencia.INVERSAO && (
          <VStack px={2} space={6} pt={2}>
            <Box mb={1}>
              <Text mb={-2} color="gray.750">
                Qual SKU recebemos fisicamente?
              </Text>
              <Input
                w="full"
                variant="underlined"
                height={14}
                size="md"
                fontSize="md"
                pb={0}
                placeholderTextColor="gray.700"
                value={sku}
                onChangeText={t => {
                  setSku(t);
                }}
                _focus={{ borderColor: 'primary.700' }}
                autoComplete="off"
                keyboardType="numeric"
              />
            </Box>
            <Box mb={1}>
              <Text mb={-2} color="gray.750">
                Qual a quantidade que recebemos fisicamente?
              </Text>
              <Input
                w="full"
                variant="underlined"
                height={14}
                size="md"
                fontSize="md"
                pb={0}
                placeholderTextColor="gray.700"
                value={quantidade}
                onChangeText={t => {
                  setQuantidade(t);
                }}
                _focus={{ borderColor: 'primary.700' }}
                autoComplete="off"
                keyboardType="numeric"
              />
            </Box>
            <Box mb={1}>
              <Text mb={-2} color="gray.750">
                Qual SKU está na nota fiscal?
              </Text>
              <Input
                w="full"
                variant="underlined"
                height={14}
                size="md"
                fontSize="md"
                pb={0}
                placeholderTextColor="gray.700"
                value={skuNotaFiscal}
                onChangeText={t => {
                  setSkuNotaFiscal(t);
                }}
                _focus={{ borderColor: 'primary.700' }}
                autoComplete="off"
                keyboardType="numeric"
              />
            </Box>
            <Box mb={1}>
              <Text mb={-2} color="gray.750">
                Qual a quantidade que está na nota fiscal?
              </Text>
              <Input
                w="full"
                variant="underlined"
                height={14}
                size="md"
                fontSize="md"
                pb={0}
                placeholderTextColor="gray.700"
                value={quantidadeNotaFiscal}
                onChangeText={t => {
                  setQuantidadeNotaFiscal(t);
                }}
                _focus={{ borderColor: 'primary.700' }}
                autoComplete="off"
                keyboardType="numeric"
              />
            </Box>

            {/* {isAlertVisible && (
              <HStack
                space={3}
                alignItems={'center'}
                background={'gray.100'}
                py={2}
                px={4}
                borderRadius={4}
              >
                <MaterialCommunityIcons
                  name="alert"
                  color={colors.primary[700]}
                  size={24}
                />
                <VStack>
                  <Text
                    fontSize={'md'}
                    fontWeight={'semibold'}
                    mb={-2}
                    color="black"
                  >
                    Próximo passo:
                  </Text>
                  <Text
                    fontSize={'md'}
                    fontWeight={'semibold'}
                    mt={2}
                    color="primary.700"
                  >
                    {`Solicitar o envio do saldo para a origem. (${sku} - ${quantidade})`}
                  </Text>
                </VStack>
              </HStack>
            )} */}
          </VStack>
        )}

        <VStack px={2} pt={6} space={6}>
          <SelectWithLabel
            label="UP de Origem"
            selectedValue={up}
            onValueChange={setUp}
            options={listaUPsOrigem?.map(s => (
              <Select.Item key={s?.value} label={s?.label} value={s?.value} />
            ))}
          />

          <SelectWithLabel
            label="CD de Origem"
            selectedValue={cd}
            onValueChange={setCd}
            options={listaCDsOrigem?.map(s => (
              <Select.Item key={s?.value} label={s?.label} value={s?.value} />
            ))}
          />
        </VStack>

        <HStack mt="8%" px={2} width="100%" justifyContent="space-between">
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
            onPress={handleSaveDivergence}
            isLoading={isLoading}
            disabled={isLoading}
            leftIcon={<Icon as={MaterialIcons} name="save" size="md" />}
          />
        </HStack>
      </ScrollScreenContainer>
    </>
  );
}
