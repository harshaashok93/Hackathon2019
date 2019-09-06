import config from 'config';
import { getCookie, setCookie, eraseCookie } from 'utils';
import moment from 'moment';
import {
  post,
  get
} from './utils';

let { apiUrl } = config;
const { ssoUrl } = config;


if (!apiUrl) apiUrl = '';

export function getLocalToken() {
  return getCookie('token');
}

export function setLocalToken(token, days = 365) {
  setCookie('token', token, parseInt(days, 0));
}

export function removeLocalToken() {
  eraseCookie('token');
}

export function getRebrandingBanner() {
  return JSON.parse(getCookie('rebrandingBanner'));
}

export function setRebrandingBanner() {
  setCookie('rebrandingBanner', true, 1);
}

export async function registerUserAPI(data) {
  return post(`${apiUrl}/user/register/`, data);
}

export async function setUserCredentialsAPI(data, token) {
  return post(`${apiUrl}/user/create/${token}/`, data);
}

export async function resetPasswordAPI(data, token1, token2) {
  if (data && token1 && token2) {
    return post(`${apiUrl}/user/reset_password/${token1}/${token2}/`, data);
  }
  return post(`${apiUrl}/user/change_password/`, data);
}

export async function verifyResetPwdTokenAPI(token1, token2) {
  return get(`${apiUrl}/user/reset_password/${token1}/${token2}/`);
}

export async function loginUserAPI(data) {
  return post(`${apiUrl}/user/login/`, data);
}

export async function forgotPasswordAPI(data) {
  return post(`${apiUrl}/user/forgot_password/`, data);
}

export async function userLogout() {
  return post(`${apiUrl}/user/logout/`, {});
}

export async function verifyloginAPI() {
  return post(`${apiUrl}/user/verify/`, {});
}

export async function verifyRegTokenAPI(token) {
  return get(`${apiUrl}/user/create/${token}/`);
}

export async function postContactUs(data) {
  return post(`${apiUrl}/contact_us/`, data);
}

export async function getUserEvents() {
  return get(`${apiUrl}/user_moderation/get_user_events/?${moment.now()}`);
}

export async function putUserCalendarFilter(data) {
  const dataVal = data;
  dataVal.method_type = 'PUT';
  return post(`${apiUrl}/user_moderation/get_user_events`, dataVal);
}

export async function postConferenceData(data) {
  return post(`${apiUrl}/user_moderation/get_user_events/`, data);
}

export async function getDisclosureInfo(id) {
  return post(`${apiUrl}/coverage/getDisclosureAndDisclaimer/`, { id });
}

export async function checkInternalRequest() {
  return get(`${ssoUrl}/saml/check_request/?${moment.now()}`);
}
