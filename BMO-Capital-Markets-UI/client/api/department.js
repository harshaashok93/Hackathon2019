import moment from 'moment';
import config from 'config';
import { downloadFile } from 'utils';
import {
  get,
  post
} from './utils';

let { apiUrl } = config;

if (!apiUrl) apiUrl = '';

export async function getAnalystProfileLinks(number) {
  return get(`${apiUrl}/our_department/getRandomAnalyst/${number}/?${moment.now()}`);
}

export async function getCoverageOverlay(data) {
  return post(`${apiUrl}/our_department/getCoverageOverlayData/`, data);
}

export async function getCoverageSectorData(data) {
  return post(`${apiUrl}/our_department/getAllCoverages/`, data);
}

export async function getAnalystsData(data) {
  return post(`${apiUrl}/our_department/getAllAnalysts/`, data);
}

export async function getAnalystDetail(code) {
  return get(`${apiUrl}/our_department/getAnalystDetail/${code}/?${moment.now()}`);
}

export function downloadAnalystBioPDF(data) {
  return downloadFile(`${apiUrl}/our_department/analystBioPDF/?clientcode=${data}&${moment.now()}`, {}, 'GET');
}
