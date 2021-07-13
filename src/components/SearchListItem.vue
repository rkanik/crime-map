<template>
	<div
		@click="$emit('click', $event)"
		class="tw-flex tw-space-x-3 tw-pl-6 tw-cursor-pointer hover:tw-bg-green-50"
	>
		<div class="tw-pt-2 tw-flex-none">
			<div
				class="tw-h-9 tw-w-9 tw-flex tw-items-center tw-justify-center tw-bg-gray-200 tw-rounded-full"
			>
				<img :src="icon" alt="Place Icon" class="tw-h-5 tw-w-5 tw-object-contain tw-origin-center" />
			</div>
		</div>
		<div class="tw-py-2 tw-pr-4 tw-flex-1" :class="{'tw-border-t tw-border-gray-200':border}">
			<div class="tw-text-base tw-text-gray-800">{{name}}</div>
			<div class="tw-text-sm tw-text-gray-600">{{address}}</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'SearchListItem',
	props: {
		icon: String,
		name: String,
		border: Boolean,
		address: String
	}
}
</script>
