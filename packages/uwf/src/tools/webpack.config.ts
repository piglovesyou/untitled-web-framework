/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import WebpackAssetsManifest from 'webpack-assets-manifest';
import nodeExternals from 'webpack-node-externals';
import cssnano from 'cssnano';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { WebpackOptions } from 'webpack/declarations/WebpackOptions';
import MultiAliasPlugin from '@piglovesyou/enhanced-resolve/lib/AliasPlugin';
import { genDir, libDir, userDir, srcDir, buildDir } from './lib/dirs';
import overrideRules from './lib/overrideRules';
import pkg from '../../package.json';
import postcssConfig from './postcss.config';

const isDebug = !process.argv.includes('--release');
const isVerbose = process.argv.includes('--verbose');
const isAnalyze =
  process.argv.includes('--analyze') || process.argv.includes('--analyse');
const isBuilding = process.argv.includes('build');

const reScript = /\.(ts|tsx|js|jsx|mjs)$/;
const reGraphql = /\.(graphql|gql)$/;
const reStyle = /\.(css|less|styl|scss|sass|sss)$/;
const reImage = /\.(bmp|gif|jpg|jpeg|png|svg)$/;

const staticAssetName = isDebug
  ? '[path][name].[ext]?[hash:8]'
  : '[hash:8].[ext]';

//
// Common configuration chunk to be used for both
// client-side (client.js) and server-side (server.js) bundles
// -----------------------------------------------------------------------------

