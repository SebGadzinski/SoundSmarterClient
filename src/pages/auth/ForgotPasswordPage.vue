<template>
	<div class="column">
		<q-form class="form-class" name="Forgot Password" @submit.prevent="handleForgotPassword">
			<q-input v-model="email" :label="$t('Email')" :rules="[(val) => !!val || $t('Email is required')]"
				:dense="false" />
			<br />
			<div class="flex flex-center">
				<q-btn label="Send Email" type="submit" color="primary" />
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
	name: "ForgotPasswordPage",
	data() {
		return {
			email: window.localStorage.getItem("auth-email") ?? null,
			loading: false,
			settingsState: useSettingsState(),
		};
	},
	methods: {
		...mapActions(useAuthState, ["forgotPassword"]),
		handleForgotPassword() {
			try {
				this.loading = true;
				this.$q.loading.show({
					spinner: QSpinnerGears,
					spinnerColor: "white",
					messageColor: "white",
					backgroundColor: "#1e5499",
					message: this.$t("Sending Email"),
				});
				if (this.email) {
					window.localStorage.setItem("auth-email", this.email);
					this.forgotPassword(this.email).then(
						() => {
							this.loading = false;
							this.$q.loading.hide();
							this.$q.dialog({ title: this.$t("Email Sent") });
							setTimeout(() => {
								this.$router.push("/auth/login");
							}, 1500);
						},
						(error) => {
							this.loading = false;
							this.$q.loading.hide();
							this.$q.dialog({
								title:
									(error.response &&
										error.response.data &&
										error.response.data.message) ||
									error.message ||
									error.toString(),
							});
						}
					);
				} else {
					this.$q.loading.hide();
					this.loading = false;
					this.$q.dialog({ title: this.$t("Missing Inputs") });
				}
			} catch (err) {
				console.log(err);
				this.$q.loading.hide();
				this.loading = false;
				this.$q.dialog({ title: this.$t(err) });
			}
		}
	}
};
</script>

<style scoped></style>
