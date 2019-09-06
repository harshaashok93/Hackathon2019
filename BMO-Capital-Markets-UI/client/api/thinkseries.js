import config from 'config';
import {
  post,
} from './utils';

let { apiUrl } = config;

if (!apiUrl) apiUrl = '';

export async function getResults(data) {
  return post(`${apiUrl}/think_series/getThinkSeries/`, data);
}
