<template>
	<div class="q-px-md q-pb-md">
		<q-card class="q-px-md">
			<q-card-section>
				<q-list v-if="translations?.items?.length > 0" bordered separator>
					<q-item v-for="(item, index) in translations.items" :key="index" clickable
						@click="showJsonDialog(item)">
						<q-item-section>
							<q-item-label class="text-primary">{{ truncate(item.message, 100) }}</q-item-label>
							<q-item-label caption>{{ $t("Translation") }}</q-item-label>
							<q-item-label class="text-secondary">{{ truncate(item.translation, 100) }}</q-item-label>
						</q-item-section>
					</q-item>
				</q-list>
				<div class="text-h6 text-center" v-else>{{ $t('No History') }}</div>
			</q-card-section>
		</q-card>

		<q-dialog v-model="jsonDialog">
			<q-card class="info-card">
				<q-card-section>
					<div class="text-h6 q-my-none">{{ $t('Message') }}</div>
					<p>{{ dialogItem.message }}</p>
					<div class="text-h6 q-my-none">{{ $t('Translation') }}</div>
					<p>{{ dialogItem.translation }}</p>
					<div class="text-h6 q-my-none">{{ $t('Settings') }}</div>
					<q-list bordered>
						<q-item v-for="(value, key) in dialogItem.settings" :key="key">
							<q-item-section>
								<strong>{{ key.toUpperCase() }}:</strong> {{ value }}
							</q-item-section>
						</q-item>
					</q-list>
				</q-card-section>
				<q-card-actions align="right">
					<q-btn flat label="Close" v-close-popup />
				</q-card-actions>
			</q-card>
		</q-dialog>
	</div>
</template>

<script>
import dataService from "../../services/data.service";
import { mapState, mapActions } from "pinia";
import { useDataState } from "../../stores/data.state";

export default {
	name: "SideBar",
	data() {
		return {
			jsonDialog: false,
			dialogItem: {
				message: '',
				translation: '',
				settings: {}
			}
		};
	},
	async mounted() {
		this.setTranslations(await dataService.getTranslations());
		console.log(this.translations);
	},
	computed: {
		...mapState(useDataState, ["translations"]),
		debug: {
			get() {
				return this.settingsState.debug;
			},
			set(bool) {
				this.settingsState.setDebug(bool);
			},
		},
	},
	methods: {
		...mapActions(useDataState, ["setTranslations"]),
		truncate(text, length) {
			if (text.length > length) {
				return text.substring(0, length) + '...';
			}
			return text;
		},
		showJsonDialog(item) {
			this.dialogItem = item;
			this.jsonDialog = true;
		}
	}
};
</script>

<style scoped>
.info-card {
	min-width: 50vw;
	max-width: 70vw;
}

@media (max-width: 800px) {
	.info-card {
		min-width: 90vw;
	}
}

pre {
	white-space: pre-wrap;
	word-wrap: break-word;
	background: #f5f5f5;
	padding: 10px;
	border-radius: 5px;
}
</style>
