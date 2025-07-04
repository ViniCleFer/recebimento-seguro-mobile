import { capitalizeFirstLetterOfWords } from './capitalizeFirstLetterOfWords';

export function wordNormalize(palavra: string) {
  if (!palavra) {
    return '';
  }

  const palavraSemUnderscore = palavra?.replace(/_/g, ' ')?.toLowerCase();

  const palavraNormalizada = palavraSemUnderscore
    ?.split(' ')
    ?.map(word => {
      return capitalizeFirstLetterOfWords(word);
    })
    ?.join(' ');

  return palavraNormalizada;
}
