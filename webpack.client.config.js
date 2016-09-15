const webpackConfigFactory = require('./webpackConfigFactory');

module.exports = function clientConfigFactory(options = {}, args = {}) {
  const { mode = 'development' } = options;
  const test = webpackConfigFactory({ target: 'client', mode }, args);
  return webpackConfigFactory({ target: 'client', mode }, args);
};
