<template>
	<b-modal hide-footer id="modal-record-building" title="Record Building">
		<div
			v-if="loading"
			class="tw-absolute tw-z-10 tw-inset-0 tw-grid tw-place-items-center tw-bg-white tw-bg-opacity-60"
		>
			<DoubleBounce />
		</div>

		<div class="accordion" role="tablist">
			<b-button
				variant="danger"
				v-b-toggle.house-accordion
				class="tw-block tw-w-full tw-text-white tw-text-sm tw-text-left tw-uppercase tw-tracking-wider"
			>House</b-button>
			<b-collapse id="house-accordion" visible accordion="record-accordion" role="tabpanel">
				<b-card-body class="tw-px-1">
					<record-form type="House" @submit="onSubmit" />
				</b-card-body>
			</b-collapse>

			<b-button
				v-b-toggle.clinic-accordion
				class="tw-block tw-w-full tw-bg-orange-500 tw-border-orange-500 tw-text-white tw-mt-4 tw-text-sm tw-text-left tw-uppercase tw-tracking-wider"
			>Clinic</b-button>
			<b-collapse id="clinic-accordion" accordion="record-accordion" role="tabpanel">
				<b-card-body>
					<b-card-text>
						<record-form type="Clinic" @submit="onSubmit" />
					</b-card-text>
				</b-card-body>
			</b-collapse>

			<b-button
				v-b-toggle.school-accordion
				class="tw-block tw-w-full tw-mt-4 tw-bg-yellow-400 tw-border-yellow-400 tw-text-white tw-text-sm tw-text-left tw-uppercase tw-tracking-wider"
			>School</b-button>
			<b-collapse id="school-accordion" accordion="record-accordion" role="tabpanel">
				<b-card-body>
					<b-card-text>
						<record-form type="School" @submit="onSubmit" />
					</b-card-text>
				</b-card-body>
			</b-collapse>
		</div>
	</b-modal>
</template>

<script>
import { DoubleBounce } from 'vue-loading-spinner'
import RecordForm from './RecordForm.vue'

export default {
	name: 'CreateRecordDialog',
	components: {
		DoubleBounce,
		RecordForm
	},
	props: {
		createRecord: Function
	},
	data() {
		return {
			error: null,
			loading: false,
		}
	},
	computed: {
		categories() {
			return this.$store.state.categories
		}
	},
	methods: {
		async onSubmit(record) {
			this.loading = true
			let res = await this.createRecord(record)
			if (res.err) {
				console.log(res.err)
				this.error = res.err.message
			}
			else this.$bvModal.hide('modal-record-building')
			this.loading = false
		}
	}
}
</script>