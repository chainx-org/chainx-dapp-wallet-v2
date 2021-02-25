
// Copyright 2017-2020 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base.config');
const ENV = 'development';
const context = __dirname;
const hasPublic = fs.existsSync(path.join(context, 'public'));



module.exports = merge(
  baseConfig(ENV, context),
  {
    devtool: process.env.BUILD_ANALYZE ? 'source-map' : false,
    plugins: [
      new HtmlWebpackPlugin({
        PAGE_TITLE: 'ChainX Dapp Wallet',
        meta: {'viewport': 'width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover'},
        inject: true,
        template: path.join(context, `${hasPublic ? 'public/' : ''}index.html`)
      }),

    ]
  }
);
