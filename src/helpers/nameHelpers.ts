export const splitName = (name: string, partOfName: string) => {
  if (!name) return '';

  const fullName = name.split(' ');
  if (partOfName === 'firstName') {
    return fullName[0];
  }
  return fullName[1];
};

export const getUserStatus = (status: string) => {
  if (!status) return '';

  if (status === 'US1') {
    return 'Ativo';
  }
  if (status === 'US2') {
    return 'Desativado';
  }
  return 'Pendente';
};

export const getBoardMemberProfile = (profile: string) => {
  if (!profile) return '';

  if (profile === 'BMS1') {
    return 'Admin';
  }
  return 'Membro';
};

export const getUserProfile = (profile: string) => {
  if (!profile) return '';

  if (profile === 'UN1' || profile === 'UN2') {
    return 'Admin';
  }
  if (profile === 'UN3') {
    return 'Membro';
  }
  return 'Convidado';
};

export const getNumberFormatted = (num: number) => {
  if (num >= 0 && num < 10) return `0${num}`;
  if (num < 0) return '00';
  if (num >= 10) return `${num}`;
  return '00';
};
