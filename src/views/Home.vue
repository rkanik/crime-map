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
				@dragstart="onCircleDragStart"
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
				v-for="record in mappedCrimes"
				@click="onClickRecordMarker(record)"
				:icon="record.confirmedBy
					? (record.isInside
						? require(`@/assets/svg/${record.crime.id}-marker.svg`)
						:	require(`@/assets/svg/black-marker.svg`)
					) : require(`@/assets/svg/not-confirmed.svg`)
				"
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
					@click="onChangeRadius(rad.value)"
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

		<div class="tw-absolute tw-bottom-20 tw-w-11 tw-left-3">
			<Menu v-if="psi" v-model="psiMenu" contentClass="tw-left-full tw-bottom-full">
				<template #toggler="{on}">
					<button
						v-on="on"
						v-if="$isSubscribed"
						class="tw-h-12 tw-w-12 tw-grid tw-place-items-center tw-rounded-md tw-bg-blue-500 tw-bg-opacity-80 tw-text-white tw-shadow-md"
					>PSI</button>
					<button
						v-else
						@click="toggleSubscribeModal(true)"
						class="tw-h-12 tw-w-12 tw-grid tw-place-items-center tw-rounded-md tw-bg-blue-500 tw-bg-opacity-80 tw-text-white tw-shadow-md"
					>PSI</button>
				</template>
				<div class="tw-w-52 tw-bg-white tw-px-2 tw-py-1 tw-rounded">
					<div class="tw-bg-white tw-p-2 tw-text-sm">
						<div :key="i" v-for="(p,i) in psi">
							{{p.category}}:
							<span class="tw-font-medium">{{p.psi}}</span>
						</div>
					</div>
				</div>
			</Menu>
			<button
				@click="toggleCircleDraggable"
				class="tw-mt-2 tw-bg-opacity-80 tw-text-white tw-h-11 tw-w-11 tw-rounded-md tw-transition-all tw-shadow-md tw-grid tw-place-items-center tw-text-xl"
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
		</div>

		<div class="tw-absolute tw-bottom-20 tw-w-11 tw-right-3">
			<div class="tw-w-11 tw-rounded-md tw-overflow-hidden tw-shadow-md tw-mt-2">
				<button
					@click="zoom > 1 && (zoom -= 1)"
					class="tw-bg-blue-500 tw-bg-opacity-80 tw-text-white tw-h-11 tw-w-11 tw-rounded-md tw-transition-all tw-shadow-md tw-grid tw-place-items-center tw-text-2xl"
				>
					<b-icon icon="dash"></b-icon>
				</button>
				<button
					@click="zoom < 24 && (zoom += 1)"
					class="tw-mt-2 tw-bg-blue-500 tw-bg-opacity-80 tw-text-white tw-h-11 tw-w-11 tw-rounded-md tw-transition-all tw-shadow-md tw-grid tw-place-items-center tw-text-2xl"
				>
					<b-icon icon="plus"></b-icon>
				</button>
			</div>
		</div>

		<div class="tw-absolute tw-inset-x-3 tw-bottom-5 tw-flex tw-justify-center tw-space-x-3">
			<button
				size="sm"
				variant="danger"
				v-b-modal.modal-record-crime
				class="tw-whitespace-nowrap tw-flex-none tw-h-11 tw-w-11 tw-rounded-md tw-transition-all tw-bg-red-500 tw-opacity-80 tw-text-white tw-shadow-md tw-grid tw-place-items-center"
			>
				<svg height="24" width="24" class="tw-transform tw-scale-75">
					<path d="M0 0h24v24H0V0z" fill="none" />
					<path
						fill="currentColor"
						d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"
					/>
				</svg>
			</button>
			<div
				class="tw-text-sm tw-bg-blue-500 tw-flex tw-items-center tw-whitespace-nowrap tw-bg-opacity-80 tw-text-white tw-px-3 tw-rounded tw-shadow"
			>Total crime points in radius = {{pointsInsideCircle}}</div>
		</div>

		<CreateRecordDialog :createRecord="onCreateRecord" />
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import SearchBar from '@/components/SearchBar'
import CreateRecordDialog from '@/components/CreateRecordDialog'
import MapTypes from '../components/MapTypes.vue'
import Menu from '../components/utils/Menu.vue'
import { only } from '../helpers'
import { _nigeriaBounds, _time } from '../consts'
import crimes from '@/data.json'

