const webpack = require('webpack');
const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');

const ENV = process.env.ENV = process.env.NODE_ENV = 'development';

module.exports = (ENV) => {
	return {

		entry: {
			main: [
				'./src/scripts/index.js',
			],
			vendor: [
				'react',
				'react-google-maps',
			],
		},

		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: 'js/[name].bundle.js',
			sourceMapFilename: '[file].map',
			chunkFilename: '[name].[chunkhash].chunk.js',
			publicPath: '/',
		},

		performance: {
			hints: false,
		},

		stats: {
			children: false,
		},

		resolve: {
			modules: [
				path.resolve(__dirname, 'src'),
				'node_modules',
			],
			extensions: ['*', '.js', '.jsx', '.css', '.sass', '.scss', '.html'],
		},

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

		module: {
			rules: [
				{
					test: /\.(js|jsx)?$/,
					loader: 'babel-loader',
					exclude: /node_modules/,
				},
				{
					test: /\.(sass|scss|css)$/,
					use: ExtractTextPlugin.extract({
						use: ['css-loader', 'postcss-loader', 'sass-loader'],
						fallback: 'style-loader',
					}),
				},
				{
					test: /\.html$/,
					use: 'html-loader',
				},
				{
					test: /\.(jpe?g|png|gif|svg)$/,
					exclude: /node_modules/,
					use: 'file-loader?name=[path][name].[ext]?[hash]',
				},
				{
					test: /\.(ico|eot|otf|webp|ttf|woff|woff2)$/i,
					exclude: /node_modules/,
					use: 'file-loader?limit=100000&name=assets/[name].[hash:8].[ext]',
				},
			],
		},

		plugins: [

			new ExtractTextPlugin({
				filename: 'css/style.[hash].css',
			}),

			new HtmlWebpackPlugin({
				title: 'My React App!!!!',
				template: './src/index.html.ejs',
				inject: 'body',
				minify: {
					removeComments: true,
					collapseWhitespace: true,
					removeRedundantAttributes: true,
					useShortDoctype: true,
					removeEmptyAttributes: true,
					removeStyleLinkTypeAttributes: true,
					keepClosingSlash: true,
					minifyJS: true,
					minifyCSS: true,
					minifyURLs: true,
				},
			}),

			/**
		 	 * @link https://webpack.js.org/plugins/commons-chunk-plugin/
		 	*/
			new CommonsChunkPlugin({
				name: 'vendor',
				filename: 'js/vendor.js',
				minChunks: Infinity,
				children: true,
			}),

			new webpack.HotModuleReplacementPlugin(),

			/**
			 * @link https://webpack.github.io/docs/list-of-plugins.html#defineplugin
			 */
			new DefinePlugin({
				ENV: JSON.stringify(ENV),
				'process.env': {
					ENV: JSON.stringify(ENV),
				},
			}),
		],
	};
};
