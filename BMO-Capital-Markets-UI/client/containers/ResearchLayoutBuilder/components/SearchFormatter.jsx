import React from 'react';

const SearchFormatter = (str, obj = {}) => {
  const targetStr = window.targetStr;
  if (targetStr && str && typeof str === 'string') {
    const escapedTgtStr = targetStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`${escapedTgtStr}(?=[^<>]*(<|$))`, 'gi');
    const retStr = str.replace(regex, "<span class='bmo-highlighted-search'>$&</span>");
    if (obj.richText === false) {
      return retStr;
    }
    return <span dangerouslySetInnerHTML={{ __html: retStr }} />; //eslint-disable-line
  }
  return str;
};

export default SearchFormatter;
