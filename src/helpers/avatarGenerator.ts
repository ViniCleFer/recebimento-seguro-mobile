import { colors } from '@/styles/theme';

export function stringToColor(string: string) {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}

export function stringAvatar(name: string) {
  // console.log({ name });
  if (!name) {
    return {
      sx: {
        bgcolor: colors.primary,
        color: 'white',
      },
      children: '',
    };
  }

  const nameParts = name?.split(' ');

  function renderName() {
    if (nameParts?.length > 1) {
      return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`;
    }
    return `${nameParts[0].charAt(0)}${nameParts[0].charAt(1)}`;
  }

  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    initials: `${renderName()}`,
  };
}
