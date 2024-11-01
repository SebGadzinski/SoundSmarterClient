import { PushNotifications } from "@capacitor/push-notifications";
import DataService from "./data.service";
import { i18n } from "../boot/i18n";
import { Notify as qNotifiy } from "quasar";

const Notify = {
	/**
	 * Registers notification settings.
	 *
	 * @param {Object} options - The settings for notifications.
	 * @param {boolean} options.notificationsEnabled - Indicates whether notifications are enabled.
	 * @param {boolean} options.notificationsAllStores - Indicates whether notifications are enabled for all stores.
	 * @param {string[]} options.notificationsStoreList - A list of store identifiers for which notifications are enabled.
	 * @returns {void} - This function does not return anything.
	 */
	register({ notificationsEnabled }) {
		return new Promise(async (resolve, reject) => {
			try {
				if (!notificationsEnabled)
					return reject("Not Enabled"), await Notify.unregister();

				await PushNotifications.removeAllListeners();

				await PushNotifications.addListener("registration", (token) => {
					console.log("CREATED TOKEN FINE");
					console.log(token);

					localStorage.setItem(
						"firebaseToken",
						JSON.stringify(token)
					);
					DataService.updateNotificationSubscription({
						token: token.value,
						enable: true,
					})
						.then((result) => {
							console.log(
								`Register Token to server success: ${JSON.stringify(
									result
								)}`
							);

							return resolve(result);
						})
						.catch((err) => {
							console.error(`Registration Error Caught: ${err}`);
							return reject(err);
						});
				});

				// Some issue with our setup and push will not work
				await PushNotifications.addListener(
					"registrationError",
					(error) => {
						console.error(`Registration Error ${error}`);
						return reject(error.error);
					}
				);

				const result = await PushNotifications.requestPermissions();
				if (result.receive === "granted") {
					// Register with Apple / Google to receive push via APNS/FCM
					console.log("PUSH NOTIFICATION PERMISSIONS GRANTED");
					PushNotifications.register();
				} else {
					// Show some error
					alert(
						i18n.global.t("errorRequestingPushNotifications", {
							error: JSON.stringify(result),
						})
					);
				}
			} catch (err) {
				alert(i18n.global.t("alertError", { error: err.toString() }));
				reject(err);
			}
		});
	},
	/**
	 * Unregisters all push notifications
	 * @returns
	 */
	unregister() {
		return new Promise(async (resolve, reject) => {
			try {
				await PushNotifications.removeAllListeners();
			} catch (err) {
				reject(err);
			}
		});
	},
	/**
	 * Adds push notification listeners to router
	 * @param {Router} router
	 */
	addListeners(router) {
		Notify.PushNotifications.removeAllListeners();
		Notify.PushNotifications.addListener(
			"pushNotificationReceived",
			(notification) => {
				console.log(JSON.stringify(notification));

				let notifyData = {
					message: notification.body,
				};

				if (notification?.data?.jsonData) {
					const data = JSON.parse(notification?.data?.jsonData);
					if (data?.to) {
						notifyData.actions = [
							{
								label: data.to.label,
								color: data.to.color,
								handler: () => {
									router.push(data.to.route);
								},
							},
						];
					}

					if (data?.dotdotdot) {
						notifyData = {
							...notifyData,
							...data.dotdotdot,
						};
					}
				}

				console.log(notifyData);

				qNotifiy.create(notifyData);
			}
		);

		Notify.PushNotifications.addListener(
			"pushNotificationActionPerformed",
			async (event) => {
				console.log(event);
				let { notification } = event;
				if (notification?.data?.jsonData) {
					const data = JSON.parse(notification.data.jsonData);
					router.push(data.to.route);
				}
			}
		);
	},
	PushNotifications,
};

export default Notify;
