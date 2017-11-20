const path = require('path');
/**
 * Used to merge webpack configs
*/
const webpackMerge = require('webpack-merge');
/**
 * The settings that are common to prod and dev
*/
const commonConfig = require('./webpack.common.js');
/**
 * Webpack Plugins
 */
const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin');
const ModuleConcatenationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
/**
 * Webpack Constants
 */
const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
/**
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */

module.exports = () => {
	return webpackMerge(commonConfig(ENV), {

		devtool: 'cheap-module-source-map',

		/**
		 * @link https://webpack.github.io/docs/webpack-dev-server.html
		 */
		devServer: {
			contentBase: path.resolve(__dirname, 'dist'),
			compress: true,
			historyApiFallback: true,
			port: 8080,
			inline: true,
			open: true,
			stats: {
				colors: true,
				hash: false,
				version: false,
				timings: false,
				assets: false,
				chunks: false,
				modules: false,
				reasons: false,
				children: false,
				source: false,
				errors: true,
				errorDetails: true,
				warnings: false,
				publicPath: false,
			},
		},

		plugins: [
			new HotModuleReplacementPlugin()
		],
	});
};