const config: WebpackOptions = {
  context: libDir,

  mode: isDebug ? 'development' : 'production',

  output: {
    path: path.join(buildDir, 'public/assets'),
    publicPath: '/assets/',
    pathinfo: isVerbose,
    filename: isDebug ? '[name].js' : '[name].[chunkhash:8].js',
    chunkFilename: isDebug
      ? '[name].chunk.js'
      : '[name].[chunkhash:8].chunk.js',
    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: (info: any) =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },

  module: {
    // Make missing exports an error instead of warning
    strictExportPresence: true,

    rules: [
      // Rules for JS / JSX
      {
        test: reScript,
        include: [srcDir, path.join(libDir, 'tools'), genDir, userDir],
        loader: 'babel-loader',
        options: {
          // @piglovesyou: Necessary to track node_modules
          cwd: libDir,

          // https://github.com/babel/babel-loader#options
          cacheDirectory: isDebug,

          // https://babeljs.io/docs/usage/options/
          babelrc: false,
          configFile: false,
          presets: [
            // A Babel preset that can automatically determine the Babel plugins and polyfills
            // https://github.com/babel/babel-preset-env
            [
              '@babel/preset-env',
              {
                targets: {
                  browsers: pkg.browserslist,
                },
                forceAllTransforms: !isDebug, // for UglifyJS
                modules: false,
                useBuiltIns: false,
                debug: false,
              },
            ],
            // JSX
            // https://github.com/babel/babel/tree/master/packages/babel-preset-react
            ['@babel/preset-react', { development: isDebug }],

            // TypeScript
            '@babel/preset-typescript',
          ],
          plugins: [
            // Experimental ECMAScript proposals
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-syntax-dynamic-import',
            // Treat React JSX elements as value types and hoist them to the highest scope
            // https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-constant-elements
            ...(isDebug ? [] : ['@babel/transform-react-constant-elements']),
            // Replaces the React.createElement function with one that is more optimized for production
            // https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-inline-elements
            ...(isDebug ? [] : ['@babel/transform-react-inline-elements']),
          ],
        },
      },

      // Rules for GraphQL
      {
        test: reGraphql,
        exclude: /node_modules/,
        loader: 'raw-loader',
        // loader: 'graphql-tag/loader',
      },

      // Rules for Style Sheets
      {
        test: reStyle,
        rules: [
          // Convert CSS into JS module
          {
            issuer: { not: [reStyle] },
            use: '@piglovesyou/isomorphic-style-loader',
          },

          // Process external/third-party styles
          {
            exclude: [
              srcDir,
              path.join(userDir, 'routes'),
              path.join(userDir, 'components'),
            ],
            loader: 'css-loader',
            options: {
              sourceMap: isDebug,
            },
          },
          {
            exclude: [
              srcDir,
              path.join(userDir, 'routes'),
              path.join(userDir, 'components'),
            ],
            loader: 'postcss-loader',
            options: {
              plugins: [
                // CSS Nano options http://cssnano.co/
                cssnano(),
                // TODO: cssnano doesn't support comment discarding. Do it in somewhere else.
              ],
            },
          },

          // Process internal/project styles (from src folder)
          {
            include: [
              srcDir,
              path.join(userDir, 'routes'),
              path.join(userDir, 'components'),
            ],
            loader: 'css-loader',
            options: {
              // CSS Loader https://github.com/webpack/css-loader
              importLoaders: 1,
              sourceMap: isDebug,
              // CSS Modules https://github.com/css-modules/css-modules
              modules: true,
              localIdentName: isDebug
                ? '[name]-[local]-[hash:base64:5]'
                : '[hash:base64:5]',
            },
          },

          // Apply PostCSS plugins including autoprefixer
          {
            loader: 'postcss-loader',
            options: postcssConfig,
          },

          // Compile Less to CSS
          // https://github.com/webpack-contrib/less-loader
          // Install dependencies before uncommenting: yarn add --dev less-loader less
          // {
          //   test: /\.less$/,
          //   loader: 'less-loader',
          // },

          // Compile Sass to CSS
          // https://github.com/webpack-contrib/sass-loader
          // Install dependencies before uncommenting: yarn add --dev sass-loader node-sass
          // {
          //   test: /\.(scss|sass)$/,
          //   loader: 'sass-loader',
          // },
        ],
      },

      // Rules for images
      {
        test: reImage,
        oneOf: [
          // Inline lightweight images into CSS
          {
            issuer: reStyle,
            oneOf: [
              // Inline lightweight SVGs as UTF-8 encoded DataUrl string
              {
                test: /\.svg$/,
                loader: 'svg-url-loader',
                options: {
                  name: staticAssetName,
                  limit: 4096, // 4kb
                },
              },

              // Inline lightweight images as Base64 encoded DataUrl string
              {
                loader: 'url-loader',
                options: {
                  name: staticAssetName,
                  limit: 4096, // 4kb
                },
              },
            ],
          },

          // Or return public URL to image resource
          {
            loader: 'file-loader',
            options: {
              name: staticAssetName,
            },
          },
        ],
      },

      // Convert plain text into JS module
      {
        test: /\.txt$/,
        loader: 'raw-loader',
      },

      // Convert Markdown into HTML
      {
        test: /\.md$/,
        loader: path.resolve(srcDir, 'tools/lib/markdown-loader'),
      },

      // Return public URL for all assets unless explicitly excluded
      // DO NOT FORGET to update `exclude` list when you adding a new loader
      {
        exclude: [
          reScript,
          reStyle,
          reImage,
          reGraphql,
          /\.json$/,
          /\.txt$/,
          /\.md$/,
        ],
        loader: 'file-loader',
        options: {
          name: staticAssetName,
        },
      },

      // Exclude dev modules from production build
      ...(isDebug
        ? []
        : [
            {
              test: path.join(
                libDir,
                'node_modules/react-deep-force-update/lib/index.js',
              ),
              loader: 'null-loader',
            },
          ]),
    ],
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    mainFields: ['main', 'module'],
    modules: [
      path.join(libDir, 'node_modules'),
      // TODO: should be erased
      path.join(userDir, 'node_modules'),
      'node_modules',
    ],
    plugins: [
      new MultiAliasPlugin(
        'described-resolve',
        [
          // { name: 'uwf', alias: path.join(srcDir, 'app') },
          { name: 'uwf/dataBinders', alias: path.join(genDir, 'dataBinders') },
          { name: 'uwf', alias: path.join(srcDir, 'app') },
          { name: '@configure@', alias: path.join(userDir, 'configure') },
          { name: '@configure@', alias: path.join(srcDir, 'configure') },
        ],
        'resolve',
      ),
    ],
  },

  resolveLoader: {
    extensions: ['.ts', '.mjs', '.js', '.json'],
  },

  // Don't attempt to continue if there are any errors.
  bail: !isDebug,

  cache: isDebug,

  // Specify what bundle information gets displayed
  // https://webpack.js.org/configuration/stats/
  stats: {
    cached: isVerbose,
    cachedAssets: isVerbose,
    chunks: isVerbose,
    chunkModules: isVerbose,
    colors: true,
    hash: isVerbose,
    modules: isVerbose,
    reasons: isDebug,
    timings: true,
    version: isVerbose,
    errorDetails: true,
  },

  // Choose a developer tool to enhance debugging
  // https://webpack.js.org/configuration/devtool/#devtool
  devtool: isDebug ? 'cheap-module-inline-source-map' : 'source-map',
};

//
// Configuration for the client-side bundle (client.js)
// -----------------------------------------------------------------------------

