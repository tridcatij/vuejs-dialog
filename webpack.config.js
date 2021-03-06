const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const WebpackNotifierPlugin = require('webpack-notifier');
const WebpackShellPlugin = require('webpack-shell-plugin');

const isProduction = process.env.NODE_ENV === 'production'

const extractSass = new ExtractTextPlugin({
    filename: "css/app.[name].css",
    disable: false
});


const COMMON = {
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: [{
                    loader: 'vue-loader',
                    options: {
                        loaders: {
                            'scss': 'vue-style-loader!css-loader!postcss-loader?sourceMap!sass-loader',
                            'sass': 'vue-style-loader!css-loader!postcss-loader?sourceMap!sass-loader?indentedSyntax',
                            'css': 'vue-style-loader!css-loader!postcss-loader?sourceMap'
                        },
                        // other vue-loader options go here
                        postcss: [require('postcss-cssnext')()]
                    }
                }]
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                use: extractSass.extract({
                    fallback: "style-loader",
                    use: [{
                        loader: "css-loader",
                        options: {minimize: isProduction}
                    }, {
                        loader: "postcss-loader",
                        options: {
                            plugins: () => [
                                require('autoprefixer')()
                            ]
                        }
                    }, {
                        loader: "sass-loader"
                    }]
                })
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            }
        ]
    },
    plugins: [
        new WebpackNotifierPlugin({alwaysNotify: true})
    ],
    watchOptions: {
        aggregateTimeout: 300,
        ignored: /node_modules/
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true
    },
    performance: {
        hints: false
    },
    devtool: '#eval-source-map'
}

const DIST = Object.assign({}, COMMON, {
    name: 'dist',
    entry: './src/plugin/js',
    output: {
        library: 'VuejsDialog',
        libraryTarget: 'umd',
        path: path.resolve(__dirname, './dist'),
        publicPath: '/dist/',
        filename: 'vuejs-dialog.min.js'
    }
})

if (isProduction) {
    DIST.devtool = '#source-map'
    // http://vue-loader.vuejs.org/en/workflow/production.html
    DIST.plugins = (DIST.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ])

}

module.exports = [DIST]
