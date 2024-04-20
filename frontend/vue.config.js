var path = require('path')
module.exports = {
	lintOnSave: false,
	configureWebpack: {
		resolve: {
			alias: {
				src: path.resolve(__dirname, 'src')
			}
		},
		devServer: {
			port: process.env.port
		}
	}
}