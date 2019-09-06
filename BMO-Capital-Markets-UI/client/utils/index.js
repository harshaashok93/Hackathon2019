/* eslint-disable */

import { getLocalToken } from 'api/auth';
import moment from 'moment';

export function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'), results = regex.exec(url); // eslint-disable-line
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export function childOf(c,p){while((c=c.parentNode)&&c!==p);return !!c}

export function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

const urlRegEx = new RegExp('([a-z\-0-9]{2,63})\.([a-z\.]{2,5})$');
const urlParts = urlRegEx.exec(window.location.hostname);
let subDomain = window.location.hostname;
if (urlParts) {
  subDomain = urlParts[0];
}

export function setCookie(name,value,days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; domain=" + subDomain + `; path=/; ${window.location.protocol === 'https:' ? 'Secure;' : ''}`;
}

export function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

export function eraseCookie(name) {
  document.cookie = name+'=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/' + '; domain=' + subDomain;
}

export function isElementInViewport (el) {
  if (!el) return false;
  var rect = el.getBoundingClientRect();
  if (!rect) return false;
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

export function oneOfTheElementsInViewport (cardContent) {
  if (!cardContent) return false;

  let resp = false;
  cardContent.forEach(function(item) {
    const rect = item.getBoundingClientRect();
    if (rect.top >= 0 && rect.top <= window.innerHeight) {
      resp = true
    }
  })

  return resp
}

export function numberWithCommas(n) {
  try {
    var parts = n.toString().split(".");
    return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
  } catch(e) {
    console.error(e); // eslint-disable-line
    return n;
  }
}

export function tierKeyMapping(tier) {
  const defaultMapper = {
    "tier1": { "key": "inFront", "value": "In Front", "text": "IN Front" },
    "tier2": { "key": "inDepth", "value": "In Depth", "text": "IN Depth" },
    "tier3": { "key": "inFact", "value": "In Fact", "text": "IN Fact" }
  };
  let tierMapper = window.unchainedSite &&  window.unchainedSite.AppSettings && window.unchainedSite.AppSettings.TIER_KEY_MAPPING;
  if (tierMapper) {
    tierMapper = JSON.parse(tierMapper);
    return [tierMapper[tier].key, tierMapper[tier].text];
  }
  return [defaultMapper[tier].key, defaultMapper[tier].text];
}

export function getTriangleImage(tierMap) {
  let triangleImage = '';
  if (!(tierMap.tier1 && tierMap.tier2 && tierMap.tier3)) {
    const tierData = Object.keys(tierMap).filter((item) => {
      if (tierMap[item]) {
        return item;
      }
      return '';
    });
    if (tierData.length && tierData.length === 1) {
      triangleImage = tierKeyMapping(tierData[0]);
    }
  }
  return triangleImage;
}

export async function downloadFile(url, data, method = 'POST') {
  if (!data || !url) return;
  let credentials;
  let headers = { 'Content-Type': 'application/json' };
  const shouldEscapeToken = url.match(/^http(s)?:\/\/(.)*\/(es-search|cms-api)\/*/gi);
  if (
      !shouldEscapeToken ||
      (url.indexOf('/api/v1/data_boutique/getBMORedFile/') > -1) ||
      (url.indexOf('/api/v1/data_boutique/getStockScreener/') > -1)
    ) {
    credentials = 'include';
    const token = getLocalToken();

    if (token) {
      headers.Authorization = `Token ${token}`;
    }
  }

  if (method === 'POST') {
    return fetch(url, {
      method,
      headers,
      credentials,
      body: JSON.stringify(data),
    });
  } else {
    return fetch(url, {
      method,
      headers,
      credentials,
    });
  }
}

export function downloadBlobFile (data) {
  if (!data) return;
  const { content, filename = 'file.txt', contentType = 'application/txt' } = data;
  if (!content) return;

  const blob = new Blob([content], { type: contentType });
  const IS_IE = window.navigator && window.navigator.msSaveOrOpenBlob;
  if (IS_IE) {
    // IE doesn't allow using a blob object directly as link href;
    // instead, it is necessary to use msSaveOrOpenBlob.
    window.navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    // For Firefox and Chrome: create a link pointing to the ObjectURL
    // containing the blob.
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = window.URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    // For some versions of Firefox it is necessary to delay revoking the
    // ObjectURL.
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blob);
    }, 100);
  }
}

/**
 * Get current browser viewpane height
 */
function _get_window_height() {
    return window.innerHeight ||
           document.documentElement.clientHeight ||
           document.body.clientHeight || 0;
}

/**
 * Get current absolute window scroll position
 */
function _get_window_Yscroll() {
    return window.pageYOffset ||
           document.body.scrollTop ||
           document.documentElement.scrollTop || 0;
}

/**
 * Get current absolute document height
 */
function _get_doc_height() {
    return Math.max(
        document.body.scrollHeight || 0,
        document.documentElement.scrollHeight || 0,
        document.body.offsetHeight || 0,
        document.documentElement.offsetHeight || 0,
        document.body.clientHeight || 0,
        document.documentElement.clientHeight || 0
    );
}


/**
 * Get current vertical scroll percentage
 */
export function getPageScrollPercentage() {
    return (
        (_get_window_Yscroll() + _get_window_height()) / _get_doc_height()
    ) * 100;
}

export function removeQueryParams() {
  if (window.history.replaceState) {
    var clean_uri = location.protocol + "//" + location.host + location.pathname;
    window.history.replaceState({}, document.title, clean_uri);
  }
}

export function updateQueryStringParameter(uri, key, value) {
  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  var separator = uri.indexOf('?') !== -1 ? "&" : "?";
  if (uri.match(re)) {
    return uri.replace(re, '$1' + key + "=" + value + '$2');
  }
  else {
    return uri + separator + key + "=" + value;
  }
}

function removeURLParam(url, param){
  var urlparts= url.split('?');
  if (urlparts.length>=2)
  {
  var prefix= encodeURIComponent(param)+'=';
  var pars= urlparts[1].split(/[&;]/g);
  for (var i=pars.length; i-- > 0;)
   if (pars[i].indexOf(prefix, 0)==0)
    pars.splice(i, 1);
  if (pars.length > 0)
   return urlparts[0]+'?'+pars.join('&');
  else
   return urlparts[0];
  }
  else
  return url;
}

export function libraryURLPush(urlQuery, removeParams) {
  if (!urlQuery) return null;
  if (window.history.pushState) {
    const urlQueryArr = urlQuery.split('&');
    let finalUrl = ''
    urlQueryArr.map(q => {
      let query = q.split("=");
      finalUrl = updateQueryStringParameter(finalUrl || window.location.href, query[0], query[1]);
    });
    if (removeParams) {
      const removeParamsArr = removeParams.split(',');
      removeParamsArr.map(p => {
        finalUrl = removeURLParam(finalUrl || window.location.href, p);
      });
    }
    window.history.pushState({ path: finalUrl }, document.title, finalUrl);
  }
}

export function replaceOddCharactersToEven(str, character='"'){
  if (typeof str !== "string") return;
  var charcterQuotesLength = 0;
  for (var i=0;i<str.length;i++) {
    if (str[i] === character) charcterQuotesLength++;
  }
  if (charcterQuotesLength%2){
    const lastCharacterPos = str.lastIndexOf(character);
    return str.slice(0, lastCharacterPos) + str.slice(lastCharacterPos+1);
  }
  return str;
}

export function renderPasswordsavePopup(formid){
  try {
    window.external.AutoCompleteSaveForm(document.getElementById(formid).cloneNode(true));
  } catch (ex) {
    console.log(ex);//eslint-disable-line
  }
}

export function getDateRangeBasedOnUserStatus(userStatus, dateRange, ignore = false) { // eslint-disable-line
  let fromDate = moment().format('YYYY-MM-DD');
  let toDate = moment().format('YYYY-MM-DD');

  // if ((userStatus === null || userStatus === undefined) && (dateRange ===  undefined || dateRange === null)) return { fromDate, toDate };

  // if (userStatus === 'Pending_with_access' && ignore === false) {
  //   if (dateRange >= 0) {
  //     fromDate = moment().subtract(((dateRange + 3) * 7), 'days').format('YYYY-MM-DD');
  //   }
  // } else
  if (dateRange >= 0) {
    fromDate = moment().subtract((dateRange * 7), 'days').format('YYYY-MM-DD');
  } else {
    fromDate = moment().subtract(180, 'days').format('YYYY-MM-DD');
  }

  // if (userStatus === 'Pending_with_access' && ignore === false) {
  //   toDate = moment().subtract(21, 'days').format('YYYY-MM-DD');
  // }
  return { fromDate, toDate };
}

export function toShowAnalyst(analyst) {
  const sitename = window.unchainedSite.sitename;
  const rolelist = sitename === 'Equity' ? window.unchainedSite && window.unchainedSite.Roles && window.unchainedSite.Roles.EQUITY : window.unchainedSite && window.unchainedSite.Roles && window.unchainedSite.Roles.CORP;

  // show economist douglas porter on site
  if (analyst.client_code === 'DXP') {
    return true;
  }

  // dont show BMO CM Research
  if (analyst.client_code === 'BMO') {
    return false;
  }

  // dont show any Economist even though he is an Analyst
  const economist = analyst.roles && analyst.roles.filter((item) => item.name === 'Economist');
  if (economist && economist.length) {
    return false;
  }

  // Show only the roles specified
  let found = false;
  if (analyst.roles) {
    found = analyst.roles.some(r=> rolelist.includes(r.name))
  }
  return found;
}

export function toShowAnalystOnPublication(analyst) {
  let found = toShowAnalyst(analyst)

  if (found === true) {
    return found
  }

  if (analyst.roles) {
    analyst.roles.map(role => {
      if (role['name'].toLowerCase() === 'debt analyst' || role['name'].toLowerCase() === 'analyst') {
        found = true;
        return;
      }
    });
  }

  return found;
}

export function formatAnalystName(firstName, middleName, lastName) {
  const analystName = `${firstName || ''} ${middleName && middleName !== '' ? middleName : ''} ${lastName || ''}`;
  return analystName;
}

export function getBrowserName() {
  let browser_name = '';
  //Opera 8.0+
  if ((!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0) {
    browser_name = Opera;
  }

  // Firefox 1.0+
  if (typeof InstallTrigger !== 'undefined') {
    browser_name = 'Firefox';
  }

  // Safari 3.0+
  if(/constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification))){
    browser_name = 'Safari';
  }

  // Internet Explorer 6-11
  if (/*@cc_on!@*/false || !!document.documentMode) {
    browser_name = 'IE';
  }

  // Edge 20+
  if ( browser_name ==!'IE'&& !!window.StyleMedia) {
    browser_name = 'Edge';
  }

  // Chrome 1 - 71
  if (!!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime)) {
    browser_name = 'Chrome';
  }
  return browser_name;

}

