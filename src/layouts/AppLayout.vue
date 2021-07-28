<template>
	<div class="app-layout tw-flex tw-flex-col tw-overflow-hidden">
		<main class="app-layout__main tw-flex-1 tw-flex tw-flex-col tw-overflow-hidden">
			<route-wrapper>
				<router-view />
			</route-wrapper>
		</main>
		<Footer class="tw-flex-none" @sos="onClickSoS" />
	</div>
</template>

<script>
import Footer from '@/components/Footer.vue'
import RouteWrapper from '@/components/utils/RouteWrapper'
export default {
	name: 'AppLayout',
	components: {
		Footer,
		RouteWrapper
	},
	methods: {
		async onClickSoS() {
			navigator.geolocation.getCurrentPosition(position => {
				const { latitude, longitude } = position.coords
				navigator.share({
					title: '[Crime Map] Crime occuring in my location',
					url: `${location.origin}/home?center=${latitude},${longitude}`,
				})
					.catch(err => {
						console.log('Share cancelled', err)
					})
			})

		},
	}
}
</script>
<style lang="scss">
	.app-layout {
		&__main {
			padding-bottom: 48px;
		}
	}
</style>