const clientConfig: WebpackOptions = {
  ...config,

  name: 'client',
  target: 'web',

  entry: {
    client: [
      'core-js/stable',
      'regenerator-runtime/runtime',
      path.join(srcDir, 'app/client'),
    ],
  },

  plugins: [
    // Define free variables
    // https://webpack.js.org/plugins/define-plugin/
    new webpack.DefinePlugin({
      'process.env.BROWSER': true,
      __DEV__: isDebug,
    }),

    // Emit a file with assets paths
    // https://github.com/webdeveric/webpack-assets-manifest#options
    new WebpackAssetsManifest({
      output: `${buildDir}/asset-manifest.json`,
      publicPath: true,
      writeToDisk: true,
      customize: ({ key, value }: { key: string; value: string }) => {
        // You can prevent adding items to the manifest by returning false.
        if (key.toLowerCase().endsWith('.map')) return false;
        return { key, value };
      },
      done: (manifest: any, stats: any) => {
        // Write chunk-manifest.json.json
        const chunkFileName = `${buildDir}/chunk-manifest.json`;
        try {
          const fileFilter = (file: string) => !file.endsWith('.map');
          const addPath = (file: string) => manifest.getPublicPath(file);
          const chunkFiles = stats.compilation.chunkGroups.reduce(
            (acc: any[], c: any) => {
              acc[c.name] = [
                ...(acc[c.name] || []),
                ...c.chunks.reduce(
                  (files: any[], cc: any) => [
                    ...files,
                    ...cc.files.filter(fileFilter).map(addPath),
                  ],
                  [],
                ),
              ];
              return acc;
            },
            Object.create(null),
          );
          fs.writeFileSync(chunkFileName, JSON.stringify(chunkFiles, null, 2));
        } catch (err) {
          console.error(`ERROR: Cannot write ${chunkFileName}: `, err);
          if (!isDebug) process.exit(1);
        }
      },
    }),

    ...(isDebug
      ? []
      : [
          // Webpack Bundle Analyzer
          // https://github.com/th0r/webpack-bundle-analyzer
          ...(isAnalyze ? [new BundleAnalyzerPlugin()] : []),
        ]),
  ],

  // Move modules that occur in multiple entry chunks to a new entry chunk (the commons chunk).
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: 'initial',
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
        },
      },
    },
  },

  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  // https://webpack.js.org/configuration/node/
  // https://github.com/webpack/node-libs-browser/tree/master/mock
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
};

//
// Configuration for the server-side bundle (server.js)
// -----------------------------------------------------------------------------

const serverConfig: WebpackOptions = {
  ...config,

  name: 'server',
  target: 'node',

  entry: {
    server: [path.join(srcDir, 'app/server')],
  },

  output: {
    ...config.output,
    path: buildDir,
    filename: '[name].js',
    chunkFilename: 'chunks/[name].js',
    libraryTarget: 'commonjs2',
  },

  // Webpack mutates resolve object, so clone it to avoid issues
  // https://github.com/webpack/webpack/issues/4817
  resolve: {
    ...config.resolve,
  },

  module: {
    ...config.module,

    rules: overrideRules(config.module!.rules, (rule: any) => {
      // Override babel-preset-env configuration for Node.js
      if (rule.loader === 'babel-loader') {
        return {
          ...rule,
          options: {
            ...rule.options,
            presets: rule.options.presets.map((preset: any) =>
              preset[0] !== '@babel/preset-env'
                ? preset
                : [
                    '@babel/preset-env',
                    {
                      targets: {
                        // @ts-ignore
                        node: pkg.engines.node.match(/(\d+\.?)+/)[0],
                      },
                      modules: false,
                      useBuiltIns: false,
                      debug: false,
                    },
                  ],
            ),
          },
        };
      }

      // Override paths to static assets
      if (
        rule.loader === 'file-loader' ||
        rule.loader === 'url-loader' ||
        rule.loader === 'svg-url-loader'
      ) {
        return {
          ...rule,
          options: {
            ...rule.options,
            emitFile: false,
          },
        };
      }

      return rule;
    }),
  },

  externals: [
    './chunk-manifest.json',
    './asset-manifest.json',
    nodeExternals({
      whitelist: [reStyle, reImage, /^uwf\/?/],
      modulesDir: path.join(libDir, '../../node_modules'),
    }),
  ],

  plugins: [
    // Define free variables
    // https://webpack.js.org/plugins/define-plugin/
    new webpack.DefinePlugin({
      'process.env.BROWSER': false,
      __DEV__: isDebug,
      __userDir__: isBuilding ? '__dirname' : `"${userDir}"`,
    }),

    // Adds a banner to the top of each generated chunk
    // https://webpack.js.org/plugins/banner-plugin/
    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install();',
      raw: true,
      entryOnly: false,
    }),
  ],

  // Do not replace node globals with polyfills
  // https://webpack.js.org/configuration/node/
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  },
};

export default [clientConfig, serverConfig];
