const webpack = require("webpack");
const autoprefixer = require("autoprefixer");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const ForkTSCheckerPlugin = require("fork-ts-checker-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const TSImportPlugin = require("ts-import-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin
const path = require("path");

function resolve(relativePath) {
  return path.resolve(__dirname, `./${relativePath}`);
}

const config = {
    mode: "production",
    entry: resolve("src/index.ts"),
    output: {
        path: resolve("lib"),
        filename: "index.js",
        library: "widget",
        libraryTarget: 'umd',   
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".less", "otf", ".jsx"],
        modules: ["node_modules"],
    },
    bail: true,
    optimization: {
        namedModules: true,
        runtimeChunk: "single",
        splitChunks: {
            automaticNameDelimiter: "-",
            maxAsyncRequests: 10,
        },
        minimizer: [
            new TerserPlugin({
                cache: true,
                parallel: true,
                sourceMap: true,
            }),
            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: {
                    map: {
                        inline: false,
                    },
                },
            }),
        ],
    },
    externals:{
        'react': 'React',
        'react-dom': 'ReactDOM',
        'antd': 'antd',
        'Moment': 'moment'
    },
    performance: {
        maxEntrypointSize: 1000000,
        maxAssetSize: 1000000,
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                include: path.resolve('src'),
                loader: "ts-loader",
                exclude: /node_modules/,
                options: {
                    configFile: resolve("./tsconfig.json"),
                    transpileOnly: true,
                    getCustomTransformers: () => ({
                        before: [TSImportPlugin({libraryName: "antd", libraryDirectory: "es", style: true})],
                    }),
                },
            },
            {
                test: /\.(css|less)$/,
                use: [
                    MiniCSSExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                            importLoaders: 2,
                        },
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            sourceMap: true,
                            plugins: () => [autoprefixer],
                        },
                    },
                    {
                        loader: "less-loader",
                        options: {
                            javascriptEnabled: true,
                            sourceMap: true,
                            modifyVars: {
                                "primary-color": "#A0006B",
                                "link-color": "#116EBE",
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(png|jpe?g|gif)$/,
                loader: "url-loader",
                query: {
                    limit: 1024,
                    name: "static/img/[name].[hash:8].[ext]",
                },
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                loader: "url-loader",
                options: {
                  name: "css/font/[name].[hash:8].[ext]",
                },
            },
        ],
    },
    plugins: [
        new BundleAnalyzerPlugin(),
        new MiniCSSExtractPlugin({
            filename: "css/[name].[contenthash:8].css",
        }),
        new ForkTSCheckerPlugin({
            tsconfig: "./tsconfig.json",
            useTypescriptIncrementalApi: false,
            workers: ForkTSCheckerPlugin.TWO_CPUS_FREE,
        }),
        new webpack.ProgressPlugin({profile: false}),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ],
};

module.exports = config;
