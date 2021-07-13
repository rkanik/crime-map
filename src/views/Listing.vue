<template>
	<b-container class="tw-py-4 tw-flex-1 scrollbar-y">
		<h5 class="tw-mb-4 tw-text-2xl tw-font-bold">Records Summary</h5>
		<div :key="category" v-for="(buildingType, category) in groupedRecords">
			<div
				class="tw-text-xl tw-font-semibold tw-bg-gray-200 tw-text-gray-900 tw-px-2 tw-py-1"
			>{{ category }}</div>
			<div class="tw-pl-2 tw-py-4">
				<div :key="type" v-for="(points, type) in buildingType" class="tw-text-lg">
					<span class="tw-font-medium tw-inline-block">{{type}}</span>
					<span>: {{points}}</span>
				</div>
				<div class="tw-text-lg">
					<span class="tw-font-medium tw-inline-block">Total</span>
					<span>: {{getTypeTotal(buildingType)}}</span>
				</div>
			</div>
		</div>
		<div
			class="tw-text-xl tw-font-medium tw-bg-blue-500 tw-text-white tw-px-2 tw-py-2"
		>Grand Total: {{ grandTotal }}</div>
	</b-container>
</template>

<script>
import { has } from '../helpers'
import { mapGetters } from 'vuex'
export default {
	name: 'Listing',
	computed: {
		...mapGetters('Records', ['$records']),
		grandTotal() {
			return this.$records.reduce((total, record) => total + record.points, 0)
		},
		groupedRecords() {
			return this.$records.reduce((groups, record) => {
				if (has(groups, record.category)) {
					if (has(groups[record.category], record.buildingType)) {
						let points = groups[record.category][record.buildingType]
						groups[record.category][record.buildingType] = points + record.points
					}
					else groups[record.category][record.buildingType] = record.points
				}
				else groups[record.category] = { [record.buildingType]: record.points }
				return groups
			}, {
				House: {},
				Clinic: {},
				School: {},
			})
		}
	},
	methods: {
		getTypeTotal(type) {
			return Object.values(type).reduce((total, b) => total + b, 0)
		}
	}
}
</script>