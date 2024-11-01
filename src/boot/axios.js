import { boot } from "quasar/wrappers";
import { Dialog } from "quasar";
import axios from "axios";
import TokenService from "../services/token.service";
import AuthService from "../services/auth.service";

import eventBus from "../services/EventBus";

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({
	baseURL: `${process.env.SERVER_DOMAIN}`,
	timeout: 15000,
});

/**
 * @param {Promise} func
 * @param {String} customError
 * @param {title: String, message: String} dialogOptions
 * @returns
 */
api.c = async ({
	func,
	customError = null,
	dialogOptions = {},
	logoutOnError = false,
	showError = true,
	goToLink = "/",
}) => {
	try {
		const result = await func;

		if (customError) {
			if (result.data.success) {
				return result.data.data;
			} else {
				console.log("Message: ");
				console.log(result.data.message);
				throw new Error(customError);
			}
		} else {
			if (!result?.data?.success)
				throw new Error(result?.data?.message ?? "Unknown");
		}

		return result.data.data;
	} catch (err) {
		if (logoutOnError || err?.toString()?.includes("invalid signature")) {
			TokenService.removeUser();
			window.location.reload();
		} else if (showError) {
			dialogOptions.title = dialogOptions.title ?? `Error`;
			const error = err.toString();
			dialogOptions.message = error;

			if (dialogOptions) {
				Dialog.create(dialogOptions).onDismiss(() => {
					if (goToLink) {
						window.location = goToLink;
					}
				});
			}
			throw err;
		}
	}
};

api.interceptors.request.use(
	(config) => {
		const token = TokenService.getLocalToken();
		if (token) {
			config.headers["authorization"] = token;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

api.interceptors.response.use(
	(res) => {
		return res;
	},
	async (err) => {
		console.log(err);
		const domain = window.location.hostname;
		const preFix = domain !== "localhost" ? "#/" : "";
		const { route } = err?.response?.data?.onError ?? {};
		let nextUrl = "";
		if (route?.query) {
			nextUrl = err?.config?.url ? `?${route.query}` : ``;
		} else {
			nextUrl = `?redirectPath=${window.location.pathname}`;
		}
		if (err.response.status === 499) {
			window.location = preFix + "ipblocked";
			return err.response;
		}
		if (err.response.status === 477) {
			window.location = preFix + "auth/check-confirm/email" + nextUrl;
			return err.response;
		}
		const originalConfig = err.config;
		// console.log(originalConfig.url);
		if (
			!originalConfig.url.startsWith("/auth") ||
			(["/auth/emailConfirmStatus", "/auth/sendEmailConfirmation"].some(
				(x) => x === originalConfig.url
			) &&
				err.response)
		) {
			// Access Token was expired
			if (err.response.status === 401 && !originalConfig._retry) {
				if (originalConfig.url == "/auth/refresh") {
					AuthService.logout();
					return;
				}
				originalConfig._retry = true;
				try {
					await AuthService.refreshSession(false);
					return api(originalConfig);
				} catch (error) {
					console.log(error);
					return Promise.reject(error);
				}
			}
		}

		return Promise.reject(err);
	}
);

export default boot(({ app }) => {
	// for use inside Vue files (Options API) through this.$axios and this.$api

	app.config.globalProperties.$axios = axios;
	// ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
	//       so you won't necessarily have to import axios in each vue file

	app.config.globalProperties.$api = api;
	// ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
	//       so you can easily perform requests against your app's API
});

export { api };
