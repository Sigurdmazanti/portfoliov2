const path = require('path');

module.exports = {
    entry: './src/app.js',
    output: {
    path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    cache: false,
    mode: 'development',
    devServer: {
        static: {
            directory: path.resolve(__dirname),
        },
        open: true
    },
    watchOptions: {
        poll: 100,
        aggregateTimeout: 300,
    },
};