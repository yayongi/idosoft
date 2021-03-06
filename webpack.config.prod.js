var path = require('path');
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');    // https://webpack.js.org/plugins/compression-webpack-plugin/ 참고 
// output.filname를 포함한 index.html 자동 생성해주는 플러그인 
// npm install --save-dev html-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin');

// build 전에 dist 폴더를 비워주는 역할을 하는 플러그인
// npm install --save-dev clean-webpack-plugin
const { CleanWebpackPlugin } = require('clean-webpack-plugin');


// 개발을 좀 더 쉽게 하는 설정 : source maps
// 컴파일된 소스를 원래 소스 코드에 매핑해줌으로써 errors, warnings를 쉽게 추적할 수 있게 해준다.
// 1. mode : devleopment 로 설정
// 2. devtool : 'inline-source-map' 설정

// 개발을 좀 더 쉽게 하는 설정 : watch mode 
// 종속성 내의 모든 파일을 감시하는 역할을 함으로써, 변경이 일어나면 바로 빌드된다. 빌드하는 수고를 줄여준다.
// 단점은 브라우저를 refresh해서 확인해야된다는 점이다.
// watch : true 옵션을 추가하거나 
// package.json의 scripts 에서 "watch": "webpack --watch" 명령어를 추가한 후, num run watch로 실행한다.

// 개발을 좀 더 쉽게 하는 설정 : webpack-dev-server
// 간단한 웹서버와 실시간 리로딩 기능을 제공한다.
// npm install --save-dev webpack-dev-server 으로 패키지 설치
// 1. webpack.config.js 파일에 devServer 옵션 추가
// 2. package.json 파일의 scripts에 "start": "webpack-dev-server --open" 를 추가한 후, npm start 로 실행

const appRootPath = "intranet"; // 앱 Root 경로 (todo:일정관리, intranet:아이두소프트 인트라)
module.exports = {
    mode: 'production',    // development, production (운영 배포 시에는 production으로 구성 필요)
    context: path.resolve(__dirname, 'react_src'),
    entry: {
        intranet: './'+appRootPath+'/index.js',
        /* vendor: [
            // require.resolve('./polyfills'),
            'react',
            'react-dom',
            'react-router-dom',
            'moment',
            'lodash'
        ] */
    },
    // devtool: '',       // 개발모드일 경우, inline-source-map
    devServer: {
        port: 8000,
        contentBase: './react_disc/'+appRootPath,
        proxy: {
            '/intranet': 'http://localhost:9090'
        }
    },
    plugins: [
        new CompressionPlugin({
            filename: '[path].gz[query]',
            algorithm: 'gzip',        // gzip, brotliCompress
            test: /\.(js|css|html|svg)$/,
            // compressionOptions: { level: 11 },
            threshold: 10240,
            minRatio: 0.8,
            deleteOriginalAssets: false,
        }),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin(
            Object.assign(
                {},
                {
                    
                    filename: 'index.html',
                    inject: true,
                    template: appRootPath+'/index.html',
                    // showErrors: true // 에러발생시, 메세지가 화면에 노출되도록 설정
                },
                /*
                    isEnvProduction
                  ? {
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
                    }
                  : undefined
                */
            )
        ),
    ],
    cache: true,
    output: {
        filename: '[name].bundle.js',
        chunkFilename: "[name].chunk.js",
        path: path.resolve(__dirname, 'src/main/webapp/resources/js'),
    },
    resolve: {
        modules: [
        path.join(__dirname, "react_src/intranet"),
        "node_modules"
        ]
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /(node_modules)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        '@babel/preset-env',
                        '@babel/preset-react',
                        {
                            plugins: [
                                '@babel/plugin-proposal-class-properties'
                            ]
                        }
                    ]
                }
            }
        }, {
            test: /\.s[ac]ss$/i,
            use: [
                // Creates `style` nodes from JS strings
                'style-loader',
                // Translates CSS into CommonJS
                'css-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        plugins: () => [require('autoprefixer')({
                            'overrideBrowserslist': ['> 10%', 'last 2 versions']
                        })],
                    }
                  },
                // Compiles Sass to CSS
                // need to install  => npm install sass-loader node-sass webpack --save-dev
                'sass-loader'
            ]
        
        }, {
            test:/\.(png|jpg)$/,
            use:  {
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    useRelativePath: true,
                    outputPath: "../img",
                    publicPath: "resources/img/"
                }
            }
        }]
    },
    optimization: {
        providedExports: true, 
        minimize: true, 			// UglifyJsPlugin 계승
        splitChunks: {			// CommonsChunkPlugin 계승
            cacheGroups: {      // 특정 파일들을 청크로 분리할 때 사용 (common이란 청크를 분리)
                commons: {
                    test: /[\\/]node_modules[\\/]/,     // 대상이 되는 파일에 대한 정규식
                    name: 'vendors',     // 청크로 분리할때 사용될 이름(output.filename 옵션의 [name] 에 대치)
                    chunks: 'all'           // all : test 조검에 포함되는 모든 것을 분리, async : import()를 이용해 다이나믹하게 사용되는 경우 분리, initial : 초기 로딩에 필요한 경우
                }
            }
        },
    },
};