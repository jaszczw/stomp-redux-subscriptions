'use strict';

var path = require('path');

module.exports = {
    cache: true,
    output: {
        library: 'stomp-subscriptions',
        path: path.resolve(__dirname, './es'),
    },
    module: {
        rules: [{
            test: /\.ts(x?)$/,
            exclude: /node_modules/,
            use: [
                {
                    loader: 'babel-loader'
                },
                {
                    loader: 'ts-loader'
                }
            ]
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            use: [
                {
                    loader: 'babel-loader'
                }
            ]
        }]
    },
    plugins: [],
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
};
