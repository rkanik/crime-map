<template>
	<div
		class="tw-absolute tw-overflow-hidden tw-bg-transparent tw-h-16 tw-top-0 tw-inset-x-0 tw-transition-all tw-duration-200 tw-z-50 tw-flex tw-flex-col"
		:class="[
			expanded
					?'tw-h-screen tw-ease-in tw-py-0 tw-px-0 tw-bg-white'
					:'tw-py-2 tw-ease-out tw-px-4'
			]"
	>
		<div
			:class="[expanded ?	'tw-shadow tw-h-16' : 'tw-rounded-full tw-shadow-md']"
			class="tw-justify-between tw-bg-white tw-flex tw-items-center tw-transition-all tw-duration-200 tw-px-4 tw-h-12"
		>
			<div class="tw-flex tw-flex-1 tw-space-x-2 tw-items-center">
				<b-icon
					v-if="expanded"
					@click="onGoBack"
					class="tw-text-3xl tw-text-gray-700 tw-cursor-pointer"
					icon="arrow-left-short"
				></b-icon>
				<img v-else src="@/assets/svg/google-maps.svg" class="tw-h-6 tw-w-7 tw-flex-none" />
				<input
					type="text"
					@focus="onExpanded"
					placeholder="Search here"
					v-model="search.keyword"
					@input="onInputKeyword"
					class="tw-text-base tw-text-gray-700 tw-w-full tw-bg-transparent tw-h-12 focus:tw-outline-none"
				/>
			</div>
			<!-- <router-link v-if="!expanded" to="/profile">
				<img
					class="tw-rounded-full tw-w-7 tw-h-7"
					:src="($user && $user.photoURL)||require('@/assets/img/avatar.jpg')"
					:alt="$user ? $user.displayName : 'Profile avatar'"
				/>
			</router-link>-->
			<router-link v-if="!expanded && $user.role === 'admin'" to="/admin">
				<svg
					height="16"
					width="16"
					xmlns="http://www.w3.org/2000/svg"
					fill="currentColor"
					class="bi bi-grid"
					viewBox="0 0 16 16"
				>
					<path
						d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"
					/>
				</svg>
			</router-link>
		</div>

		<template v-if="expanded && search.places.length">
			<div class="tw-flex-1 scrollbar-y tw-py-2">
				<search-list-item
					:key="placeIndex"
					:icon="place.icon"
					:name="place.name"
					:border="placeIndex > 0"
					:address="place.formatted_address"
					@click="onClickSearchListItem(place)"
					v-for="(place, placeIndex) in search.places"
				/>
			</div>
		</template>

		<template v-if="expanded && !search.places.length && nearby.places.length">
			<subheader>Nearby places</subheader>
			<div class="tw-overflow-y-auto scrollbar-y">
				<search-list-item
					:key="placeIndex"
					:icon="place.icon"
					:name="place.name"
					:border="placeIndex > 0"
					:address="place.vicinity"
					@click="onClickSearchListItem(place)"
					v-for="(place, placeIndex) in nearby.places.slice(0, 8)"
				/>
			</div>
		</template>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { sleep } from '../helpers'
import { searchPlaces } from '../gapis/places'
import { fetchNearbyLocations } from '../gapis/nearby'

import SearchListItem from './SearchListItem.vue'
import Subheader from './utils/Subheader.vue'

export default {
	name: 'SearchBar',
	components: { SearchListItem, Subheader },
	props: {
		map: Object,
		radius: [String, Number],
		center: {
			lat: [String, Number],
			lng: [String, Number],
		}
	},
	data: () => ({
		expanded: false,
		search: {
			keyword: '',
			loading: '',
			timeout: null,
			places: [],
		},
		nearby: {
			places: [],
			loading: false,
			request: {
				lat: null,
				lng: null,
				radius: null,
			},
			types: [
				'doctor', 'hospital', 'school',
				'primary_school', 'university'
			],
		},
	}),
	computed: {
		...mapGetters('Auth', ['$user']),
		centerRadius() {
			return { ...this.center, radius: this.radius }
		},
		isSameRequest() {
			return (
				JSON.stringify(this.nearby.request) ===
				JSON.stringify(this.centerRadius)
			)
		}
	},
	methods: {
		onClickSearchListItem(place) {
			this.$emit('place', place.geometry.location)
			this.onGoBack()
		},
		onGoBack() {
			this.expanded = false
			this.search = {
				...this.search,
				keyword: '', places: []
			}
		},
		async onInputKeyword() {
			if (this.search.timeout) return

			this.search.timeout = true
			await sleep(500)
			this.search.timeout = null

			this.search.loading = true
			this.search.places = await searchPlaces(
				this.map, this.center.lat, this.center.lng,
				this.radius, this.search.keyword
			)
			this.search.loading = false
		},
		async onExpanded() {
			this.expanded = true
			if (this.isSameRequest) return
			this.nearby.places = await fetchNearbyLocations(
				this.map, this.center.lat, this.center.lng,
				this.radius, this.nearby.types
			)
			this.nearby.request = { ...this.centerRadius }
		}
	}
}
</script>