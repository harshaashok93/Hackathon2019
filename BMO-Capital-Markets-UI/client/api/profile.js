import config from 'config';
import { downloadFile } from 'utils';
import moment from 'moment';
import {
  get,
  post,
} from './utils';

let { apiUrl } = config;

if (!apiUrl) apiUrl = '';

export async function getCompanyDropDownList() {
  return get(`${apiUrl}/data_boutique/getDropdownData/?${moment.now()}`);
}

export async function setUserProfilePreference(d, type) {
  if (type === 'put') {
    const data = d;
    data.method_type = 'PUT';
    return post(`${apiUrl}/user/create_pref/`, data);
  }
  return post(`${apiUrl}/user/create_pref/`, d);
}

export async function getUserEmailPreferences() {
  return post(`${apiUrl}/user/user_email_pref/`, {});
}

export async function getUserProfilePreferences() {
  return post(`${apiUrl}/user/create_pref/`, {});
}

export async function removeUserProfilePreference(d) {
  const data = d;
  data.method_type = 'DEL';
  return post(`${apiUrl}/user/create_pref/`, data);
}

export async function getUserProfileConsumptionData() {
  return get(`${apiUrl}/user/get_user_consumption/`);
}

export async function downloadConsumptionReportFile(data = {}) {
  return downloadFile(`${apiUrl}/user/get_user_consumption/`, data, 'PUT');
}

export async function getUserProfileBookmarksData(data) {
  return post(`${apiUrl}/user/create_bookmarks/`, data || {});
}

export async function updateUserProfileBookmarksData(data) {
  const dataVal = data;
  dataVal.method_type = 'PUT';
  return post(`${apiUrl}/user/create_bookmarks/`, dataVal);
}

export async function deleteUserProfileBookmarksData(data) {
  const dataVal = data;
  dataVal.method_type = 'DEL';
  return post(`${apiUrl}/user/create_bookmarks/`, dataVal);
}

export async function setEmailProfilePreference(data) {
  return post(`${apiUrl}/user/user_email_pref/`, data);
}

