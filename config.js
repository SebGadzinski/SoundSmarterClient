const internalIp = require("internal-ip");
const fs = require("fs");

const ip = internalIp.v4.sync();

const env = {
	development: {
		devServer: {
			server: {
				type: "http",
			},
			// open: true,
			port: 9065,
		},
		env: {
			// Docker requires laptop IP address
			SERVER_DOMAIN: `http://${ip}:5468/api`,
		},
	},
	production: {
		devServer: {
			server: {
				type: "https",
			},
			port: 9065,
		},
		env: {
			SERVER_DOMAIN: 'https://sound-smarter.com/api',
		},
	},
};

function getEnv(isDevelopment) {
	return isDevelopment ? env.development : env.production;
}

module.exports = getEnv;
