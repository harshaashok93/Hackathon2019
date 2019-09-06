import config from 'config';
import moment from 'moment';

import {
  get
} from './utils';

let { apiUrl } = config;

if (!apiUrl) apiUrl = '';

export async function researchLayoutAPI(pid, url) {
  if (url) {
    return get(`${apiUrl}${url}&${moment.now()}`);
  }
  return get(`${apiUrl}/publication/getPublicationData/${pid}/?${moment.now()}`);
}
