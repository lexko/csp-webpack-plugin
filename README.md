# CSP Webpack Plugin

  This plugin takes result html from HtmlWebpackPlugin, generates content security
  policy and adds it to meta tag element.

## Features
* compute hashes for inline script element
* extract domains for external script element
* insert content security policy in meta tag

## Usage
Add this plugin in webpack config with custom content security policy

    new HtmlWebpackPlugin(),
    new CSPWebpackPlugin({
      'object-src': '\'none\'',
      'base-uri': '\'self\'',
      'script-src': ['\'unsafe-inline\'', '\'self\'', '\'unsafe-eval\'','http://ajax.googleapis.com'],
      'worker-src': ['\'self\'','blob:']
      })


Add  this placeholder `%%CSP_CONTENT%%` to your index template

    <meta http-equiv="Content-Security-Policy" content="%%CSP_CONTENT%%">
