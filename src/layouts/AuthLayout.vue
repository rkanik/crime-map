<template>
	<div class="auth__wrapper">
		<route-wrapper>
			<router-view />
		</route-wrapper>
	</div>
</template>

<script>
import RouteWrapper from '@/components/utils/RouteWrapper'
export default {
	name: 'AuthLayout',
	components: {
		RouteWrapper
	}
}
</script>
<style lang="scss" scoped>
	.auth {
		&__wrapper {
			padding: 0 15px;
		}
	}
</style>
