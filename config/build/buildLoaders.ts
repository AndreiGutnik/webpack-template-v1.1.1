import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { ModuleOptions } from 'webpack';

import { buildBabelLoader } from './babel/buildBabelLoader';
import { BuildOptions } from './types/types';

export function buildLoaders(options: BuildOptions): ModuleOptions['rules'] {
  const isDev = options.mode === 'development';

  //fonts
  const fontsLoader = {
    test: /\.(woff|woff2|eot|ttf|otf)$/i,
    type: 'asset/resource',
    generator: {
      publicPath: 'fonts/',
      outputPath: 'fonts/',
    },
  };

  //SVG
  const svgLoader = {
    test: /\.svg$/i,
    issuer: /\.[jt]sx?$/,
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

  //assets images
  const assetLoader = {
    test: /\.(png|jpg|jpeg|gif)$/i,
    type: 'asset/resource',
    generator: {
      publicPath: 'images/',
      outputPath: 'images/',
    },
    parser: {
      dataUrlCondition: {
        maxSize: 8 * 1024, // Изображения < 8KB инлайнить в base64
      },
    },
    use: [
      {
        loader: 'image-webpack-loader',
        options: {
          mozjpeg: {
            progressive: true,
            quality: 75, // Сжатие JPEG
          },
          optipng: {
            enabled: true,
          },
          pngquant: {
            quality: [0.65, 0.9], // Сжатие PNG
            speed: 4,
          },
          gifsicle: {
            interlaced: false,
          },
          webp: {
            quality: 75, // Конвертация в WebP
          },
        },
      },
    ],
  };

  //CSS
  const cssLoader = {
    test: /\.css$/i,
    use: [isDev ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader'],
  };

  //babel-loader
  const babelLoader = buildBabelLoader(options);

  return [assetLoader, cssLoader, babelLoader, svgLoader, fontsLoader];
}
