import config from 'config';
import {
  post
} from './utils';

let { apiUrl } = config;

if (!apiUrl) apiUrl = '';

export async function getSectorsData(data) {
  return post(`${apiUrl}/our_department/getSectors/`, data);
}

export async function getAnalystsData(data) {
  return post(`${apiUrl}/our_department/getAnalysts/`, data);
}

export async function postOnboardingData(data) {
  return post(`${apiUrl}/user/create_pref/`, data);
}
