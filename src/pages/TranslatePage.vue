<template>
	<q-page class="flex q-px-lg">
		<q-card class="q-px-md q-pb-lg full-width" style="height: fit-content">
			<q-form @submit="handleSubmit">
				<q-card-section>
					<q-input v-model="message" label="Message" type="textarea" filled dense class="q-mt-sm" />
					<q-input v-model="negatives" label="Negatives" filled dense class="q-mt-sm" />
					<q-input v-model="positives" label="Positives" filled dense class="q-mt-sm" />
					<q-input v-model="actor" label="Actor" filled dense class="q-mt-sm" />
					<q-input v-model="gender" label="Gender" filled dense class="q-mt-sm" />
					<q-input v-model="tone" label="Tone" filled dense class="q-mt-sm" />
					<q-input v-model="language" label="language" filled dense class="q-mt-sm" />
					<q-input v-model="to" label="To" filled dense class="q-mt-sm" />
				</q-card-section>

				<q-card-actions align="center">
					<q-btn class="text-h6 full-width" type="submit" label="Submit" color="primary" />
				</q-card-actions>
			</q-form>

			<q-dialog v-model="dialog" :backdrop-filter="'blur(4px) saturate(150%)'">
				<q-card>
					<q-card-section>
						<div class="text-h6">{{ $t('Translated Message') }}</div>
					</q-card-section>
					<q-card-section>
						<p>{{ translatedMessage }}</p>
					</q-card-section>
					<q-card-actions align="right">
						<q-btn flat label="Close" color="primary" v-close-popup />
					</q-card-actions>
				</q-card>
			</q-dialog>
		</q-card>
	</q-page>
</template>


<script>
import { QSpinnerClock } from "quasar";
import dataService from "../services/data.service";
import { mapActions } from "pinia";
import { useDataState } from "../stores/data.state";

export default {
	name: "TranslatePage",
	data() {
		return {
			message: localStorage.getItem("message") || "",
			negatives: localStorage.getItem("negatives") || "Don't sound like a robot",
			positives: localStorage.getItem("positives") || "Keep the sentence close to the same size as the message",
			actor: localStorage.getItem("actor") || "",
			gender: localStorage.getItem("gender") || "",
			tone: localStorage.getItem("tone") || "Smart",
			language: localStorage.getItem("language") || "",
			to: localStorage.getItem("to") || "",
			translatedMessage: "",
			dialog: false,
			dataState: useDataState(),
		};
	},
	methods: {
		...mapActions(useDataState, ["addTranslation"]),
		async handleSubmit() {
			const options = {
				message: this.message,
				negatives: this.negatives,
				positives: this.positives,
				actor: this.actor,
				gender: this.gender,
				tone: this.tone,
				language: this.language,
				to: this.to,
			};
			this.$q.loading.show({
				backgroundColor: "white",
				message: this.$t("Validating Token..."),
				spinner: QSpinnerClock,
				messageColor: 'black',
				spinnerColor: 'black'
			});
			const data = await dataService.translate(options);
			this.dataState.addTranslation(data);
			this.translatedMessage = data.translation
			this.dialog = true;
			this.$q.loading.hide();

			// Save values to local storage
			localStorage.setItem("message", this.message);
			localStorage.setItem("negatives", this.negatives);
			localStorage.setItem("positives", this.positives);
			localStorage.setItem("actor", this.actor);
			localStorage.setItem("gender", this.gender);
			localStorage.setItem("tone", this.tone);
			localStorage.setItem("language", this.language);
			localStorage.setItem("to", this.to);
		},
	},
};
</script>

<style scoped></style>
