import config from 'config';
import { downloadFile } from 'utils';
import moment from 'moment';
import {
  get,
  post
} from './utils';

let { apiUrl, mockApiUrl } = config;

if (!apiUrl) apiUrl = '';
if (!mockApiUrl) mockApiUrl = '';

export async function getDropdownList() {
  return get(`${apiUrl}/data_boutique/getBMODataDropdownData/?${moment.now()}`);
}

export async function getResultList(data) {
  return post(`${apiUrl}/data_boutique/getBMORedCompanyList/`, { filter_list: data });
}

export async function downloadBmoRedLink(data) {
  return downloadFile(`${apiUrl}/data_boutique/getBMORedFile/`, data);
}

export async function downloadStockScreenerPdfLink(api, data) {
  return downloadFile(`${apiUrl}${api}`, data);
}

export async function downloadStockScreenerExcelLink(api, data) {
  return downloadFile(`${apiUrl}${api}`, data);
}
