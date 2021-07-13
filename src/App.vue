<template>
	<div
		:style="{ height: appHeight + 'px' }"
		class="app tw-flex tw-flex-col tw-relative tw-max-w-3xl tw-mx-auto tw-w-full tw-overflow-hidden"
	>
		<div v-if="loading" class="tw-absolute tw-inset-0 tw-grid tw-place-items-center">
			<RotateSquare3 size="64px" />
		</div>
		<router-view v-else class="tw-flex-1" />
	</div>
</template>

<script>
import Auth from "@/firebase/auth"
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

			this.$store.commit('Auth/SET', {
				user: user ? user : { id: null },
				isAuth: user ? true : false,
			})

			if (user) {
				this.$store.dispatch('Records/getRecords', ['userId', '==', user.id])
			}

			// Redirect to login if not logged in
			const requiresAuth = this.$route.matched.some(res => res.meta.requiresAuth)
			if (requiresAuth && !user && this.$route.name !== 'Login') this.$router.replace({ name: 'Login' })

			// Redirect to home if already logged on
			const redirectIsAuth = this.$route.matched.some(res => res.meta.redirectIsAuth)
			if (redirectIsAuth && user && this.$route.name !== 'Home') this.$router.replace({ name: 'Home' })

			this.loading = false
		})
	},
	mounted() { window.addEventListener('resize', this.onResize) },
	beforeDestroy() { window.removeEventListener('resize', this.onResize) },
	methods: {
		onResize() {
			this.appHeight = window.innerHeight
		}
	}
}
</script>