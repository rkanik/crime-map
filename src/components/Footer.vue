<template>
	<div
		class="tw-absolute tw-inset-x-0 tw-bottom-0 tw-shadow-2xl tw-border-t tw-border-gray-100 tw-h-12 tw-flex tw-bg-white"
	>
		<router-link
			:to="{ name: 'Home' }"
			class="tw-h-12 tw-flex-1 tw-grid tw-place-items-center"
			:class="[$route.name === 'Home'?'tw-bg-blue-500 tw-bg-opacity-20 tw-text-blue-500':'tw-bg-white tw-text-gray-600']"
		>
			<svg fill="none" class="tw-h-6 tw-w-6" viewBox="0 0 24 24" stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
				/>
			</svg>
		</router-link>
		<router-link
			:to="{ name: 'Summary' }"
			class="tw-h-12 tw-flex-1 tw-grid tw-place-items-center"
			:class="[$route.name === 'Summary'?'tw-bg-blue-500 tw-bg-opacity-20 tw-text-blue-500':'tw-bg-white tw-text-gray-600']"
		>
			<svg class="tw-h-6 tw-w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 6h16M4 10h16M4 14h16M4 18h16"
				/>
			</svg>
		</router-link>
		<div class="tw-w-16">
			<button
				@click="onClickSOS"
				class="tw-w-16 tw-h-16 tw-rounded-full tw-overflow-hidden tw-transform tw--translate-y-4 tw-scale-90"
			>
				<img
					alt="sos button"
					src="@/assets/img/sos.jpg"
					class="tw-h-full tw-w-full tw-transform tw-scale-110"
				/>
			</button>
		</div>
		<router-link
			:to="{ name: 'Profile' }"
			class="tw-h-12 tw-flex-1 tw-grid tw-place-items-center"
			:class="[$route.name === 'Profile'?'tw-bg-blue-500 tw-bg-opacity-20 tw-text-blue-500':'tw-bg-white tw-text-gray-600']"
		>
			<svg class="tw-h-6 tw-w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z"
				/>
			</svg>
		</router-link>
		<router-link
			:to="{ name: 'About'}"
			class="tw-h-12 tw-flex-1 tw-grid tw-place-items-center"
			:class="[$route.name === 'About'?'tw-bg-blue-500 tw-bg-opacity-20 tw-text-blue-500':'tw-bg-white tw-text-gray-600']"
		>
			<svg class="tw-h-6 tw-w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
		</router-link>
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
	name: 'Footer',
	computed: {
		...mapGetters('Auth', ['$isSubscribed']),
		currentRouteName() {
			return this.$route.name;
		}
	},
	methods: {
		...mapActions(['toggleSubscribeModal']),
		onClickSOS() {
			if (!this.$isSubscribed) {
				return this.toggleSubscribeModal(true)
			}
			this.$emit('sos')
		}
	}
}
</script>
