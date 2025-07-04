import dayjs from 'dayjs';

interface DaysProps {
  day: string;
  value: string;
}

interface MonthProps {
  month: string;
  value: string;
}

export const convertStringToDate = (date: string): Date => {
  const convertedDate = new Date(date);

  return convertedDate;
};

export const getDateOfDateInput = (date: string): string => {
  if (typeof date !== 'string') return '';
  if (date === '') return '';

  const dateParts = date.split('T');

  return dateParts[0];
};

export const getHourOfDateInput = (date: string): string => {
  if (typeof date !== 'string') return '';
  if (date === '') return '';

  const dateParts = date.split('T');

  return dateParts[1];
};

export const meses: MonthProps[] = [
  { month: 'Janeiro', value: 'Janeiro' },
  { month: 'Fevereiro', value: 'Fevereiro' },
  { month: 'Março', value: 'Março' },
  { month: 'Abril', value: 'Abril' },
  { month: 'Maio', value: 'Maio' },
  { month: 'Junho', value: 'Junho' },
  { month: 'Julho', value: 'Julho' },
  { month: 'Agosto', value: 'Agosto' },
  { month: 'Setembro', value: 'Setembro' },
  { month: 'Outubro', value: 'Outubro' },
  { month: 'Novembro', value: 'Novembro' },
  { month: 'Dezembro', value: 'Dezembro' },
];

export const dias: DaysProps[] = [
  { day: '1', value: '1' },
  { day: '2', value: '2' },
  { day: '3', value: '3' },
  { day: '4', value: '4' },
  { day: '5', value: '5' },
  { day: '6', value: '6' },
  { day: '7', value: '7' },
  { day: '8', value: '8' },
  { day: '9', value: '9' },
  { day: '10', value: '10' },
  { day: '11', value: '11' },
  { day: '12', value: '12' },
  { day: '13', value: '13' },
  { day: '14', value: '14' },
  { day: '15', value: '15' },
  { day: '16', value: '16' },
  { day: '17', value: '17' },
  { day: '18', value: '18' },
  { day: '19', value: '19' },
  { day: '20', value: '20' },
  { day: '21', value: '21' },
  { day: '22', value: '22' },
  { day: '23', value: '23' },
  { day: '24', value: '24' },
  { day: '25', value: '25' },
  { day: '26', value: '26' },
  { day: '27', value: '27' },
  { day: '28', value: '28' },
  { day: '29', value: '29' },
  { day: '30', value: '30' },
  { day: '31', value: '31' },
];

export const convertStringToDateToSave = (date: string): any => {
  const convertedDate = dayjs(date).toDate();

  return convertedDate;
};

export const getCurrentTimezone = () => dayjs.tz.guess();
