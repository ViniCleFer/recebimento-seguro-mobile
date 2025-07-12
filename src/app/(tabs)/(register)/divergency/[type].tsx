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
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
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
  formContainer: {
    paddingHorizontal: 8,
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
    marginBottom: 16,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  inputGroup: {
    marginBottom: 4,
    paddingHorizontal: 8,
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
  selectContainer: {
    paddingHorizontal: 8,
    gap: 24,
    paddingTop: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingHorizontal: 8,
  },
  alertContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  alertText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: -8,
    color: 'black',
  },
  alertNextStep: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    color: '#084077',
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
  const { back } = router;
  const { type } = useLocalSearchParams<{ type: string }>();

  const user = useAuthStore(state => state.user);

  const [isLoading, setIsLoading] = useState(false);

  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
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
        setImagesList(prevState => [
          ...prevState,
          { uri: photo?.uri, base64: photo?.base64, filename, mimetype, size },
        ]);
        setIsCameraModalOpen(false);
        setLoadingPreview(false);
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
  }, []);

  const handleCamera = useCallback(() => {
    if (permission && !permission?.granted) {
      requestPermission();
    } else {
      if (imagesList?.length >= 3) {
        Alert.alert('Atenção', 'Você atingiu o limite de 3 imagens.');
      } else {
        setIsCameraModalOpen(true);
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
      <ScrollScreenContainer subtitle="Divergência">
        <View style={styles.formContainer}>
          <Title style={{ marginBottom: 12 }}>{`Divergência - ${
            divergencyType()?.text
          }`}</Title>

          <Text style={styles.evidenceTitle}>Evidência(s)</Text>

          {imagesList && imagesList?.length > 0 && (
            <View style={styles.evidenceList}>
              {imagesList?.map((image, index) => (
                <View key={index} style={styles.evidenceItem}>
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
                      style={styles.evidenceImage}
                      resizeMode="cover"
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      const newImagesList = imagesList?.filter(
                        (_, idx) => idx !== index,
                      );

                      setImagesList(newImagesList);
                    }}
                  >
                    <MaterialIcons name="delete" color="#dc2626" size={24} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <View style={styles.evidenceActions}>
            <TouchableOpacity onPress={handlePhotoLibrary}>
              <MaterialIcons name="photo" color="#374151" size={28} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handleCamera();
              }}
            >
              <MaterialCommunityIcons name="camera" color="#374151" size={28} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Nota Fiscal/DT:</Text>
          <TextInput
            style={styles.textInput}
            placeholderTextColor="#6b7280"
            value={nota}
            onChangeText={setNota}
            placeholder=""
            autoComplete="off"
            keyboardType="numeric"
            maxLength={10}
          />
        </View>

        {divergencyType()?.type === TipoDivergencia.FALTA && (
          <View style={{ paddingHorizontal: 8, gap: 24, paddingTop: 8 }}>
            <View style={{ marginBottom: 8 }}>
              <Text style={{ color: '#6b7280', marginBottom: 4 }}>
                Qual SKU está faltando fisicamente?
              </Text>
              <TextInput
                style={styles.textInput}
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
                style={styles.textInput}
                placeholderTextColor="#6b7280"
                value={quantidade}
                onChangeText={setQuantidade}
                autoComplete="off"
                keyboardType="numeric"
              />
            </View>
          </View>
        )}

        {divergencyType()?.type === TipoDivergencia.SOBRA && (
          <View style={{ paddingHorizontal: 8, gap: 24, paddingTop: 8 }}>
            <View style={{ marginBottom: 8 }}>
              <Text style={{ color: '#6b7280', marginBottom: 4 }}>
                Qual SKU está sobrando fisicamente?
              </Text>
              <TextInput
                style={styles.textInput}
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
                style={styles.textInput}
                placeholderTextColor="#6b7280"
                value={quantidade}
                onChangeText={setQuantidade}
                autoComplete="off"
                keyboardType="numeric"
              />
            </View>
          </View>
        )}

        {divergencyType()?.type === TipoDivergencia.INVERSAO && (
          <View style={{ paddingHorizontal: 8, gap: 24, paddingTop: 8 }}>
            <View style={{ marginBottom: 8 }}>
              <Text style={{ color: '#6b7280', marginBottom: 4 }}>
                Qual SKU recebemos fisicamente?
              </Text>
              <TextInput
                style={styles.textInput}
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
                style={styles.textInput}
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
                style={styles.textInput}
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
                style={styles.textInput}
                placeholderTextColor="#6b7280"
                value={quantidadeNotaFiscal}
                onChangeText={setQuantidadeNotaFiscal}
                autoComplete="off"
                keyboardType="numeric"
              />
            </View>
          </View>
        )}

        <View style={{ paddingHorizontal: 8, paddingTop: 24, gap: 24 }}>
          <SelectWithLabel
            label="UP de Origem"
            value={up}
            onValueChange={setUp}
            options={listaUPsOrigem?.map(s => ({
              label: s?.label,
              value: s?.value,
            }))}
          />

          <SelectWithLabel
            label="CD de Origem"
            value={cd}
            onValueChange={setCd}
            options={listaCDsOrigem?.map(s => ({
              label: s?.label,
              value: s?.value,
            }))}
          />
        </View>

        <View style={styles.buttonRow}>
          <Button
            style={{ width: '48%', height: 50, backgroundColor: '#374151' }}
            title="Cancelar"
            onPress={handleCancel}
            disabled={isLoading}
            textStyle={{ color: 'white' }}
          />

          <Button
            style={{ width: '48%', height: 50, backgroundColor: '#2e2efe' }}
            title="Salvar"
            onPress={handleSaveDivergence}
            disabled={isLoading}
            textStyle={{ color: 'white' }}
          />
        </View>
      </ScrollScreenContainer>
    </>
  );
}
