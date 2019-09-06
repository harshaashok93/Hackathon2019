import moment from 'moment';
import config from 'config';
import {
  get,
  post
} from './utils';

let { apiUrl, mockApiUrl } = config;

if (!apiUrl) apiUrl = '';
if (!mockApiUrl) mockApiUrl = '';

export async function getUserInfo(data) {
  return post(`${apiUrl}/our_department/getAllUsers/`, data);
}

export async function updateStatus(data) {
  return post(`${apiUrl}/user/update_user_status/`, data);
}

export async function searchResult(data) {
  return post(`${apiUrl}/user/mock_search/`, data);
}

export async function getCalendarRequests() {
  return get(`${apiUrl}/user_moderation/eventRequests/`);
}

export async function sortCalendarEventsApi(data) {
  return post(`${apiUrl}/user_moderation/eventRequests/`, data);
}

export async function getDefaultSearchResult() {
  return get(`${apiUrl}/user_moderation/searchDefaults/?${moment.now()}`);
}

export async function setDefaultSearchResult(data) {
  return post(`${apiUrl}/user_moderation/searchDefaults/`, data);
}

export async function getCalendarEvents(date) {
  const dateVal = date;
  dateVal.method_type = 'PUT';
  return post(`${apiUrl}/user_moderation/get_staging_events/`, dateVal);
}

export async function getPublishedCalendarEvents() {
  return get(`${apiUrl}/user_moderation/get_published_events/?${moment.now()}`);
}

export async function postPublishEvent(data) {
  return post(`${apiUrl}/user_moderation/get_staging_events/`, data);
}

export async function getClientLookUpData(data) {
  return post(`${apiUrl}/user/client_lookup/`, data);
}

export async function putSFFilterCall(data) {
  const dataVal = data;
  dataVal.method_type = 'PUT';
  return post(`${apiUrl}/user_moderation/get_staging_events/`, dataVal);
}
export async function putCMSFilterCall(data) {
  const dataVal = data;
  dataVal.method_type = 'PUT';
  return post(`${apiUrl}/user_moderation/get_published_events/`, dataVal);
}

export async function getUserSFData(rdsId, sfId) {
  return post(`${apiUrl}/user/client_lookup/`, { RdsID: rdsId, SFID: sfId });
}

export async function linkCmsToSalesforce(data) {
  return post(`${apiUrl}/user/update_user_rds_id/`, data);
}

export async function updateUserData(data) {
  return post(`${apiUrl}/user/update_user_data/`, data);
}

export async function getUserCount(data) {
  return post(`${apiUrl}/user/getUserCount/?${moment.now()}`, data);
}

export async function updateUserInfoData(data) {
  return post(`${apiUrl}/user/update_user_info_data/`, data);
}

export async function unlinkingExistingUser(rdsId) {
  return post(`${apiUrl}/user/unlink_rds_id/`, { rdsId });
}

export async function sendBmoContactEmail(uuid) {
  return post(`${apiUrl}/user_moderation/send_bmo_contact_email/`, { uuid });
}
