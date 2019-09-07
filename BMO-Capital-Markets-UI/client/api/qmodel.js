import config from 'config';
import moment from 'moment';

import {
  get,
  downloadFile
} from './utils';

let { apiUrl } = config;

if (!apiUrl) apiUrl = '';

export function downloadExcel(data = {}) {
  return downloadFile(`${apiUrl}/q_model/dailyListDownload/`, data);
}

export function getGraph() {
    return get(`${apiUrl}/hackathon/companyGraph/?${moment.now()}`);
}
