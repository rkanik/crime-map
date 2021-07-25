<template>
	<div
		:style="{ height: appHeight + 'px' }"
		class="app tw-flex tw-flex-col tw-relative tw-max-w-3xl tw-mx-auto tw-w-full tw-overflow-hidden"
	>
		<div v-if="loading" class="tw-absolute tw-inset-0 tw-grid tw-place-items-center">
			<RotateSquare3 size="64px" />
		</div>
		<router-view v-else class="tw-flex-1" />

		<b-modal centered hide-footer hide-header v-model="subscribeModal">
			<div class="tw-font-medium tw-text-lg tw-text-center">
				Please subscribe to use this feature
				<div class="mt-3">
					<b-button variant="primary" size="sm">Subscribe now</b-button>
				</div>
			</div>
		</b-modal>
	</div>
</template>

<script>
import Auth from "@/firebase/auth"
import { mapActions, mapGetters } from 'vuex'
import { Crimes } from './firebase/init'
import RotateSquare3 from 'vue-loading-spinner/src/components/RotateSquare3.vue'
export default {
	name: 'App',
	components: {
		RotateSquare3
	},
	data: () => ({
		loading: false,
		appHeight: window.innerHeight
	}),
	created() {
		this.loading = true
		Auth.onStateChanged(user => {
			console.log('onStateChanged', user)

			this.$store.commit('Auth/SET', {
				user: user ? user : { id: null },
				isAuth: user ? true : false,
			})

			// Redirect to login if not logged in
			const requiresAuth = this.$route.matched.some(res => res.meta.requiresAuth)
			if (requiresAuth && !user && this.$route.name !== 'Login') this.$router.replace({ name: 'Login' })

			// Redirect to home if already logged on
			const redirectIsAuth = this.$route.matched.some(res => res.meta.redirectIsAuth)
			if (redirectIsAuth && user && this.$route.name !== 'Home') this.$router.replace({ name: 'Home' })

			if (user) {
				const isUser = user.role === 'user'

				// Confirmed crimes
				let confirmedCrimes = Crimes.where('confirmedBy', '!=', null)
				confirmedCrimes.get().then(this.onCrimesAdded)

				// UnConfirmed crimes
				let unConfirmedCrimes = Crimes.where('confirmedBy', '==', null)
				if (isUser) unConfirmedCrimes = unConfirmedCrimes.where('recordedBy', '==', user.id)
				unConfirmedCrimes.get().then(this.onCrimesAdded)

				// New crime added
				let newCrimes = Crimes.limit(1).orderBy('createdAt', 'desc')
				newCrimes.onSnapshot(snapShot => {
					if (snapShot.empty) return
					let [crime] = this.snapShotToArray(snapShot)
					if (isUser && crime.recordedBy !== user.id && !crime.confirmedAt) return
					if (this.isExist(crime)) return
					this.pushCrime(crime)
				})

				// On Confirmed
				Crimes.limit(1)
					.where('confirmedAt', '!=', null)
					.orderBy('confirmedAt', 'desc')
					.onSnapshot(snapShot => {
						if (snapShot.empty) return
						let [crime] = this.snapShotToArray(snapShot)
						console.log('confirmed', crime)
						this.updateCrime(crime)
					})
			}

			this.loading = false
		})
	},
	mounted() { window.addEventListener('resize', this.onResize) },
	beforeDestroy() { window.removeEventListener('resize', this.onResize) },
	computed: {
		...mapGetters(['$subscribeModal']),
		...mapGetters('Records', ['$records']),
		subscribeModal: {
			get() {
				return this.$subscribeModal
			},
			set(v) {
				this.toggleSubscribeModal(v)
			}
		}
	},
	methods: {
		...mapActions([
			'toggleSubscribeModal'
		]),
		...mapActions('Records', [
			'setRecords', 'pushCrime',
			'concatCrimes', 'updateCrime'
		]),
		onResize() {
			this.appHeight = window.innerHeight
		},
		snapShotToArray(snapShot) {
			let data = []
			snapShot.forEach(doc => {
				data.push({
					id: doc.id,
					ref: doc.ref,
					...doc.data()
				})
			})
			return data
		},
		isExist(crime) {
			return this.$records.some(
				crm => crm.id === crime.id
			)
		},
		onCrimesAdded(snapShot) {
			let crimes = this.snapShotToArray(snapShot)
			crimes = crimes.filter(crm => !this.isExist(crm))
			this.concatCrimes(crimes)
		}
	}
}
</script>