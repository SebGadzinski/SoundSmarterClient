import { api } from "../boot/axios";

class DataService {
	/**
	 * Checks to see if there is a update available for the application
	 * @returns {Object} //TODO
	 */
	async checkForUpdate() {
		return new Promise((resolve, reject) => {
			let currentVersion = require("../../package.json").version;
			if (!currentVersion) reject(null);

			api.post("/app/checkForUpdate", { currentVersion })
				.then((response) => {
					if (!response.data) return reject("No Data In Response");

					console.log(response);
					resolve(response.data);
				})
				.catch((err) => {
					let { message } = err;
					if (message.includes("304")) {
						// no update available
						return resolve({ message: "No Update Available" });
					}
					reject(message);
				});
		});
	}

	/**
	 * Updates Subscriptio for firebase notification
	 * @param {String} token
	 * @param {String} enable
	 * @returns
	 */
	updateNotificationSubscription({ token, enable }) {
		return new Promise((resolve, reject) => {
			if (!token) return reject("No Token for updateNotification");

			let obj = {
				token,
				enable,
			};
			api.post("/app/updateNotificationSubscription", obj)
				.then((resp) => {
					if (resp.data.success) {
						resolve(true);
					} else {
						console.log("Message: ");
						console.log(resp.data.message);
						throw new Error("Could not turn on notififications");
					}
				})
				.catch(({ message }) => {
					reject(message);
				});
		});
	}

	async getUserPageData() {
		return await api.c({ func: api.get(`/admin/users`) });
	}

	async getProfile(userId) {
		let req = `/user/profile`;
		if (userId) {
			req += `/${userId}`;
		}
		return await api.c({ func: api.get(req) });
	}

	async saveProfile(userId, user) {
		return await api.c({
			func: api.post("/user/profile/save", { userId, user }),
		});
	}

	async getTranslations() {
		return await api.c({ func: api.get(`/data/translations`) });
	}

	async translate(options) {
		return await api.c({ func: api.post(`/data/translate`, options) });
	}
}

export default new DataService();
