import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { ModuleOptions } from 'webpack';

import { buildBabelLoader } from './babel/buildBabelLoader';
import { BuildOptions } from './types/types';

export function buildLoaders(options: BuildOptions): ModuleOptions['rules'] {
  const isDev = options.mode === 'development';
  const assetPublicPath = options.paths.publicpath ?? options.appBasePath;

  //fonts
  const fontsLoader = {
    test: /\.(woff|woff2|eot|ttf|otf)$/i,
    type: 'asset/resource',
    generator: {
      ...(assetPublicPath !== 'auto' && {
        publicPath: `${assetPublicPath}fonts/`,
      }),
      outputPath: 'fonts/',
    },
  };

  //SVG sprite
  const svgSpriteLoader = {
    test: /\.svg$/i,
    include: /.*_sprite\.svg/,
    use: [
      {
        loader: 'svg-sprite-loader',
        options: {
          publicPath: '',
          runtimeCompat: true,
        },
      },
    ],
  };

  //SVG
  const svgLoader = {
    test: /\.svg$/i,
    issuer: /\.[jt]sx?$/,
    exclude: /.*_sprite\.svg/,
    use: [
      {
        loader: '@svgr/webpack',
        options: {
          icon: true,
          svgoConfig: {
            plugins: [
              {
                name: 'convertColors',
                params: {
                  currentColor: true,
                },
              },
            ],
          },
        },
      },
    ],
  };

  const svgAssetLoader = {
    test: /\.svg$/i,
    issuer: /\.css$/i,
    type: 'asset/resource',
    generator: {
      ...(assetPublicPath !== 'auto' && {
        publicPath: `${assetPublicPath}images/`,
      }),
      outputPath: 'images/',
    },
  };

  //assets images
  const assetLoader = {
    test: /\.(png|jpe?g|gif|webp|avif|bmp)$/i,
    type: 'asset',
    generator: {
      ...(assetPublicPath !== 'auto' && {
        publicPath: `${assetPublicPath}images/`,
      }),
      outputPath: 'images/',
    },
    parser: {
      dataUrlCondition: {
        maxSize: 8 * 1024,
      },
    },
  };

  //CSS
  const cssLoader = {
    test: /\.css$/i,
    use: [isDev ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader'],
  };

  //SCSS
  const sassLoader = {
    loader: 'sass-loader',
    options: {
      sassOptions: {
        loadPaths: [options.paths.src],
      },
      additionalData: `@use "styles/mixins" as *;`,
    },
  };

  const scssModuleLoader = {
    test: /\.module\.scss$/i,
    use: [
      isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          modules: {
            namedExport: false,
            localIdentName: isDev ? '[name]__[local]__[hash:base64:5]' : '[hash:base64:8]',
          },
        },
      },
      sassLoader,
    ],
  };

  const scssLoader = {
    test: /\.scss$/i,
    exclude: /\.module\.scss$/i,
    use: [isDev ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', sassLoader],
  };

  //babel-loader
  const babelLoader = buildBabelLoader(options);

  return [
    assetLoader,
    cssLoader,
    scssModuleLoader,
    scssLoader,
    babelLoader,
    svgSpriteLoader,
    svgLoader,
    svgAssetLoader,
    fontsLoader,
  ];
}
