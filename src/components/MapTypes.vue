<template>
	<div class="tw-p-0.5 tw-space-y-1 tw-bg-blue-500 tw-shadow tw-bg-opacity-90 tw-rounded-lg">
		<div
			:key="type.id"
			v-for="type in types"
			@click="$emit('input', type.id)"
			class="tw-border-2 tw-rounded-lg tw-p-0.5 tw-overflow-hidden tw-w-11 tw-h-11 tw-relative tw-cursor-pointer"
			:class="[type.id === value ? 'tw-border-white' : 'tw-border-transparent']"
		>
			<img :src="type.icon" :alt="`map type ${type.id}`" class="tw-w-full tw-h-full" />
		</div>
	</div>
</template>

<script>
export default {
	name: 'MapTypes',
	props: {
		value: String
	},
	data: () => ({
		types: [
			{ id: 'roadmap', icon: require('@/assets/img/default-map-type.png') },
			{ id: 'satellite', icon: require('@/assets/img/satellite.png') },
		]
	}),
}
</script>