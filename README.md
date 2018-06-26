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
  },
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

![image](https://user-images.githubusercontent.com/1018196/35707733-d6498000-075f-11e8-8840-98ca5d46e825.png)

**Disconnected**

![image](https://user-images.githubusercontent.com/1018196/35707761-e6213a4a-075f-11e8-9231-fe6c4dc0d12d.png)

**Detected change and compiling**

![image](https://user-images.githubusercontent.com/1018196/35707782-f8b8b1c4-075f-11e8-97dd-7f8b561b9d78.png)

**Compiled with warnings**

![image](https://user-images.githubusercontent.com/1018196/35707794-0698e5de-0760-11e8-850b-a466f3d20f4b.png)

**Compiled with errors**

![image](https://user-images.githubusercontent.com/1018196/35707809-14e12926-0760-11e8-9f67-af1eff6048ae.png)

## Customizing

See `index.js` for how they are used.

- `window.__webpackEventColors__` [Object] Override default colors.
- `window.__webpackEventStyles__` [Object] Override default CSS.
- `window.__webpackEventElem__` [DOMElement] DOM Element to apply the style on. Default: `body`.
- `{webpackEventColor}` Use this placeholder in your CSS rules.
- `[data-webpack-status]` Attribute to be used with CSS selectors. See colors objects for available values.

Please note that if you want to keep away custom configs from your production codebase, than you should add
these inside your own modules.

### Custom example

```js
// In webpack config
if (isDevServer) {
  webpackConfig.entry.app.push(`./src/webpackStatusBar`);
}

// ./src/webpackStatusBar
window.__webpackEventColors__ = { ... };
require(`webpack-dev-server-status-bar`);
```
