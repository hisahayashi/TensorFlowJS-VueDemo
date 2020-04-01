const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
// const { VueLoaderPlugin } = require('vue-loader')
const VueLoaderPlugin = require('vue-loader/lib/plugin');

let scriptConfig = {
  entry: ['babel-polyfill', './src/main.js'],
  mode: 'development',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        include: [
          path.resolve(__dirname, 'src')
        ],
        exclude: /node_modules/,
        options: {
          loaders: {
            esModule: true,
            // js: {
            //    loader: 'babel-loader',
            //    options: {
            //      presets: ['es2015']
            //    }
            // },
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            // scss: 'vue-style-loader!css-loader!sass-loader',
            // sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
            css: ExtractTextPlugin.extract({
              use: 'css-loader',
              fallback: 'vue-style-loader'
            })
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        include: [
          path.resolve(__dirname, 'src')
        ],
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      'vuex': 'vuex/dist/vuex.js',
    }
  },
  devServer: {
    open: true,
    openPage: '',
    contentBase: path.join(__dirname, './'),
    watchContentBase: true,
    historyApiFallback: true,
    host: 'localhost',
    disableHostCheck: true,
    port: 3000,
    noInfo: true
  },
  performance: {
    hints: false
  },
  devtool: '#inline-source-map',
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new webpack.ProvidePlugin({
      Promise: 'es6-promise',
    }),
    new ExtractTextPlugin('style.css')
  ],
  optimization: {
    minimize: false
  }
}

let styleConfig = {
  entry: {
    main: './src/sass/main.scss'
  },
  mode: 'development',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'main.css'
  },
  module: {
    rules: [
      {
        test: /\.(css|sass|scss)$/,
        include: [
          path.resolve(__dirname, 'src/sass')
        ],
        use: ExtractTextPlugin.extract(
          {
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                // options: {sourceMap: true}
              },
              {
                loader: 'postcss-loader',
                options: {
                  plugins: () => [require('autoprefixer')({
                    // 'browsers': ['> 1%', 'last 2 versions']
                  })],
                }
              },
              {
                loader: 'sass-loader',
                // options: {sourceMap: true}
              },
            ]
          }
        )
      },
      {
        test: /\.(eot|otf|ttf|woff2?|svg)$/,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'node_modules')
        ],
        use: {
          loader: 'file-loader',
          options: {
            name: './fonts/[name].[ext]'
          }
        }
      },
    ]
  },
  devtool: '#inline-source-map',
  plugins: [
    new ExtractTextPlugin('[name].css'),
  ]
}

console.log(process.env.NODE_ENV)

if (process.env.NODE_ENV === 'production') {
  const loaderOption = new webpack.LoaderOptionsPlugin({
    minimize: true
  })

  scriptConfig.devtool = false
  // http://vue-loader.vuejs.org/en/workflow/production.html
  scriptConfig.optimization.minimize = true
  scriptConfig.optimization.minimizer = [
    new UglifyJSPlugin({
      uglifyOptions: {
        compress: {
          // warnings: false,
          pure_funcs: ['console.debug', 'console.log', 'console.info', 'console.warn']
        },
        output: {
          comments: false
        }
      }
    })
  ]
  scriptConfig.plugins.push(loaderOption)
}

module.exports = [scriptConfig, styleConfig]
