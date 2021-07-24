<template>
	<b-container class="tw-py-4 tw-flex-1 scrollbar-y">
		<h5 class="tw-mb-4 tw-text-2xl tw-font-bold">
			<span>Crime Summary</span>
			<span class="tw-text-base tw-font-normal">(for selected radius)</span>
		</h5>
		<div :key="crime.id" v-for="(crime,crimeIndex) in crimeCategories">
			<div
				:style="{ backgroundColor: crime.color }"
				class="tw-text-xl tw-font-semibold tw-px-2 tw-py-1"
				:class="[crimeIndex === 2 ?'tw-text-black':'tw-text-white']"
			>{{ crime.category }}</div>
			<div
				class="tw-pr-4 tw-py-4 tw-border-l tw-border-r tw-border-gray-200"
				:class="{'tw-border-b' : crimeIndex === crimeCategories.length - 1 }"
			>
				<apexchart type="bar" :options="getOptions(crime.id)" :series="getSeries(crime.id)"></apexchart>
				<div class="px-3">Total number of {{crime.category}} = {{getTotalNumber(crime.id)}}</div>
			</div>
		</div>
		<h5
			class="tw-mb-4 tw-text-lg tw-font-bold tw-bg-blue-500 tw-text-white tw-mt-3 tw-px-3 tw-py-1"
		>Grand Total: {{crimesInsideRadius.length}}</h5>
	</b-container>
</template>

<script>
import crimes from '@/data.json'
import { only } from '../helpers'
import { mapGetters } from 'vuex'
export default {
	name: 'CrimeSummary',
	computed: {
		...mapGetters('Map', ['$radius', '$circle']),
		...mapGetters('Records', ['$records']),
		crimeCategories() {
			return crimes.map(
				crime => only(crime, [
					'id', 'color', 'category'
				])
			)
		},
		crimesInsideRadius() {
			return this.$records.filter(rec => {
				return this.isInsideCircle(
					this.$circle.location,
					rec.latLng, this.$radius
				)
			})
		}
	},
	methods: {
		getTotalNumber(id) {
			return this.crimesInsideRadius.reduce(
				(total, c) => c.crime.id === id
					? total + 1
					: total,
				0
			)
		},
		getSeries(id) {
			return [{
				data: crimes
					.find(crime => crime.id === id).crimes
					.map(crime => {
						return this.crimesInsideRadius.reduce(
							(no, c) => c.crime.type === crime.type ? no + 1 : no,
							0
						)
					})
			}]
		},
		getOptions(id) {
			return {
				chart: {
					type: 'bar',
					toolbar: {
						show: false,
					}
				},
				legend: {
					show: false
				},
				colors: [
					'#1D7472', '#B64330', '#DCB62D', '#51B5B3',
					'#BD6355', '#E7CA5E', '#9CAA54'
				],
				plotOptions: {
					bar: {
						borderRadius: 6,
						horizontal: true,
						distributed: true
					}
				},
				dataLabels: {
					enabled: false
				},
				xaxis: {
					categories: crimes
						.find(crime => crime.id === id).crimes
						.map(c => c.type),
				}
			}
		},
		isInsideCircle(center, { lat, lng }, radius) {
			var ky = 40000 / 360;
			var kx = Math.cos(Math.PI * lat / 180.0) * ky;
			var dx = Math.abs(lng - center.lng) * kx;
			var dy = Math.abs(lat - center.lat) * ky;
			return Math.sqrt(dx * dx + dy * dy) <= (radius / 1000);
		},
	}
}
</script>
