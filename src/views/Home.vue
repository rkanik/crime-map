<template>
	<div class="home-view tw-h-full tw-relative">
		<gmap-map
			:zoom="zoom"
			ref="mapRef"
			:center="mapCenter"
			:map-type-id="mapType"
			class="tw-h-full tw-w-full"
			@click="hideInfo"
			:style="{
				featureType: 'poi',
        elementType: 'labels',
        stylers: [
          { visibility: 'off' }
        ]
			}"
			:options="{
				zoomControl: false,
				mapTypeControl: false,
				scaleControl: false,
				streetViewControl: false,
				rotateControl: false,
				fullscreenControl: false,
				disableDefaultUi: true
			}"
		>
			<!-- Start Circle -->
			<gmap-circle
				:visible="true"
				:radius="radius"
				@click="hideInfo"
				:center="circle.location"
				:draggable="circle.draggable"
				@dragstart="hideInfo(),(circle.dot = true)"
				:options="{
					strokeColor:'#2196f3', strokeOpacity:'1',
					strokeWeight:'2', fillColor:'#2196f3', fillOpacity:'0.25',
				}"
				@drag="circle.location = latLngToNumber($event.latLng)"
			/>
			<gmap-marker
				v-if="circle.dot"
				:position="circle.location"
				:icon="require('@/assets/svg/dot.svg')"
			/>
			<!-- End Circle -->

			<!-- My Location -->
			<gmap-marker :position="myLocation" :icon="require('@/assets/svg/me-marker.svg')" />

			<!-- Record Markers -->
			<gmap-marker
				:clickable="true"
				:key="record.id"
				:position="record.latLng"
				v-for="record in recordsInsideCircle"
				@click="onClickRecordMarker(record)"
				:icon="require(`@/assets/svg/${record.category.toLowerCase()}-marker.svg`)"
			/>
		</gmap-map>

		<search-bar :map="map" :radius="radius" :center="circle.location" @place="onSelectPlace" />

		<map-types v-model="mapType" class="tw-absolute tw-right-3 tw-top-18" />

		<Menu v-model="radiusMenu" class="tw-absolute tw-left-3 tw-top-18">
			<template #toggler="{on}">
				<button
					v-on="on"
					class="tw-h-20 tw-w-12 tw-py-1 tw-rounded-md tw-transition-all tw-bg-blue-500 tw-bg-opacity-80 tw-text-white tw-shadow-md tw-justify-center tw-items-center tw-flex tw-flex-col"
				>
					<img src="@/assets/svg/radar.svg" class="tw-w-7 tw-h-7" />
					<div
						class="tw-text-sm tw-border-t tw-border-white tw-pt-1 tw-mt-2"
					>{{radiuses.find(r => r.value === radius).text}}</div>
				</button>
			</template>
			<div class="tw-left-0 tw-w-32 tw-mt-2 tw-bg-white tw-py-1 tw-shadow-md tw-rounded-md">
				<div
					:key="rad.value"
					v-for="(rad, radIndex) in radiuses"
					class="tw-px-5 tw-py-2 tw-text-sm tw-font-medium"
					@click="radius = rad.value"
					:class="[
						rad.value === radius
							?'tw-text-white tw-bg-blue-500'
							:'tw-bg-white tw-text-gray-600', {
							'tw-border-t tw-border-gray-200': radIndex
						}
					]"
				>{{rad.text}}</div>
			</div>
		</Menu>

		<div class="tw-absolute tw-bottom-4 tw-w-11 tw-right-3">
			<button
				@click="circle.draggable = !circle.draggable"
				class="tw-bg-opacity-80 tw-text-white tw-h-11 tw-w-11 tw-rounded-md tw-transition-all tw-shadow-md tw-grid tw-place-items-center tw-text-xl"
				:class="[circle.draggable?'tw-bg-blue-500':'tw-bg-gray-600']"
			>
				<b-icon icon="arrows-move"></b-icon>
			</button>
			<button
				@click="onClickCurrentLocation"
				class="tw-mt-2 tw-bg-blue-500 tw-bg-opacity-80 tw-text-white tw-h-11 tw-w-11 tw-rounded-md tw-transition-all tw-shadow-md tw-grid tw-place-items-center tw-text-xl"
			>
				<b-icon icon="geo-alt"></b-icon>
			</button>
			<div class="tw-w-11 tw-rounded-md tw-overflow-hidden tw-shadow-md tw-mt-2">
				<button
					@click="zoom > 1 && (zoom -= 1)"
					class="tw-h-11 tw-w-11 tw-bg-blue-500 tw-bg-opacity-80 tw-text-white tw-grid tw-place-items-center tw-text-2xl"
				>
					<b-icon icon="dash"></b-icon>
				</button>
				<hr class="tw-m-0 tw-border-gray-100" />
				<button
					@click="zoom < 24 && (zoom += 1)"
					class="tw-h-11 tw-w-11 tw-bg-blue-500 tw-bg-opacity-80 tw-text-white tw-grid tw-place-items-center tw-text-2xl"
				>
					<b-icon icon="plus"></b-icon>
				</button>
			</div>
			<button
				size="sm"
				variant="danger"
				v-b-modal.modal-record-building
				class="tw-h-11 tw-w-11 tw-rounded-md tw-transition-all tw-bg-red-500 tw-opacity-80 tw-text-white tw-mt-2 tw-shadow-md tw-grid tw-place-items-center"
			>
				<svg height="24" width="24" class="tw-transform tw-scale-75">
					<path d="M0 0h24v24H0V0z" fill="none" />
					<path
						fill="currentColor"
						d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"
					/>
				</svg>
				<!-- <span>Record</span> -->
			</button>
		</div>

		<CreateRecordDialog :createRecord="onCreateRecord" />

		<div
			class="tw-absolute tw-left-3 tw-text-sm tw-bottom-4 tw-bg-blue-500 tw-bg-opacity-80 tw-text-white tw-p-2 tw-rounded tw-shadow tw-w-1/2"
		>Total Points for Buildings in Scanned Area = {{totalPointsInsideCircle}}</div>
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import SearchBar from '@/components/SearchBar'
import CreateRecordDialog from '@/components/CreateRecordDialog'
import MapTypes from '../components/MapTypes.vue'
import Menu from '../components/utils/Menu.vue'
import { only } from '../helpers'

