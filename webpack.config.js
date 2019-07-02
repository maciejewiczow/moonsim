const path = require('path')
const webpack = require('webpack')
const dotenv = require('dotenv')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const HtmlWebPackPlugin = require('html-webpack-plugin')

module.exports = () => {
    const env = dotenv.config().parsed

    const envKeys = Object.keys(env).reduce((prev, next) => {
        prev[`process.env.${next}`] = JSON.stringify(env[next])
        return prev
    }, {})

    return {
        mode: 'development',
        entry: './src/index.tsx',
        devtool: 'inline-source-map',
        module: {
            rules: [
                {
                    test: /\.tsx|ts?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.html$/,
                    use: [{ loader: 'html-loader', options: { minimize: true } }]
                },
                {
                    test: /\.(jpg|png|gif|svg|tiff|woff|woff2|dae)$/,
                    use: 'file-loader'
                }
            ]
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js', '*'],
            plugins: [new TsconfigPathsPlugin()]
        },
        output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname, 'dist')
        },
        plugins: [
            new webpack.DefinePlugin(envKeys),
            new HtmlWebPackPlugin({
                template: './src/index.html',
                filename: './index.html'
            })
        ]
    }
}
