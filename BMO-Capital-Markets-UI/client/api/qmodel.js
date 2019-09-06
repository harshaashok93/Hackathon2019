import config from 'config';
import { downloadFile } from 'utils';

let { apiUrl } = config;

if (!apiUrl) apiUrl = '';

export function downloadExcel(data = {}) {
  return downloadFile(`${apiUrl}/q_model/dailyListDownload/`, data);
}
