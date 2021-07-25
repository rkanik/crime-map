<template>
	<div class="Users">
		<div class="tw-flex tw-justify-between tw-items-center">
			<h4>Users</h4>
			<b-form-select
				size="sm"
				v-model="filterBy"
				:options="filterOptions"
				class="tw-border tw-border-gray-100 tw-rounded tw-px-4 tw-py-1"
			></b-form-select>
		</div>

		<div class="tw-space-y-3 tw-mt-3">
			<div :key="user.id" v-for="user in filterredUsers">
				<div class="tw-p-4 tw-border tw-border-gray-300 tw-rounded tw-space-y-1">
					<div class="tw-flex tw-justify-between">
						<span>Name</span>
						<span>{{user.name}}</span>
					</div>
					<div class="tw-flex tw-justify-between">
						<span>Email Address</span>
						<span>{{user.email}}</span>
					</div>
					<div class="tw-flex tw-justify-between">
						<span>Date of birth</span>
						<span>{{user.dob}}</span>
					</div>
					<div class="tw-flex tw-justify-between">
						<span>Gender</span>
						<span class="tw-capitalize">{{user.gender}}</span>
					</div>
					<div class="tw-flex tw-justify-between">
						<span>Role</span>
						<span class="tw-capitalize">{{user.role}}</span>
					</div>
					<div class="tw-flex tw-justify-between">
						<span>Phone number</span>
						<span>{{user.phoneNumber}}</span>
					</div>
					<div class="tw-flex tw-justify-between">
						<span>Home Address</span>
						<span>{{user.homeAddress}}</span>
					</div>
					<div class="tw-flex tw-justify-between">
						<span>Subscribed</span>
						<span>{{(user.isSubscribed || user.role === 'admin') ? 'Yes' : 'No'}}</span>
					</div>
					<div v-if="user.role==='user' && !user.isSubscribed">
						<div class="tw-mt-3">
							<b-button size="sm" @click="giveSubscription(user)">Give subscription</b-button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
	name: 'Users',
	data: () => ({
		filterBy: 'all',
		filterOptions: [
			{ value: 'all', text: 'All Users' },
			{ value: 'user', text: 'Only Users' },
			{ value: 'admin', text: 'Only Admins' },
		]
	}),
	computed: {
		...mapGetters('Users', ['$users']),
		filterredUsers() {
			if (this.filterBy === 'all') return this.$users
			return this.$users.filter(user => user.role === this.filterBy)
		}
	},
	methods: {
		giveSubscription(user) {
			user.ref.update({
				isSubscribed: true
			})
		}
	}
}
</script>