const iLatLng = () => ({ lat: 0, lng: 0 })

export default {
	name: 'Home',
	components: {
		Menu,
		SearchBar,
		CreateRecordDialog,
		MapTypes,
	},

	data: () => ({
		// NULLS
		map: null,
		infoWindow: null,
		currentMarker: null,
		myLocationInterval: null,

		// BOOLEANS
		radiusMenu: false,

		// STRINGS
		mapType: 'terrain',

		// NUMBERS
		zoom: 15,
		radius: 500,
		initialZoom: 15,
		initialRadius: 500,

		// ARRAYS
		markers: [],
		nearbyPlaces: [],
		radiuses: [
			{ value: 100, text: '100 M' },
			{ value: 200, text: '200 M' },
			{ value: 300, text: '300 M' },
			{ value: 500, text: '500 M' },
			{ value: 1000, text: '1 KM' },
			{ value: 2000, text: '2 KM' },
			{ value: 3000, text: '3 KM' },
			{ value: 5000, text: '5 KM' },
			{ value: 8000, text: '8 KM' },
			{ value: 10000, text: '10 KM' },
		],

		// OBJECTS
		myLocation: iLatLng(),
		mapCenter: iLatLng(),
		circle: {
			dot: false,
			draggable: false,
			location: iLatLng()
		},
		dialogs: {
			search: false
		},
	}),
	created() {
		this.updateMyLocation({ updateCircle: true })
		this.myLocationInterval = setInterval(() => {
			this.updateMyLocation()
		}, 2000);
	},
	beforeDestroy() {
		clearInterval(this.myLocationInterval)
	},
	mounted() {
		this.$refs.mapRef.$mapPromise.then(map => {
			this.map = map
			this.infoWindow = new window.google.maps.InfoWindow();
		})
	},
	computed: {
		...mapGetters('Auth', ['$user']),
		...mapGetters('Records', ['$records']),
		totalPointsInsideCircle() {
			return this.recordsInsideCircle.reduce(
				(total, rec) => total + rec.points, 0
			)
		},
		recordsInsideCircle() {
			return this.$records.filter(rec =>
				this.isInsideCircle(
					this.circle.location,
					rec.latLng, this.radius
				)
			)
		}
	},
	methods: {
		...mapActions('Records', ['createRecord', 'deleteRecord']),
		async onCreateRecord(record) {
			let res = await this.createRecord({
				...record, userId: this.$user.id,
				latLng: this.circle.location,
				createdAt: Date.now(),
				updatedAt: Date.now()
			})
			return res
		},
		hideInfo() {
			this.infoWindow.close()
		},
		onClickRecordMarker(record) {

			this.infoWindow.setContent(
				this.createRecordInfoWindow(record)
			);
			this.infoWindow.setPosition(record.latLng);
			this.infoWindow.setOptions({
				pixelOffset: new window.google.maps.Size(0, -28)
			});
			this.infoWindow.open(this.map);
		},
		isInsideCircle(center, { lat, lng }, radius) {
			var ky = 40000 / 360;
			var kx = Math.cos(Math.PI * lat / 180.0) * ky;
			var dx = Math.abs(lng - center.lng) * kx;
			var dy = Math.abs(lat - center.lat) * ky;
			return Math.sqrt(dx * dx + dy * dy) <= (radius / 1000);
		},
		latLngToNumber({ lat, lng }) {
			return { lat: lat(), lng: lng() }
		},
		onSelectPlace(e) {
			const latLng = this.latLngToNumber(e)

			this.circle.dot = true

			this.zoom = this.initialZoom
			this.map.setZoom(this.zoom)

			this.map.panTo(latLng);

			this.radius = this.initialRadius
			this.circle.location = { ...latLng }
			this.mapCenter = { ...latLng }
			this.hideInfo()
		},
		onDragCircle(e) {
			this.circle.location = this.latLngToNumber(e.latLng)
		},
		onClickCurrentLocation() {
			this.circle.dot = false
			this.zoom = this.initialZoom

			this.map.panTo(this.myLocation);
			this.map.setZoom(this.initialZoom)

			this.radius = this.initialRadius

			this.mapCenter = { ...this.myLocation }
			this.circle.location = { ...this.myLocation }

		},
		updateMyLocation({ updateCircle = false } = {}) {
			navigator.geolocation.getCurrentPosition(position => {
				this.myLocation = {
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				}
				if (updateCircle) this.mapCenter = this.circle.location = {
					...this.myLocation
				}
			})
		},
		createRecordInfoWindow(rec) {
			const div = document.createElement('div')
			const btn = document.createElement('button')

			btn.innerText = 'Delete'
			btn.style.cssText = `padding: 2px 8px`
			btn.classList.add('btn', 'btn-danger', 'btn-sm', 'm-1', 'mt-2')
			btn.addEventListener('click', async () => {
				await this.deleteRecord(only(rec, ['id', 'ref']))
				this.hideInfo()
			})

			div.innerHTML = `
				<div>Category: <strong>${rec.category}</strong></div>
				<div>${rec.category} Type: <strong>${rec.buildingType}</strong></div>
				<div>Points: <strong>${rec.points}</strong></div>
				<div>Confidence in this building: <strong>${rec.buildingConfidence}</strong></div>
				<div>Confidence in this location: <strong>${rec.locationConfidence}</strong></div>
				<div>DateTime: <strong>${rec.visitedAt}</strong></div>
				<div>Website: <strong>${rec.website}</strong></div>
				<div>Date of capture: <strong>${new Date(rec.createdAt).toLocaleString()}</strong></div>
			`
			div.appendChild(btn)
			return div
		}
	}
}
</script>