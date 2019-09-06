import moment from 'moment';
import config from 'config';
import {
  get,
  post
} from './utils';

let { apiUrl, mockApiUrl } = config;

if (!apiUrl) apiUrl = '';
if (!mockApiUrl) mockApiUrl = '';

export async function getQuantData() {
  return get(`${apiUrl}/quant/getQuantTechData/?${moment.now()}`);
}

export async function getTipsData(data) {//eslint-disable-line
  return get(`${apiUrl}/quant/getTipsData/?${moment.now()}`);
}

export async function getQuantSectionData(data) {
  return post(`${apiUrl}/quant/get_quantitative_reports/`, data);
}
