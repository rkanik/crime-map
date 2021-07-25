<template>
	<div class="tw-flex tw-flex-col tw-overflow-hidden">
		<b-navbar toggleable="lg" type="dark" variant="info" class="px-3 tw-flex-none">
			<b-navbar-brand href="#">Admin</b-navbar-brand>
			<b-navbar-toggle target="nav-collapse" class="p-0"></b-navbar-toggle>
			<b-collapse id="nav-collapse" is-nav>
				<b-navbar-nav>
					<b-nav-item @click="goto('/home')">Map</b-nav-item>
					<b-nav-item @click="goto('/admin/crimes')">Crimes</b-nav-item>
					<b-nav-item @click="goto('/admin/users')">Users</b-nav-item>
				</b-navbar-nav>
			</b-collapse>
		</b-navbar>

		<main class="p-3 tw-flex-1 scrollbar-y">
			<router-view />
		</main>
	</div>
</template>

<script>
import { mapActions } from 'vuex'
import { Users } from '../firebase/init'
import { snapShotToArray } from '../helpers'
export default {
	name: 'DashboardLayout',
	created() {
		Users
			.limit(50)
			.orderBy('createdAt', 'desc')
			.onSnapshot(snapshot => {
				this.setUsers(
					snapShotToArray(snapshot)
				)
			})
	},
	methods: {
		...mapActions('Users', ['setUsers']),
		goto(path) {
			this.$router.push(path)
		}
	},
}
</script>