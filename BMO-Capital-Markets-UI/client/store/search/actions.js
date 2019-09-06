import moment from 'moment';
import {
  resultOK,
} from 'api/utils';

import {
  getSearchTypeaheadResults,
  setRecentSearch,
  getMostOftenSearch,
} from 'api/search';

export const SET_AUTO_SUGGEST_RESULTS = 'SET_AUTO_SUGGEST_RESULTS';
export const RESET_AUTOSUGGEST_RESULTS = 'RESET_AUTOSUGGEST_RESULTS';
export const SET_SEARCH_TYPE = 'SET_SEARCH_TYPE';
export const RESET_SEARCH_TYPE = 'RESET_SEARCH_TYPE';
export const SET_MOST_OFTEN_SEARCH = 'SET_MOST_OFTEN_SEARCH';

const libraryDefaultContent = window.unchainedSite && window.unchainedSite.SearchDefaults && window.unchainedSite.SearchDefaults.Library && JSON.parse(window.unchainedSite.SearchDefaults.Library.content);

const DATE_FILTER_RANGE = libraryDefaultContent ? libraryDefaultContent.date_field : 20;
let fromDate = null;
let toDate = null;

if (DATE_FILTER_RANGE && DATE_FILTER_RANGE > 0 && typeof DATE_FILTER_RANGE === 'number') {
  fromDate = moment().subtract(DATE_FILTER_RANGE * 7, 'days').format();
  toDate = moment().format();
}

let prevSearchTerm = '';

export function GET_SEARCH_RESULTS(term) {
  return async (dispatch) => {
    const obj = {};
    prevSearchTerm = term;
    const result = await getSearchTypeaheadResults(term);
    if (prevSearchTerm !== term) return;
    if (resultOK(result)) {
      try {
        const { responses } = result.data;

        if (responses && responses.length) {
          obj.analysts = ((responses[1] && responses[1].hits && responses[1].hits.hits) || []);
          obj.sectors = ((responses[3] && responses[3].hits && responses[3].hits.hits) || []);
          obj.coverage = ((responses[2] && responses[2].hits && responses[2].hits.hits) || []);

          const publicationsArr = ((responses[0] && responses[0].hits && responses[0].hits.hits) || []);
          obj.publications = publicationsArr;

          if (fromDate && toDate && publicationsArr.length) {
            const arr = [];

            publicationsArr.map(pub => {
              const pubDate = pub._source.publisher_date;

              if (pubDate && moment(pubDate)) {
                arr.push(pub);
              }
            });

            if (arr.length) {
              obj.publications = arr;
            }
          }
        }
      } catch (e) {
        console.error(e) // eslint-disable-line
      }
      dispatch({ type: SET_AUTO_SUGGEST_RESULTS, data: Object.assign({}, obj) });
    } else {
      dispatch({ type: SET_AUTO_SUGGEST_RESULTS, data: {} });
    }
  };
}

export function SET_RECENT_SEARCH_DATA(data) {
  setRecentSearch(data);
}

export function GET_MOST_OFTEN_SEARCHES() {
  return async (dispatch) => {
    const result = await getMostOftenSearch();
    const { data } = result;
    if (!resultOK(result)) {
      dispatch({ type: SET_MOST_OFTEN_SEARCH, data: [] });
      return;
    }
    dispatch({ type: SET_MOST_OFTEN_SEARCH, data });
  };
}
