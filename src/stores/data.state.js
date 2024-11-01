import { defineStore } from "pinia";
import Stack from "../data-structures/Stack";

/**
 * Parsed settings from localStorage.
 * @type {Object}
 */
const localSettingsKey = "data-store";
const _data = JSON.parse(localStorage.getItem(localSettingsKey));

/**
 * Default initial state.
 * @type {Object}
 */
const defaultState = {
	translations: new Stack(),
};

/**
 * Merges the default state with the settings from localStorage.
 * @param {Object} settings - The settings from localStorage.
 * @param {Object} defaultState - The default state.
 * @returns {Object} The merged state.
 */
const mergeWithDefaultState = (settings, defaultState) => {
	const mergedState = { ...defaultState };
	if (settings && typeof settings === "object") {
		Object.keys(defaultState).forEach((key) => {
			if (Object.hasOwnProperty.call(settings, key)) {
				mergedState[key] = settings[key];
			}
		});
	}
	return mergedState;
};

/**
 * Saves the state to localStorage.
 * @param {Object} that - The current context of the store.
 */
let saveState = (that) => {
	let object = {
		translations: that.translations || new Stack(),
	};
	localStorage.setItem(localSettingsKey, JSON.stringify(object));
};

/**
 * Initial state by merging _settings with defaultState.
 * @type {Object}
 */
const initialState = mergeWithDefaultState(_data, defaultState);

/**
 * Settings store definition.
 * @exports
 */
export const useDataState = defineStore("Data", {
	state: () => ({ ...initialState, eventLog: [] }),
	actions: {
		/**
		 * Toggles dark mode.
		 * @param {boolean} value - The value to set dark mode to.
		 */
		setTranslations(translations) {
			this.translations = new Stack(translations);

			saveState(this);
		},
		/**
		 * Toggles dark mode.
		 * @param {boolean} value - The value to set dark mode to.
		 */
		addTranslation(translation) {
			this.translations.push(translation);

			saveState(this);
		},
	},
});
