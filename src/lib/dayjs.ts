import 'dayjs/locale/pt-br';

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import { getCurrentTimezone } from '@/helpers/dateHelpers';

dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.tz.setDefault(getCurrentTimezone());
dayjs.locale('pt-br');
dayjs().format();