const initialZoom = 13
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
		psiMenu: false,

		// STRINGS
		mapType: 'roadmap',

		// NUMBERS
		zoom: initialZoom,

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
		dialogs: {
			search: false
		},
	}),
	created() {
		this.updateMyLocation({
			updateCircle: !this.circle.location.lat
		})
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
			this.map.setRestriction({
				latLngBounds: _nigeriaBounds,
				strictBounds: false,
			})
			this.infoWindow = new window.google.maps.InfoWindow();
		})
	},
	computed: {
		...mapGetters('Auth', ['$user', '$isSubscribed']),
		...mapGetters('Records', ['$records']),
		...mapGetters('Map', ['$radius', '$circle']),
		radius: {
			get() { return this.$radius },
			set(v) { this.setRadius(v) }
		},
		circle: {
			get() { return this.$circle },
			set(v) { this.setCircle(v) }
		},
		isAdmin() {
			return this.$user.role === 'admin'
		},
		psi() {
			if (this.radius !== 2000) return null
			let cats = this.insideCrimes
				.filter(crm => (+crm.createdAt + _time.month) > Date.now())
				.reduce((cats, crm) => {
					cats[crm.crime.id] += crm.crime.points
					return cats
				}, { 1: 0, 2: 0, 3: 0 })

			cats = Object.entries(cats).map(([id, count]) => {
				let crime = crimes.find(c => c.id == id)
				return {
					category: `PSI-${crime.category[0].toUpperCase()} (${crime.category.split(' ')[0]})`,
					psi: (count / this.getTotalPointsOf(id)).toFixed(2)
				}
			})

			return cats
		},
		pointsInsideCircle() {
			return this.insideCrimes
				.reduce((total, rec) => total + rec.crime.points, 0)
		},
		insideCrimes() {
			return this.mappedCrimes
				.filter(crime => crime.isInside)
		},
		mappedCrimes() {
			return this.$records.map(rec => ({
				...rec, isInside: this.isInsideCircle(
					this.circle.location,
					rec.latLng, this.radius
				)
			}))
		}
	},
	methods: {
		...mapActions(['toggleSubscribeModal']),
		...mapActions('Map', [
			'setCircle',
			'setRadius',
			'resetRadius',
		]),
		...mapActions('Records', [
			'createRecord',
			'deleteRecord',
			'updateCrime'
		]),
		async onCreateRecord(record) {
			let res = await this.createRecord({
				...record,
				recordedBy: this.$user.id,
				latLng: this.circle.location,
				possibleDuplication: false,
				confirmedAt: this.isAdmin ? Date.now() : null,
				confirmedBy: this.isAdmin ? this.$user.id : null,
				createdAt: Date.now(),
				updatedAt: Date.now(),
			})
			return res
		},
		onChangeRadius(value) {
			if (!this.$isSubscribed && value > 2000) {
				return this.toggleSubscribeModal(true)
			}
			this.radius = value
		},
		toggleCircleDraggable() {
			this.circle = {
				...this.circle,
				draggable: !this.circle.draggable
			}
		},
		onCircleDragStart() {
			this.hideInfo()
			this.circle = {
				...this.circle,
				dot: true
			}
		},
		getTotalPointsOf(categoryId) {
			return crimes
				.find(cat => cat.id == categoryId).crimes
				.reduce((total, crime) => total + crime.points, 0)
		},
		hideInfo() {
			this.infoWindow.close()
			this.radiusMenu = false
			this.psiMenu = false
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


			this.zoom = initialZoom
			this.map.setZoom(this.zoom)

			this.map.panTo(latLng);

			this.resetRadius()

			this.circle = {
				...this.circle, dot: true,
				location: { ...latLng }
			}
			this.mapCenter = { ...latLng }
			this.hideInfo()
		},
		onClickCurrentLocation() {
			this.zoom = initialZoom

			this.map.panTo(this.myLocation);
			this.map.setZoom(initialZoom)

			this.resetRadius()

			this.mapCenter = { ...this.myLocation }
			this.circle = {
				...this.circle, dot: false,
				location: { ...this.myLocation }
			}

		},
		updateMyLocation({ updateCircle = false } = {}) {
			navigator.geolocation.getCurrentPosition(position => {
				this.myLocation = {
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				}
				this.mapCenter = { ...this.circle.location }
				if (updateCircle) {
					this.circle = {
						...this.circle,
						location: this.myLocation
					}
				}
			})
		},
		createRecordInfoWindow(rec) {
			const div = document.createElement('div')

			let btn, notConfirmed
			const canDelete = this.isAdmin || this.$user.id === rec.recordedBy
			if (canDelete) {
				// Delete button
				btn = document.createElement('button')
				btn.innerText = 'Delete'
				btn.style.cssText = `padding: 2px 8px`
				btn.classList.add('btn', 'btn-danger', 'btn-sm', 'm-1')
				btn.addEventListener('click', async () => {
					await this.deleteRecord(only(rec, ['id', 'ref']))
					this.hideInfo()
				})
			}
			if (this.$user.id === rec.recordedBy && !rec.confirmedBy) {
				notConfirmed = `
					<p class='tw-text-sm tw-text-red-500 tw-ml-3 tw-mb-0 tw-leading-9'>Not confirmed yet</p>
				`
			}

			// Wrapper
			const wrapper = document.createElement('div')
			wrapper.classList.add('mt-2', 'tw-flex', 'tw-space-x-2')

			if (this.isAdmin && !rec.confirmedBy) {
				// Approve button
				const approveButton = document.createElement('button')
				approveButton.innerText = 'Approve'
				approveButton.style.cssText = `padding: 2px 8px`
				approveButton.classList.add('btn', 'btn-primary', 'btn-sm', 'm-1')
				approveButton.addEventListener('click', async () => {
					const update = {
						updatedAt: Date.now(),
						confirmedAt: Date.now(),
						confirmedBy: this.$user.id,
					}
					await rec.ref.update(update)
					this.onClickRecordMarker({ ...rec, ...update })
				})
				wrapper.appendChild(approveButton)
			}

			canDelete && wrapper.appendChild(btn)
			notConfirmed && (wrapper.innerHTML += notConfirmed)

			if (rec.isInside) div.innerHTML = `
				<div>Category: <strong>${rec.crime.category}</strong></div>
				<div>Type of crime: <strong>${rec.crime.type}</strong></div>
				<div>Crime points: <strong>${rec.crime.points}</strong></div>
				<div>Confidence in this crime event: <strong>${rec.crimeConfidence}</strong></div>
				<div>Confidence in crime location: <strong>${rec.locationConfidence}</strong></div>
				<div>When did this crime happen?: <strong>${new Date(rec.createdAt).toLocaleString()}</strong></div>
				<div>Website link: <strong>${rec.website}</strong></div>
			`
			else div.innerHTML = `
				${!rec.confirmedBy ? "<div class='tw-text-sm tw-text-red-500 tw-mb-0'>Not confirmed yet</div>" : ""}
				<div>Please drag circle here to ${this.isAdmin ? "review this crime" : "see details of this crime"}</div>
			`

			if (rec.isInside && (this.isAdmin || canDelete)) div.appendChild(wrapper)
			return div
		}
	}
}
</script>