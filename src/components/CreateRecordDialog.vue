<template>
	<b-modal hide-footer id="modal-record-crime" title="Record Crime: Select one from below">
		<div
			v-if="loading"
			class="tw-absolute tw-z-10 tw-inset-0 tw-grid tw-place-items-center tw-bg-white tw-bg-opacity-60"
		>
			<DoubleBounce />
		</div>

		<div v-for="(crm, i) in crimes" :key="crm.id" :class="{'tw-mt-3':i}">
			<h4
				class="tw-text-base tw-px-3 tw-py-0.5 tw-rounded"
				:class="{
					'tw-bg-red-500 tw-text-white': crm.id === crime.violent,
					'tw-bg-orange-500 tw-text-white': crm.id === crime.rough,
					'tw-bg-yellow-500': crm.id === crime.nonViolent,
				}"
			>{{crm.category}}</h4>
			<div class="tw-grid tw-grid-cols-2 tw-gap-1 tw-mt-2">
				<div
					:key="j"
					v-for="(subCrime, j) in crm.crimes"
					class="tw-pb-1 tw-px-2 tw-rounded"
					:class="{
						'tw-bg-red-100': crm.id === crime.violent,
						'tw-bg-orange-100': crm.id === crime.rough,
						'tw-bg-yellow-100': crm.id === crime.nonViolent,
					}"
				>
					<check-box
						:color="crm.color"
						:label="subCrime.type"
						:value="subCrime.type === record.crime.type"
						@input="onInputCrime(crm, subCrime)"
					/>
				</div>
			</div>
		</div>

		<div class="mt-4 tw-px-1">
			<record-form type="Crime" :error="error" @error="error=$event" @submit="onSubmit" />
		</div>
	</b-modal>
</template>

<script>
import { _crime } from '../consts'
import { DoubleBounce } from 'vue-loading-spinner'

import crimes from '@/data.json'
import CheckBox from './utils/CheckBox.vue'
import RecordForm from './RecordForm.vue'

export default {
	name: 'CreateRecordDialog',
	components: {
		CheckBox,
		DoubleBounce,
		RecordForm
	},
	props: {
		createRecord: Function
	},
	data() {
		return {
			crimes,
			error: '',
			crime: _crime,
			loading: false,
			record: {
				crime: {
					type: '',
					category: '',
					points: 0
				}
			}
		}
	},
	computed: {
		categories() {
			return this.$store.state.categories
		}
	},
	methods: {
		onInputCrime({ id, category }, { type, points }) {
			this.record.crime = {
				id, type, category, points
			}
			this.error = ''
		},
		async onSubmit(record) {

			if (!this.record.crime.category) {
				return (this.error = 'You must have to select a crime type.')
			}
			else this.error = ''

			this.loading = true
			let res = await this.createRecord({
				...record,
				...this.record
			})
			if (res.err) {
				console.log(res.err)
				this.error = res.err.message
			}
			else this.$bvModal.hide('modal-record-crime')
			this.loading = false
		}
	}
}
</script>
<style lang="scss">
	#modal-record-crime {
		h5.modal-title {
			font-size: 18px;
			max-width: 220px;
			line-height: 1.25;
		}
		button.close[aria-label="Close"] {
			font-size: 32px;
		}
	}
</style>