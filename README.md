# Webpack dev server status bar

when webpack status changes from idle -> compiling -> error / warning,
a thin bar at the top of the page that changes colors.

Its essentially a nice unobtrusive webpack status notification system


## Usage

Add `webpack-dev-server-status-bar` as an entry point if invoked via dev-server

Example:

```js
const path = require('path');
const webpack = require('webpack');
const isDevServer = process.argv.some(s => s.match(/webpack-dev-server$/));

const webpackConfig = {
  entry: {
    app: ["./src/index.js"],
  },
  output: {
    path: path.join(__dirname, `build`),
    filename: `[name].bundle.js`,
  },
  module: {
    rules: [
      // <loader rules here>
    ]
  }
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
  ]
};

if (isDevServer) {
  webpackConfig.entry.app.push(`webpack-dev-server-status-bar`);
}

module.exports = webpackConfig;
```

## Status Colors

**Connected and Idle**
<div style="border-top: 2px solid #39d183"/>

**Disconnected**
<div style="border-top: 2px solid #9bacbf"/>

**Detected change and compiling**
<div style="border-top: 2px solid #a081ea"/>

**Compiled with warnings**
<div style="border-top: 2px solid #dd731d"/>

**Compiled with errors**
<div style="border-top: 2px solid #e4567b"/>
