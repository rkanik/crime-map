<template>
	<b-form @submit.prevent="onSubmit" class="recform">
		<div class="form-group">
			<label for="type" class="tw-font-semibold tw-text-base">{{ type }} Type</label>
			<select required id="type" v-model="buildingType" class="form-control tw-mt-1">
				<option :key="opt.value" :value="opt.value" v-for="opt in types[type]">{{ opt.text }}</option>
			</select>
		</div>

		<b-form-group class="recform__radio-group tw-mt-4">
			<h6 class="tw-font-semibold tw-text-base">Confidence in this {{type}}</h6>
			<b-form-radio-group
				v-model="record.buildingConfidence"
				:options="buildingConfidences"
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
			<h6 class="tw-font-semibold tw-text-base">When did you visit the {{type}}?</h6>
			<div class="tw-flex tw-items-center tw-space-x-3">
				<b-form-radio-group
					v-model="visitedAt"
					:options="visitOptions.slice(0, 2)"
					class="tw-flex tw-space-x-3 tw-items-center"
				/>
				<Menu v-model="visitedMenu" content-class="tw-right-0 tw-shadow tw-border">
					<template #toggler="{on}">
						<div v-on="on" class="tw-flex tw-space-x-1 tw-items-center">
							<div
								class="tw-w-3 tw-h-3 tw-rounded-full tw-border tw-grid tw-place-items-center tw-p-px"
								:class="[visitedAtOther ? 'tw-border-blue-600' : 'tw-border-gray-500']"
							>
								<div v-if="visitedAtOther" class="tw-w-2 tw-h-2 tw-rounded-full tw-bg-blue-600"></div>
							</div>
							<span class="tw-text-sm tw-w-20 tw-leading-tight">{{visitedAtOther || 'More'}}</span>
						</div>
					</template>
					<div class="tw-w-48 tw-mt-2 tw-bg-white tw-py-1 tw-shadow-md tw-rounded-md">
						<div
							:key="option.value"
							v-for="(option, optionIndex) in visitOptions.slice(3)"
							class="tw-px-5 tw-py-2 tw-text-sm tw-font-medium tw-text-gray-600"
							@click="visitedAtOther = option.value"
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
		<div class="tw-space-x-3">
			<b-button type="submit" variant="primary" class="tw-mt-4">Add Record</b-button>
			<b-button type="button" class="tw-mt-4" @click="$bvModal.hide('modal-record-building')">Cancel</b-button>
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
	},
	data: () => ({
		buildingType: 'h1',
		types: {
			House: [
				{ value: 'h1', text: 'House Type 1', points: 1 },
				{ value: 'h2', text: 'House Type 2', points: 20 },
				{ value: 'h3', text: 'House Type 3', points: 3 },
			],
			Clinic: [
				{ value: 'c1', text: 'Clinic Type 1', points: 7 },
				{ value: 'c2', text: 'Clinic Type 2', points: 5 },
				{ value: 'c3', text: 'Clinic Type 3', points: 9 },
			],
			School: [
				{ value: 's1', text: 'School Type 1', points: 7 },
				{ value: 's2', text: 'School Type 2', points: 4 },
				{ value: 's3', text: 'School Type 3', points: 6 },
			]
		},
		record: {
			buildingConfidence: 'Very High',
			locationConfidence: 'Exact Location',
			website: ''
		},
		buildingConfidences: [
			'Very High', 'High', 'Middle', 'Low'
		].map(v => ({ text: v, value: v })),

		locationConfidences: [
			'Exact Location', 'Nearby', 'Neighbourhood'
		].map(v => ({ text: v, value: v })),

		visitedMenu: false,
		visitedAt: 'Sometime ago',
		visitedAtOther: null,
		visitOptions: [
			'Just Now!', 'Sometime ago',
			'Last 3 months', 'Last 6 months',
			'Last 12 months', 'Last 2 years',
			'Over 2 years ago'
		].map(v => ({ text: v, value: v })),
	}),
	created() {
		this.buildingType = this.types[this.type][0].value
	},
	watch: {
		visitedAt(v) { v && (this.visitedAtOther = null) },
		visitedAtOther(v) { v && (this.visitedAt = null) },
	},
	methods: {
		onSubmit() {
			this.$emit('submit', {
				...this.record,
				category: this.type,
				buildingType: this.buildingType,
				visitedAt: this.visitedAt || this.visitedAtOther,
				points: this.types[this.type].find(b => b.value === this.buildingType).points,
			})
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
					/* white-space: nowrap; */
				}
			}
		}
	}
</style>