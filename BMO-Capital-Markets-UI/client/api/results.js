import moment from 'moment';
import config from 'config';
import {
  post,
  get
} from './utils';

let { apiUrl } = config;

if (!apiUrl) apiUrl = '';

export async function getResults(url) {
  return get(`${apiUrl}${url}?${moment.now()}`);
}
export async function getResultsMethodPost(url, data) {
  return post(`${apiUrl}${url}`, data);
}
export async function getScreenerResults(url, data) {
  return post(`${apiUrl}${url}`, data);
}
