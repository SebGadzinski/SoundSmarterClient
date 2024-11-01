<template>
	<q-layout>
		<q-page-container>
			<q-tabs v-if="!$q.screen.xs" inline-label v-model="tab" class="q-pa-sm" active-color="primary"
				indicator-color="primary">
				<q-tab v-for="route in routes" :key="route.name" @click="() => {
					$router.push(route.to);
				}
					" :label="$t(route.name)" :icon="route.icon" />
			</q-tabs>
			<!-- Mobile View -->
			<q-header class="bg-primary" v-if="$q.screen.xs">
				<q-toolbar>
					<q-btn flat @click="drawer = !drawer" round dense icon="menu" />
					<q-toolbar-title>{{
						$t("Sound Smarter")
					}}</q-toolbar-title>
				</q-toolbar>
			</q-header>

			<q-drawer v-model="drawer" show-if-above elevated :width="200" :breakpoint="500" v-if="$q.screen.xs">
				<q-scroll-area class="fit">
					<q-list padding class="menu-list">
						<q-item v-for="route in routes" :key="route.name" :to="route.to" clickable v-ripple>
							<q-item-section avatar>
								<q-icon :name="route.icon" />
							</q-item-section>

							<q-item-section>
								{{ $t(route.name) }}
							</q-item-section>
						</q-item>
					</q-list>
				</q-scroll-area>
			</q-drawer>

			<q-page class="row q-col-gutter-md full-height">
				<div class="col-12 col-md-8 scroll" style="overflow-y: auto; height: 100%">
					<router-view :key="$route.fullPath" />
				</div>
				<div class="col-12 col-md-4 scroll" style="overflow-y: auto; height: 100%">
					<SideBarContent />
				</div>
			</q-page>
		</q-page-container>
	</q-layout>
</template>

<script>
import SideBarContent from "../partials/SideBarComponent.vue";
import { mapState } from "pinia";
import { useAuthState } from "src/stores/auth.state";
import { useSettingsState } from "../../stores/settings.state";

export default {
	data() {
		return {
			authState: useAuthState(),
			settingsState: useSettingsState(),
			drawer: false,
			tab: null, // Add this line
			routes: [
				{
					icon: "translate",
					name: "Translate",
					to: "/translate",
					count: null,
				},
				{
					icon: "view_in_ar",
					name: "Login",
					to: "/auth",
				},
				{
					icon: "settings",
					name: "settings",
					to: "/settings",
				},
			],
		};
	},
	computed: {
		...mapState(useSettingsState, ["language"]),
		...mapState(useAuthState, ["user"])
	},
	mounted() {
		if (this.user?.roles?.includes('admin')) {
			this.routes = [
				{
					icon: "translate",
					name: "Translate",
					to: "/translate",
					count: null,
				},
				{
					icon: "group",
					name: "Users",
					to: "/admin/users",
				},
				{
					icon: "settings",
					name: "settings",
					to: "/settings",
				},
			];
		}
		else if (this.user) {
			this.routes = [
				{
					icon: "translate",
					name: "Translate",
					to: "/translate",
					count: null,
				},
				{
					icon: "settings",
					name: "settings",
					to: "/settings",
				},
			];
		}
	},
	components: {
		SideBarContent,
	},
};
</script>

<style scoped>
.scroll {
	max-height: 100%;
	overflow-y: auto;
}
</style>
