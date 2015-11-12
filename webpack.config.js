module.exports = {
    entry: "./src/js/init.jsx",
    output: {
        path: __dirname,
        filename: "dist/js/bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel' // 'babel-loader' is also a legal name to reference
            }
        ]
    }
};