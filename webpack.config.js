process.traceDeprecation = true;
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const fs = require('fs');
const rootDir = __dirname;
const jsDir = path.join(rootDir, 'src');
let entry = {};
fs.readdirSync(jsDir).map(function (file) {
    if (file.match(/\.js[x]?$/)) {
        let name = file.substr(0, file.lastIndexOf('.'));
        name && (entry[name] = path.join(jsDir, file));
    }
});
module.exports = {
    entry: entry,
    output: {
        path: path.join(rootDir, 'dist'),
        filename: 'nuomi-ui.js'
    },
    module: {
        loaders: [{
              test: /\.(le|c)ss$/,
              use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                //resolve-url-loader may be chained before sass-loader if necessary
                use: ['css-loader', 'less-loader']
              })
          }, {
              test: /\.js$/,
              loader: 'babel-loader',
              exclude: /node_modules/,
              query: {
                presets: ['es2015', 'stage-0'],
                compact: false
            }
          }, {
              test: /\.jsx$/,
              loader: 'babel-loader',
              exclude: /node_modules/,
              query: {
                presets: ['react', 'es2015', 'stage-0'],
                compact: false
              }
        }]
    },
    externals: {
      'cheerio': 'window',
      'react/addons': 'react',
      'react/lib/ExecutionEnvironment': 'react',
      'react/lib/ReactContext': 'react',
    },
    resolve: {
      alias: {
        // 'react': 'react-lite/dist/react-lite.js'
      }
    },
    plugins: [
      new ExtractTextPlugin('nuomi-ui.css'),
      new webpack.HotModuleReplacementPlugin()
    ]
}