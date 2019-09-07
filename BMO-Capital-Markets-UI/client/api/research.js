import config from 'config';
import moment from 'moment';

import {
  get,
  post
} from './utils';

let { apiUrl } = config;

if (!apiUrl) apiUrl = '';

export async function researchLayoutAPI(pid, url) {
  if (url) {
    return get(`${apiUrl}${url}&${moment.now()}`);
  }
  return get(`${apiUrl}/publication/getPublicationData/${pid}/?${moment.now()}`);
}

export async function sendRatingStar(star, prodid) {
    const data = {
        pub_id: prodid,
        rating: star,
        uuid: '49573c87-fe34-46a1-b7a0-4dc3b1e850d5'
    }
    return post(`${apiUrl}/hackathon/ratePublication/`, data);
}
