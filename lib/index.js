
const cheerio = require('cheerio'),
      crypto = require('crypto'),
      url = require('url'),
      _ = require('lodash');

/**
 * Generate Content Security Policy from html and put it in meta tag instead of '%%CSP_CONTENT%%'.
 * Content Security Policy prevents any untrusted javascript element from execution in browser context.
 * Trusted js element defined by its hash or domain it originated from.
 * Reference: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy
 */
const CSPWebpackPlugin = function(options = {}) {
  this.policy = options
};

CSPWebpackPlugin.defaultPolicy = {
  'object-src': '\'none\'',
  'base-uri': '\'self\'',
  'script-src': ['\'unsafe-inline\'', '\'self\'', '\'unsafe-eval\''],
  'worker-src': ['\'self\'','blob:']
};


CSPWebpackPlugin.prototype.apply = function(compiler) {
  var self = this;

  compiler.hooks.compilation.tap('CSPWebpackPlugin', function(compilation) {
    compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapAsync('CSPWebpackPlugin', function(htmlPluginData, callback) {
      const $ = cheerio.load(htmlPluginData.html);
      function computeHash(element) {
        const hash = crypto
          .createHash('sha256')
          .update($(element).text())
          .digest('base64');
        return '\'sha256-' + hash + '\'';
      }

      function extractDomain(element) {
        return url.parse($(element).attr('src')).hostname;
      }

      function buildCsp(policy) {
        return _.flatMap(policy, (val, key) => {
          return key + ' ' + _.uniq(_.flattenDeep([val])).join(' ');
        }).join(';');
      }

      const hashes = _.flatMap($('script:not([src])'), computeHash);
      const staticDomains = _.flatMap($('script[src]'), extractDomain);

      self.policy['script-src'] = self.policy['script-src'].concat(hashes).concat(staticDomains)

      htmlPluginData.html = htmlPluginData.html.replace('%%CSP_CONTENT%%', buildCsp(self.policy));

      callback(null, htmlPluginData);
    });
  });
};

module.exports = CSPWebpackPlugin;
