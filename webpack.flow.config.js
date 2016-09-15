var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  devtool: 'source-map',
  entry: [
    './src/client/flow'
  ],
  output: {
    path: path.join(__dirname, 'build/flow'),
    filename: 'index.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  ],
  resolve: {      
      modules: [path.resolve('./src'), path.resolve('./node_modules')],
      // These extensions are tried when resolving a file.
      extensions: [
        '.js',
        '.jsx',
        '.json',
      ],
    },
  module: {
    loaders: [{
      loader: 'url-loader?limit=10000',
      test: /\.(gif|jpg|png|svg)$/
    }, {
      loader: 'url-loader?limit=1',
      test: /favicon\.ico$/
    }, {
      loader: 'url-loader?limit=100000',
      test: /\.(eot|ttf|woff|woff2)$/
    }, {
      test: /\.scss$/,
      loaders: [
              'style-loader',
              'css?sourceMap',
              'sass?sourceMap'
            ]
    }, {
      test: /\.jsx?$/,
      loader: 'babel-loader',
      exclude: [/node_modules/, path.resolve(__dirname, './build')],
      query:{
        env: {
          development: {
            plugins: ['react-hot-loader/babel', 
                      'transform-object-rest-spread',
                      'transform-es2015-destructuring'],
          },
        }, 
        // For our clients code we will need to transpile our JS into
        // ES5 code for wider browser/device compatability.
        presets: [
          // JSX
          'react',
          // Webpack 2 includes support for es2015 imports, therefore we used this
          // modified preset.
          'es2015-webpack',
          'stage-0',
        ]
      }      
    }]
  }
}
