const req = require.context('.', true, /\.\/[^/]+\/[^/]+\/.+\.jsx$/);

req.keys().forEach((key) => {
  const componentName = key.replace(/^.+\/([^/]+)\/.+\.jsx/, '$1');
  module.exports[componentName] = req(key).default;
});
