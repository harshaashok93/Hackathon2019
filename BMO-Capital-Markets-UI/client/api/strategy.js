import config from 'config';
import moment from 'moment';
import {
  post,
  get
} from './utils';

let { apiUrl } = config;

if (!apiUrl) apiUrl = '';

export async function getDropDownResults(data) {
  return post(`${apiUrl}/strategy/getReports/`, data);
}

export async function getMediaResults(url) {
  return get(`${apiUrl}${url}?${moment.now()}`);
}

export async function getVideoResults(url, videocastReqParameter) {
  const reqData = videocastReqParameter;
  if (!reqData.order) {
    reqData.order = 'desc';
  }
  return post(`${apiUrl}${url}`, reqData);
}

export async function getStrategyReportResult(data) {
  return post(`${apiUrl}/strategy/getReports/`, data);
}
