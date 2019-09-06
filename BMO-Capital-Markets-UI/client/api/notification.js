import config from 'config';
import moment from 'moment';
import {
  get,
  post
} from './utils';

let { apiUrl } = config;
if (!apiUrl) apiUrl = '';

export async function getNotifications() {
  return get(`${apiUrl}/notification/getNotifications/?${moment.now()}`);
}

export async function updateNotifications(notificationLatestDate) {
  return post(`${apiUrl}/notification/updateNotification/`, notificationLatestDate);
}
