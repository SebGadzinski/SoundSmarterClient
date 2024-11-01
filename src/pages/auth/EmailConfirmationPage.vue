<template>
	<div class="q-pa-md row justify-center items-center full-height">
		<div class="column items-center">
			<!-- Spinner -->
			<q-spinner color="primary" size="40px" />

			<!-- Confirmation Message -->
			<div class="q-mt-md text-h6">
				{{ $t("Confirming Email...") }}
			</div>
		</div>
	</div>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useAuthState } from "src/stores/auth.state";
import { useRoute } from "vue-router";

export default {
	name: "EmailConfirmationPage",
	data() {
		return {
			route: useRoute(),
		};
	},
	computed: {
		...mapState(useAuthState, ["user"]),
	},
	methods: {
		...mapActions(useAuthState, ["confirmEmail", "refreshSession"]),
	},
	async mounted() {
		try {
			if (this.user?.emailConfirmed) {
				this.$router.push("/");
			}
			const token = this.route?.query?.token;
			await this.confirmEmail(token);
			if (!this.user) {
				this.$q
					.dialog({
						title: this.$t(
							"Email Confirmed."
						),
						message: this.$t(
							"Please close login on this tab or continue on your last one."
						),
					})
					.onDismiss(() => {
						this.$router.push("/auth/login");
					});
			} else {
				await this.refreshSession();
				this.loading = false;
				this.$q.loading.hide();
				this.$q
					.dialog({
						title: this.$t(
							"Email Confirmed."
						),
					})
					.onDismiss(() => {
						this.$router.push("/");
					});
			}
		} catch (err) {
			this.loading = false;
			this.$q.loading.hide();
			console.log(err);
		}
	}
};
</script>

<style scoped></style>
