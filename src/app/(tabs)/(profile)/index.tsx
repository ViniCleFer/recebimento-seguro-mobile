import { decode } from 'base64-arraybuffer';
import * as ImagePicker from 'expo-image-picker';
import { router, useFocusEffect } from 'expo-router';
import { Camera, UserCheck, UserX } from 'lucide-react-native';
import mime from 'mime';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Backdrop } from '@/components/Backdrop';
import { ScrollScreenContainer } from '@/components/ScrollScreenContainer';

import { supabase } from '@/lib/supabase';

import { stringAvatar } from '@/helpers/avatarGenerator';

import { User } from '@/services/requests/users/types';
import {
  getUserProfileByIdRequest,
  updateUserProfileRequest,
} from '@/services/requests/users/utils';

import useAuthStore from '@/store/auth';

import { colors } from '@/styles/theme';

import { generateFolderName } from '@/utils/generateFoldername';

interface AvatarData {
  id: string;
  uri: string;
  base64: string;
  mimetype: string;
  filename: string;
  size: number;
}

export default function ProfileScreen() {
  const {
    user: userProfile,
    setUser: setUserProfile,
    signOut,
  } = useAuthStore(state => state);

  console.log('userProfile', JSON.stringify(userProfile, null, 2));

  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState(userProfile?.user_metadata?.name || '');
  const [avatarData, setAvatarData] = useState<AvatarData | null>(null);
  const [email, setEmail] = useState(userProfile?.email || '');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const loadUserById = useCallback(async (userId: string) => {
    try {
      const response = await getUserProfileByIdRequest(userId);

      if (response?.status === 200) {
        const userData = response?.data;

        setUser(userData);
        setName(userData?.name || '');
        setEmail(userData?.email || '');
        setAvatarData(
          user?.avatarUrl
            ? {
                uri: user?.avatarUrl!,
                base64: '',
                mimetype: '',
                filename: '',
                size: 0,
                id: '',
              }
            : null,
        );
      }
    } catch (error) {
      console.error('Error Profile loadUserById => ', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (userProfile && userProfile?.id) {
        setIsLoading(true);
        loadUserById(userProfile?.id);
      }
    }, [userProfile]),
  );

  const deleteAccount = async () => {
    const data = {
      canceled_at: new Date(),
    };

    const response = await updateUserProfileRequest(data, userProfile?.id!);

    if (response?.status === 200 && response?.data?.length > 0) {
      setIsLoading(false);

      return Alert.alert('Sucesso!', 'Usuário deletado com sucesso!', [
        {
          text: 'Fechar',
          onPress: () => {
            signOut();
          },
        },
      ]);
    }
  };

  const handleDeleteAccount = () => {
    if (!userProfile) return;

    Alert.alert(
      'Excluir Coleção',
      `Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            deleteAccount();
            router.back();
          },
        },
      ],
    );
  };

  const handleSave = async () => {
    setIsLoading(true);

    if (!user) {
      Alert.alert('Erro', 'Por favor, você precisa estar logado na aplicação');
      return;
    }

    if (!name.trim()) {
      Alert.alert('Erro', 'Por favor, insira o nome da coleção');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Erro', 'Por favor, digite um endereço de e-mail válido');
      return;
    }

    const data = {
      name: name.trim(),
      avatarUrl: user?.avatarUrl || null,
      email: email.trim(),
    };

    console.log('data', JSON.stringify(data, null, 2));
    console.log(
      'avatarData',
      JSON.stringify(
        {
          uri: avatarData?.uri,
          base64: avatarData?.base64?.substring(0, 10),
          mimetype: avatarData?.mimetype,
          filename: avatarData?.filename,
          size: avatarData?.size,
          id: avatarData?.id,
        },
        null,
        2,
      ),
    );

    // addCollection(data);

    const response = await updateUserProfileRequest(data, user?.id!);

    console.log(response?.data);

    if (response?.status === 200 && response?.data?.length > 0) {
      let avatar = null;

      if (avatarData !== null) {
        // const extension = mime.getExtension(avatarData?.mimetype);

        avatar = {
          base64: avatarData?.base64,
          mimetype: avatarData?.mimetype,
          filename: `${avatarData?.filename}`,
        };
      }

      console.log('avatar', JSON.stringify(avatar, null, 2));
      console.log('user?.id', user?.id);

      if (avatar !== null && avatar?.filename !== user?.avatarUrl) {
        let avatarPath = null;

        const folderName = generateFolderName('', '', null, user?.id, true);
        console.log('folderName', folderName);

        const { data, error } = await supabase.storage
          .from(folderName)
          .upload(avatar?.filename, decode(avatar?.base64), {
            contentType: avatar?.mimetype,
            upsert: false,
          });

        avatar.base64 = '';

        if (error !== null) {
          setIsLoading(false);
          Alert.alert(
            'Ops!',
            'Ocorreu um erro ao editar o avatar do usuário, tente novamente mais tarde.',
          );
        }

        const path = data?.fullPath;

        avatarPath = path!;

        console.log('avatarPath', avatarPath);

        if (avatarPath !== null) {
          const updateUserProfileData = { avatarUrl: avatarPath };

          // console.log(
          //   'updateUserProfileData',
          //   JSON.stringify(updateUserProfileData, null, 2),
          // );
          // console.log('collection?.id!', collection?.id!);

          const responseUpdate = await updateUserProfileRequest(
            updateUserProfileData,
            user?.id!,
          );

          // console.log(
          //   'responseUpdate',
          //   JSON.stringify(responseUpdate, null, 2),
          // );

          setIsLoading(false);

          if (responseUpdate?.data === null) {
            return Alert.alert(
              'Ops!',
              'Ocorreu um erro ao vincular o Avatar ao Usuário, tente novamente mais tarde.',
            );
          }

          if (responseUpdate && responseUpdate?.status === 200) {
            return Alert.alert('Sucesso!', 'Usuário editado com sucesso!');
          }
        }
      } else {
        setIsLoading(false);

        return Alert.alert('Sucesso!', 'Usuário editado com sucesso!');
      }

      setIsLoading(false);
    } else {
      Alert.alert(
        'Editar Usuário',
        'Ocorreu um erro ao editar o Usuário, tente novamente mais tarde.',
      );
      setIsLoading(false);
    }

    // router.back();
  };

  const handleCover = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        'Permissão necessária',
        'É necessário permitir o acesso à galeria de fotos para alterar a capa.',
      );
      return;
    }

    // Abrir a galeria de imagens
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      // aspect: [16, 9], // Proporção da capa
      quality: 1,
      base64: true,
    });

    if (!result?.canceled && result?.assets?.length > 0) {
      const id = new Date().toDateString();
      const uri = result?.assets[0]?.uri!;
      const base64 = result?.assets[0]?.base64!;
      const filename = result?.assets[0]?.fileName || id;
      const size = result?.assets[0]?.fileSize!;

      const mimetype = mime.getType(uri) ?? 'image/jpeg';

      console.log(
        'result',
        JSON.stringify(
          {
            mimetype,
            uri,
            base64: base64?.substring(0, 10),
            size,
            filename,
            id,
          },
          null,
          2,
        ),
      );

      setAvatarData({
        uri,
        base64,
        mimetype,
        filename,
        size,
        id,
      });
    }
  };

  return (
    <ScrollScreenContainer contentContainerStyle={styles.container}>
      <Backdrop color={colors.primary} visible={isLoading} />

      <View style={styles.avatarSection}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleCover}
          style={styles.avatarContainer}
        >
          {avatarData?.uri ? (
            <Image source={{ uri: avatarData?.uri }} style={styles.avatar} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarName}>
                {stringAvatar(user?.name!)?.initials}
              </Text>
              <Camera size={18} color="#FFFFFF" />
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.formSection}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Digite seu nome..."
            placeholderTextColor="#8E8E93"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput style={styles.input} value={email} editable={false} />
        </View>
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        activeOpacity={0.7}
        onPress={handleSave}
      >
        <UserCheck size={20} color="#FFFFFF" />
        <Text style={styles.signOutText}>Salvar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.signOutButton}
        activeOpacity={0.7}
        onPress={handleDeleteAccount}
      >
        <UserX size={20} color="#FFFFFF" />
        <Text style={styles.signOutText}>Deletar Conta</Text>
      </TouchableOpacity>
    </ScrollScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: 'relative',
    backgroundColor: colors.primary,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
  },
  avatarName: {
    fontSize: 40,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
    gap: 20,
  },
  inputGroup: {
    flexDirection: 'column',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E7',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1C1C1E',
    backgroundColor: '#F8F9FA',
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  signOutButton: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
