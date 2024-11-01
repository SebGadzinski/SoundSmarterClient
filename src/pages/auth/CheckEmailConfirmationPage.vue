<template>
	<div class="q-pa-md row justify-center items-center full-height">
		<div class="column items-center">
			<!-- Spinner -->
			<q-spinner color="primary" size="40px" />
			<!-- Next Call Message -->
			<div class="q-mt-md text-h6">
				{{ $t(`Calling In: ${timeLeft}s`) }}
			</div>
			<!-- Confirmation Message -->
			<div class="q-mt-md text-h5 text-center">
				{{ $t("Checking Email Status") }}
			</div>
			<q-btn class="q-mt-lg" color="primary" :label="$t('Send Confirmation Email')" @click="sendEmail" />
		</div>
	</div>
</template>

<script>
import { ref } from "vue";
import AuthService from "../../services/auth.service";
import { mapActions, mapState } from "pinia";
import { useSettingsState } from "src/stores/settings.state";
import { useAuthState } from "src/stores/auth.state";
import { useRoute } from "vue-router";

export default {
	name: "EmailConfirmationPage",
	data() {
		return {
			timeLeft: ref(1),
			route: useRoute(),
			settingsState: useSettingsState(),
			authState: useAuthState(),
		};
	},
	async mounted() {
		if (this?.user?.emailConfirmed) {
			this.$router.push({ path: "/" });
			return;
		}
		await this.checkStatus();
		this.timerInterval = setInterval(async () => {
			if (this.timeLeft == 1) {
				await this.checkStatus();
				this.timeLeft = 10;
			}
			this.timeLeft--;
		}, 1000);
	},
	beforeUnmount() {
		if (this.timerInterval) {
			clearInterval(this.timerInterval);
		}
	},
	computed: {
		...mapState(useAuthState, ["user"]),
	},
	methods: {
		...mapActions(useAuthState, [
			"sendEmailConfirmation",
			"refreshSession",
		]),
		async sendEmail() {
			try {
				await this.sendEmailConfirmation();
				this.$q.dialog({
					title: this.$t("Email Sent"),
				});
			} catch (err) {
				this.$q.dialog({
					title: this.$t("Cannot Send Email"),
					message: err.message,
				});
			}
		},
		async checkStatus() {
			// Make the call to email confirmation endpoint
			const status = await AuthService.emailConfirmStatus();
			if (status === "noUser") {
				this.$q.notify({
					type: "accent",
					message: "Refreshing Session...",
				});
				await this.refreshSession();
				window.location.reload();
			} else if (status) {
				this.$q.notify({
					type: "positive",
					message: "Your email is confirmed",
				});
				await this.refreshSession();
				clearInterval(this.timerInterval);
				setTimeout(() => {
					const redirectPath = this.route?.query["redirectPath"];
					if (redirectPath) {
						this.$router.push(redirectPath);
						return;
					} else {
						this.$router.push("/");
					}
				}, 2000);
			}
		}
	}
};
</script>

<style scoped></style>
