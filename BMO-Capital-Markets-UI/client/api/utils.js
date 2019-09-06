// Request utils,
// feel free to replace with your code
// (get, post are used in ApiServices)

import { getLocalToken } from 'api/auth';
import config from 'config';
import 'whatwg-fetch';

/**
 * 1. parse response
 * 2. add "ok" property to result
 * 3. add "status" property to result
 * 3. return request result
 * @param  {Object} res - response from server
 * @return {Object} response result with "ok" property
 */
async function parseJSON(res) {
  let json;

  try {
    json = await res.json();
  } catch (e) {
    return {
      data: {},
      ok: false,
      status: 0,
    };
  }

  // simplest validation ever, ahah :)
  if (!res.ok) {
    return {
      data: json,
      ok: false,
      status: res.status,
    };
  }

  // resultOK - is a function with side effects
  // It removes ok property from result object
  return {
    data: json,
    ok: true,
    status: res.status,
  };
}

function requestWrapper(method) {
  return async (url, data = null, params = {}) => {
    if (method === 'GET') {
      // is it a GET?
      // GET doesn't have data
      params = data; // eslint-disable-line
      data = null; // eslint-disable-line
    } else if (data === Object(data)) {
      data = JSON.stringify(data); // eslint-disable-line
    } else if (method === 'POST' && typeof data === 'string') {
      data = data // eslint-disable-line
    } else {
      throw new Error(`XHR invalid, check ${method} on ${url}`);
    }

    // default params for fetch = method + (Content-Type)
    const headers = {
      'Content-Type': 'application/json; charset=UTF-8',
      sitename: window.unchainedSite ? window.unchainedSite.sitename : '',
    };

    if (url.indexOf('/api/v1/library/getLibraryResults') > -1) {
      headers['Cache-Control'] = 'no-cache';
      headers.Pragma = 'no-cache';
      headers.Expires = -1;
    }

    const defaults = {
      method,
      headers
    };
    const shouldEscapeToken = url.match(/^http(s)?:\/\/(.)*\/(search|cms-api)\/*/gi);
    if (!shouldEscapeToken || (url.indexOf('/api/v1/user/search_user') > -1) || (url.indexOf('/api/v1/data_boutique/getBMORedFile/') > -1)) {
      let token = getLocalToken() || '';
      token = token.split('***')[0];

      if (token) {
        defaults.headers.Authorization = `Token ${token}`;
      }
    }

    if (data) {
      defaults.body = data;
    }

    const paramsObj = { ...defaults, headers: { ...params, ...defaults.headers } };

    if (!shouldEscapeToken) {
      paramsObj.credentials = 'include';
    }

    return fetch(url, paramsObj).then(parseJSON).catch(err => {
      console.error(err); // eslint-disable-line
    });
  };
}

export const get = requestWrapper('GET');
export const post = requestWrapper('POST');
export const put = requestWrapper('PUT');
export const patch = requestWrapper('PATCH');
export const del = requestWrapper('DELETE');

// USAGE:
// get('https://www.google.com', {
//     headers: {
//         'Content-Type': 'text/html'
//     }
// })

// FUNCTION WITH SIDE-EFFECTS
/**
 * `parseJSON()` adds property "ok"
 * that identicates that response is OK
 *
 * `resultOK`removes result.ok from result and returns "ok" property
 *  It widely used in `/actions/*`
 *  for choosing action to dispatch after request to API
 *
 * @param  {Object} result - response result that
 * @return {bool} - indicates was request successful or not
 */
export function resultOK(result) {
  if (result) {
    const ok = result.ok;

    delete result.ok; // eslint-disable-line

    return ok; // look at parseJSON
  }

  return false;
}

export async function uploadFile(input, requestParams = {}, url) {
  if (input && url) {
    const data = new FormData();
    data.append('event_logo', input.files[0] || '');
    Object.keys(requestParams).map(k => {
      data.append(k, requestParams[k]);
      return null;
    });
    const { apiUrl } = config;
    return fetch(`${apiUrl}${url}`, {
      method: 'POST',
      body: data,
    }).then(parseJSON).catch(err => {
      console.error(err); // eslint-disable-line
    });
  }
  return null;
}

export function _getHeaders() {
  const headers = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: 0
  };
  return headers;
}
