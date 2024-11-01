import { api } from "../boot/axios";
import TokenService from "./token.service";
import { Preferences } from "@capacitor/preferences";
import { Capacitor } from "@capacitor/core";

class AuthService {
	/**
	 * Logs user in
	 * @param {String} email
	 * @param {String} password
	 * @returns Logged in user
	 */
	async login(email, password) {
		console.log(`"${email}" "${password}"`);
		const data = await api.c({
			func: api.post("/auth", { email, password }),
			goToLink: false,
		});
		TokenService.setUser(data.user);
		TokenService.setLocalToken(data.token);
		return data.user;
	}
	/**
	 * Signs a user up using their email and password.
	 * @param {Object} params - Object containing email, password and confirmPassword.
	 * @param {string} params.email - User's email.
	 * @param {string} params.password - User's password.
	 * @param {string} params.confirmPassword - Confirmation of user's password.
	 * @throws Will throw an error if passwords do not match.
	 * @returns {Promise} A promise that resolves if the sign-up is successful, otherwise rejects with an error message.
	 */
	async signUp({ email, password, confirmPassword }) {
		if (password !== confirmPassword)
			throw new Error("Passwords not matching");
		console.log(`"${email}" Signing Up...`);
		return await api.c({
			func: api.post("/auth/signUp", { email, password }),
		});
	}
	/**
	 * Sends reset password email to users email
	 * @param {String} email
	 * @returns
	 */
	async forgotPassword(email) {
		if (!email || email.length < 3 || !email.includes("@"))
			throw new Error("Invalid Email");
		console.log(`Sending Password Reset: "${email}"`);
		return await api.c({
			func: api.post("/auth/sendEmailResetPassword", { email }),
		});
	}
	/**
	 * Sends reset password info to server to reset the passsword attached to this token
	 * @param {String} newPassword
	 * @param {String} token
	 * @returns
	 */
	async resetPassword(newPassword, token) {
		return await api.c({
			func: api.post(`/auth/${token}/resetPassword`, {
				password: newPassword,
			}),
		});
	}
	async sendEmailConfirmation() {
		return await api.c({ func: api.post(`/auth/sendEmailConfirmation`) });
	}
	/**
	 * Confirms the token with email
	 * @param {String} token token to confirm
	 * @returns
	 */
	async confirmEmail(token) {
		return await api.c({ func: api.post(`/auth/${token}/confirmEmail`) });
	}
	/**
	 * Refreshes the jwt access toekn and refresh token
	 */
	async refreshSession(showError = true) {
		const data = await api.c({
			func: api.post("/auth/refresh", {
				token: TokenService.getLocalRefreshToken(),
			}),
			showError,
		});

		if (data) {
			const { token, refreshToken, user } = data;

			TokenService.setUser(user);
			TokenService.setLocalRefreshToken(refreshToken);
			TokenService.setLocalToken(token);
		} else {
			TokenService.removeUser();
		}
	}

	async emailConfirmStatus() {
		return await api.c({ func: api.get("/auth/emailConfirmStatus") });
	}

	/**
	 * Logs user out and removes token
	 */
	async logout(reload = true) {
		TokenService.removeUser();
		if (Capacitor.getPlatform() != "web") {
			try {
				let file = await Preferences.clear();
			} catch (e) {}
			if (reload) location.reload();
		} else {
			if (reload) location.reload();
		}
	}
}

export default new AuthService();
