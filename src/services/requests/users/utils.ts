import { supabase } from '@/lib/supabase';
import { UserPut } from './types';

export async function getAvatarUrlRequest(avatarUrl: string) {
  const bucketName = 'avatars';

  const avatarPath = avatarUrl.split(`avatars/`)[1];

  const { data } = supabase.storage.from(bucketName).getPublicUrl(avatarPath);

  return { data };
}

export async function getUserProfileByIdRequest(userId: string) {
  const { data, error, status, statusText, count } = await supabase
    .from('users')
    .select()
    .eq('id', userId);

  if (error) {
    console.error(
      'Error getUserProfileByIdRequest',
      JSON.stringify(error, null, 2),
    );
    return null;
  }

  console.log(
    'Success getUserProfileByIdRequest',
    JSON.stringify(
      {
        data,
        status,
        statusText,
        count,
      },
      null,
      2,
    ),
  );

  if (status === 200 && data?.length > 0) {
    let user = data[0];
    const avatarUrlCollection = user?.avatarUrl;

    if (avatarUrlCollection) {
      const { data } = await getAvatarUrlRequest(avatarUrlCollection);

      console.log('avatar gerada', data);
      console.log('avatar gerada', data?.publicUrl);

      const avatarUrl = data?.publicUrl;

      user = {
        ...user,
        avatarUrl,
      };
    }

    return { data: user, status };
  }

  return { data, status };
}

export async function updateUserProfileRequest(
  userProfileData: Partial<UserPut>,
  userProfileId: string,
) {
  const { error, data, status, statusText, count } = await supabase
    .from('users')
    .update(userProfileData)
    .eq('id', userProfileId)
    .select();

  if (error) {
    console.error(
      'Error updateUserProfileRequest',
      JSON.stringify(error, null, 2),
    );
    return null;
  }
  console.log(
    'Success updateUserProfileRequest',
    JSON.stringify(
      {
        data,
        status,
        statusText,
        count,
      },
      null,
      2,
    ),
  );

  return { data, status };
}
