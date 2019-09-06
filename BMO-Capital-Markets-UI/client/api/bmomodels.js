import config from 'config';
import { downloadFile } from 'utils';
import moment from 'moment';
import {
  get,
  post,
} from './utils';

let { apiUrl, mockApiUrl } = config;

if (!apiUrl) apiUrl = '';
if (!mockApiUrl) mockApiUrl = '';

export async function getDropdownList() {
  return get(`${apiUrl}/data_boutique/getBMODataDropdownData/?${moment.now()}`);
}

export async function getResultList(api, data) {//eslint-disable-line
  return post(`${apiUrl}${api}`, data);
}

export function downloadBMOModelsFile(api, data) {
  return downloadFile(`${apiUrl}${api}?download=True&id=${data}`, {}, 'GET');
}
