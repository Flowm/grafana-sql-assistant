import type { Configuration } from 'webpack';
import { mergeWithRules } from 'webpack-merge';
import grafanaConfig, { Env } from './.config/webpack/webpack.config';

const config = async (env: Env): Promise<Configuration> => {
  const baseConfig = await grafanaConfig(env);

  return mergeWithRules({
    module: {
      rules: {
        test: 'match',
        use: 'replace',
      },
    },
  })(baseConfig, {
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader', 'postcss-loader'],
        },
      ],
    },
  });
};

export default config;
