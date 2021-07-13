<template>
	<transition name="route-transition" mode="out-in">
		<slot></slot>
	</transition>
</template>
<script>
export default {
	name: "RouteWrapper",
};
</script>

<style>
	.route-transition-enter,
	.route-transition-leave-to {
		opacity: 0;
		transform: translateX(-32px);
	}
	.route-transition-enter-active,
	.route-transition-leave-active {
		transition: all 300ms ease;
	}
	.route-transition-enter-to,
	.route-transition-leave {
		opacity: 1;
		transform: translateX(0);
	}
</style>