import type { Configuration } from 'webpack';

import type { BuildMode } from './types/types';

const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

export function buildOptimization(mode: BuildMode): Configuration['optimization'] {
  const isProd = mode === 'production';

  return {
    minimize: isProd,
    minimizer: isProd
      ? [
          new TerserPlugin({
            terserOptions: {
              format: {
                comments: false,
              },
              compress: {
                drop_console: true,
              },
            },
            extractComments: false,
          }),
          new CssMinimizerPlugin(),
        ]
      : undefined,
    runtimeChunk: isProd ? 'single' : false,
    splitChunks: {
      chunks: 'all',
      minSize: 30 * 1024,
      maxSize: 244 * 1024,
      maxInitialRequests: 5,
      maxAsyncRequests: 7,
      automaticNameDelimiter: '-',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: -10,
          enforce: true,
        },
        common: {
          test: /[\\/]src[\\/]/,
          minChunks: 2,
          name: 'common',
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  };
}
