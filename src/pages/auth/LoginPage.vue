<template>
	<div class="column">
		<q-form class="form-class" name="Login" @submit.prevent="handleLogin">
			<q-input v-model="user.email" :label="$t('Email')" :rules="[(val) => !!val || $t('Email is required')]"
				:dense="false" />
			<q-input v-model="user.password" type="password" :label="$t('Password')"
				:rules="[(val) => !!val || $t('Password is required')]" :dense="false" />
			<br />
			<div class="flex flex-center">
				<q-btn label="Submit" type="submit" color="primary" />
			</div>
		</q-form>
	</div>
</template>

<script>
import { QSpinnerGears } from "quasar";
import { mapActions } from "pinia";
import { useAuthState } from "src/stores/auth.state";
import { useSettingsState } from "src/stores/settings.state";

export default {
	name: "LoginPage",
	data() {
		return {
			user: {
				email: window.localStorage.getItem("auth-email") ?? null,
				password: null,
			},
			loading: false,
			message: "",
			timer: null,
			version: require("../../../package.json").version,
			settingsState: useSettingsState(),
		};
	},
	methods: {
		...mapActions(useAuthState, ["login"]),
		handleLogin() {
			try {
				this.loading = true;
				this.$q.loading.show({
					spinner: QSpinnerGears,
					spinnerColor: "white",
					messageColor: "white",
					backgroundColor: "#1e5499",
					message: this.$t("Logging In"),
				});
				if (this.user.email && this.user.password) {
					window.localStorage.setItem("auth-email", this.user.email);
					this.login(this.user.email, this.user.password).then(
						() => {
							this.loading = false;
							this.$q.loading.hide();
							this.$router.push("/");
						},
						(error) => {
							this.loading = false;
							this.$q.loading.hide();
						}
					);
				} else {
					this.message = this.$t("Missing Inputs");
					this.$q.loading.hide();
					this.loading = false;
				}
			} catch (err) {
				this.$q.loading.hide();
				this.loading = false;
				this.message = err;
			}
		}
	},
	components: {},
};
</script>

<style scoped></style>
