
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CSPWebpackPlugin = require('../lib/index.js')
const fs = require('fs')

describe("test webpack plugin", function(){

  it("should generate CSP from html template", function(callback){

    const options = {
      entry: './spec/entry.js',
      output: {
        path: '/tmp/dist',
        filename: 'bundle.js'
      },
      plugins: [
        new HtmlWebpackPlugin({template: "./spec/test.html"}),
        new CSPWebpackPlugin({
          'object-src': '\'none\'',
          'base-uri': '\'self\'',
          'script-src': ['\'unsafe-inline\'', '\'self\'', '\'unsafe-eval\'','http://ajax.googleapis.com'],
          'worker-src': ['\'self\'','blob:']
        })]
    };

    const sample = content="content=\"object-src 'none';base-uri 'self';script-src 'unsafe-inline' 'self' 'unsafe-eval' http://ajax.googleapis.com 'sha256-4axlHpxgDbFzJObpXPFZgZhULrEGgJiud3OwxN9unHg=' example.com ;worker-src 'self' blob:\""

    webpack(options, function webpackCallback(err, stats) {
      const csp = stats.compilation.assets['index.html'].source().match(/content="(.*?)"/)
      expect(csp[0]).toBe(sample)
      callback(err)
    })
  })
})
