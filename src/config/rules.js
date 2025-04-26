const jsRules = require('./rules/js-rules');
const cssRules = require('./rules/css-rules');
const htmlRules = require('./rules/html-rules');

/**
 * Chromium 兼容性扫描规则
 */
module.exports = {
  js: jsRules,
  css: cssRules,
  html: htmlRules
}; 