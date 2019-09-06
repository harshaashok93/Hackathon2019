const req = require.context('.', true, /\.\/.+\.js$/);

const obj = {};

req.keys().forEach((key) => {
  const config = req(key);

  Object.keys(config).forEach((name) => {
    const file = key.replace(/\.\/.+\/(.+)\.js/, '$1');
    obj[file] = config[name];
  });
});

export function pushToDataLayer(source, key, options = {}) {
  const src = obj[source];
  if (!src || !src[key]) return;

  const srcObj = src[key];

  let trackObj = null;
  if (srcObj.type === 'event') {
    const proxyObj = {
      category: srcObj.category,
      action: srcObj.action,
      label: srcObj.label || '',
      ...options
    };
    trackObj = {
      event: 'ga_event',
      c: proxyObj.category,
      a: proxyObj.action,
      l: proxyObj.label
    };
    if (proxyObj.data) {
      trackObj.data = proxyObj.data;
    }
  } else if (srcObj.type === 'page') {
    const proxyObj = {
      name: srcObj.name,
      ...options
    };
    trackObj = {
      event: 'ga_page',
      name: proxyObj.name,
    };
  }

  if (trackObj) {
    console.log('Analytics event data : ',trackObj) // eslint-disable-line
    window.dataLayer.push(trackObj);
  }
}

export function pushToPageDataLayer(newData) {
  const pageData = dataLayer[0];
  dataLayer[0] = {
    ...newData,
    user: {
      ...pageData.user,
      ...newData.user,
    },
    page: {
      ...pageData.page,
      ...newData.page,
    },
  };
  console.log('Analytics page data :', dataLayer[0]); // eslint-disable-line
}
