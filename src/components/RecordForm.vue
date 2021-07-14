<template>
	<b-form @submit.prevent="onSubmit" class="recform tw-pb-12">
		<b-form-group class="recform__radio-group tw-mt-4">
			<h6 class="tw-font-semibold tw-text-base">Confidence in this {{type}}</h6>
			<b-form-radio-group
				v-model="record.crimeConfidence"
				:options="crimeConfidences"
				class="tw-mt-2 tw-flex tw-space-x-3 tw-items-center"
			/>
		</b-form-group>
		<b-form-group class="recform__radio-group tw-mt-6">
			<h6 class="tw-font-semibold tw-text-base">Confidence in this Location</h6>
			<b-form-radio-group
				v-model="record.locationConfidence"
				:options="locationConfidences"
				class="tw-mt-2 tw-flex tw-space-x-3 tw-items-center"
			/>
		</b-form-group>
		<b-form-group class="recform__radio-group tw-mt-6">
			<h6 class="tw-font-semibold tw-text-base">
				When did
				<span class="tw-lowercase">{{type}}</span> happen?
			</h6>
			<div class="tw-flex tw-items-center tw-space-x-3">
				<b-form-radio-group
					v-model="occuredAt"
					:options="visitOptions.slice(0, 2)"
					class="tw-flex tw-space-x-3 tw-items-center"
				/>
				<Menu v-model="occuredMenu" content-class="tw-right-0 tw-shadow tw-border">
					<template #toggler="{on}">
						<div v-on="on" class="tw-flex tw-space-x-1 tw-items-center">
							<div
								class="tw-w-3 tw-h-3 tw-rounded-full tw-border tw-grid tw-place-items-center tw-p-px"
								:class="[occuredAtOther ? 'tw-border-blue-600' : 'tw-border-gray-500']"
							>
								<div v-if="occuredAtOther" class="tw-w-2 tw-h-2 tw-rounded-full tw-bg-blue-600"></div>
							</div>
							<span class="tw-text-sm tw-w-20 tw-leading-tight">{{occuredAtOther || 'More'}}</span>
						</div>
					</template>
					<div class="tw-w-48 tw-mt-2 tw-bg-white tw-py-1 tw-shadow-md tw-rounded-md">
						<div
							:key="option.value"
							v-for="(option, optionIndex) in visitOptions.slice(3)"
							class="tw-px-5 tw-py-2 tw-text-sm tw-font-medium tw-text-gray-600"
							@click="occuredAtOther = option.value"
							:class="{'tw-border-t tw-border-gray-200':optionIndex}"
						>{{option.text}}</div>
					</div>
				</Menu>
			</div>
		</b-form-group>
		<b-form-group class="recform__radio-group tw-mt-6">
			<h6 class="tw-font-semibold tw-text-base">Do you have a web link?(URL)</h6>
			<b-form-input v-model="record.website" placeholder="Enter url here"></b-form-input>
		</b-form-group>
		<div class="tw-space-x-3 tw-fixed tw-bottom-0 tw-bg-white tw-text-center tw-inset-x-0 tw-py-3">
			<div v-if="error" class="tw-mb-3 tw-text-xs tw-text-red-500">{{error}}</div>
			<b-button type="submit" variant="primary" class="tw-w-32">Add Record</b-button>
			<b-button type="button" @click="onCancel" class="tw-w-32">Cancel</b-button>
		</div>
	</b-form>
</template>

<script>
import Menu from './utils/Menu.vue'
export default {
	name: 'RecordForm',
	components: { Menu },
	props: {
		type: String,
		error: String,
	},
	data: () => ({
		record: {
			crimeConfidence: 'Very High',
			locationConfidence: 'Exact Location',
			website: ''
		},
		crimeConfidences: [
			'Very High', 'High', 'Middle', 'Low'
		].map(v => ({ text: v, value: v })),

		locationConfidences: [
			'Exact Location', 'Nearby', 'Neighbourhood'
		].map(v => ({ text: v, value: v })),

		occuredMenu: false,
		occuredAt: 'Sometime ago',
		occuredAtOther: null,
		visitOptions: [
			'Just Now!', 'Sometime ago',
			'Last 3 months', 'Last 6 months',
			'Last 12 months', 'Last 2 years',
			'Over 2 years ago'
		].map(v => ({ text: v, value: v })),
	}),
	watch: {
		occuredAt(v) { v && (this.occuredAtOther = null) },
		occuredAtOther(v) { v && (this.occuredAt = null) },
	},
	methods: {
		onSubmit() {
			this.$emit('submit', {
				...this.record,
				occuredAt: (
					this.occuredAt ||
					this.occuredAtOther
				)
			})
		},
		onCancel() {
			this.$bvModal.hide('modal-record-crime')
			this.$emit('error', '')
		}
	}
}
</script>
<style lang="scss">
	.recform {
		&__radio-group {
			.custom-radio {
				display: flex;
				align-items: center;
				label {
					margin-left: 4px;
					font-size: 14px;
					line-height: 1.25;
				}
			}
		}
	}
</style>