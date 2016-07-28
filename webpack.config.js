module.exports = {
    entry: [
        './app/public/app.js',
    ],
    output: {
        filename: 'bundle.js'
    },
    module: {
        preLoaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'jshint-loader'
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'eslint-loader'
            }
        ],
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015']
                }
            }
        ]
    },
    watch: true,
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    devtool: 'eval-source-map',
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        stats: 'normal',
        host: process.env.HOST || 'localhost',
        port: process.env.PORT || 4000,
        proxy: {
            '/api/*':{
                target: 'http://localhost:9000/',
                secure: false
            }
        }
    }

};