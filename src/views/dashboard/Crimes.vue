<template>
	<div>
		<div class="tw-flex tw-justify-between tw-items-center">
			<h4>Crimes</h4>
			<b-form-select
				size="sm"
				v-model="filterBy"
				:options="filterOptions"
				class="tw-border tw-border-gray-100 tw-rounded tw-px-4 tw-py-1"
			></b-form-select>
		</div>

		<div class="tw-space-y-3 tw-mt-3">
			<div :key="rec.id" v-for="rec in filterredCrimes">
				<div
					class="tw-p-4 tw-border tw-border-gray-300 tw-rounded tw-space-y-1"
					:class="{
						'tw-bg-red-100': rec.crime.id === crime.violent,
						'tw-bg-orange-100': rec.crime.id === crime.rough,
						'tw-bg-yellow-100': rec.crime.id === crime.nonViolent,
					}"
				>
					<div class="tw-flex tw-justify-between">
						<span>Category</span>
						<span
							class="px-3 tw-rounded tw-text-sm"
							:class="{
								'tw-bg-red-500 tw-text-white': rec.crime.id === crime.violent,
								'tw-bg-orange-500 tw-text-white': rec.crime.id === crime.rough,
								'tw-bg-yellow-500': rec.crime.id === crime.nonViolent,
							}"
						>{{rec.crime.category}}</span>
					</div>
					<div class="tw-flex tw-justify-between">
						<span>Crime type</span>
						<span>{{rec.crime.type}}</span>
					</div>
					<div class="tw-flex tw-justify-between">
						<span>Crime points</span>
						<span>{{rec.crime.points}}</span>
					</div>
					<div class="tw-flex tw-justify-between">
						<span>Confidence in this crime event</span>
						<span class="tw-capitalize">{{rec.crimeConfidence}}</span>
					</div>
					<div class="tw-flex tw-justify-between">
						<span>Confidence in crime location</span>
						<span class="tw-capitalize">{{rec.locationConfidence}}</span>
					</div>
					<div class="tw-flex tw-justify-between">
						<span>When did this crime happen?</span>
						<span>{{new Date(rec.createdAt).toLocaleString()}}</span>
					</div>
					<div class="tw-flex tw-justify-between">
						<span>Website link</span>
						<span>{{rec.website}}</span>
					</div>
					<div class="tw-flex tw-justify-between">
						<span>Approved</span>
						<span>{{rec.confirmedBy ? 'Yes' : 'No'}}</span>
					</div>
					<div v-if="!rec.confirmedBy">
						<div class="tw-mt-3">
							<b-button size="sm" @click="approve(rec)">Approve</b-button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { _crime } from '../../consts'
export default {
	name: 'Crimes',
	data: () => ({
		crime: _crime,
		filterBy: 'all',
		filterOptions: [
			{ value: 'all', text: 'All Crimes' },
			{ value: 1, text: 'Violent Crimes' },
			{ value: 2, text: 'Rough Crimes' },
			{ value: 3, text: 'Non-Violent Crimes' },
			{ value: 'not-approved', text: 'Not approved' },
		]
	}),
	computed: {
		...mapGetters('Auth', ['$user']),
		...mapGetters('Users', ['$users']),
		...mapGetters('Records', ['$records']),
		filterredCrimes() {
			if (this.filterBy === 'all') return this.$records
			if (this.filterBy === 'not-approved') return this.$records.filter(r => !r.confirmedBy)
			return this.$records.filter(rec => rec.crime.id === this.filterBy)
		}
	},
	methods: {
		giveSubscription(user) {
			user.ref.update({
				isSubscribed: true
			})
		},
		async approve(rec) {
			await rec.ref.update({
				updatedAt: Date.now(),
				confirmedAt: Date.now(),
				confirmedBy: this.$user.id,
			})
		}
	}
}
</script>