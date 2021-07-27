<template>
	<div>
		<form @submit.prevent="onRegister">
			<p>
				Already have an account?
				<router-link :to="{ name: 'Login' }">Login</router-link>
			</p>
			<h2>Register</h2>
			<p v-if="error" class="alert alert-danger" role="alert">{{ error }}</p>
			<div class="form-group">
				<label for>Name</label>
				<input type="text" v-model="user.name" class="form-control" placeholder="Name" required />
			</div>
			<br />
			<!-- <div class="form-group">
				<label for>Age</label>
				<input type="text" v-model="user.age" class="form-control" placeholder="Age" required />
			</div>-->
			<div class="form-group">
				<label for>Date of Birth</label>
				<b-form-datepicker required locale="en" v-model="user.dob"></b-form-datepicker>
				<!-- min="2010-07-01" -->
			</div>
			<br />
			<div class="form-group">
				<label for>Gender</label>
				<select name="gender" id="gender" v-model="user.gender" class="form-control">
					<option value>Select Gender</option>
					<option value="male">Male</option>
					<option value="female">Female</option>
				</select>
			</div>
			<br />
			<div class="form-group">
				<label for>Phone Number</label>
				<input
					type="text"
					v-model="user.phoneNumber"
					class="form-control"
					placeholder="Phone Number"
					required
				/>
			</div>
			<br />
			<div class="form-group">
				<label for>Email</label>
				<input type="email" v-model="user.email" class="form-control" placeholder="Email" required />
			</div>
			<br />
			<div class="form-group">
				<label for>Home Address</label>
				<textarea class="form-control" v-model="user.homeAddress" placeholder="Home Address" rows="5"></textarea>
			</div>
			<br />
			<div class="form-group">
				<label for>Password</label>
				<input
					type="password"
					v-model="user.password"
					class="form-control"
					placeholder="Password"
					required
				/>
			</div>
			<br />
			<button class="btn btn-primary">Sign In</button>
		</form>
	</div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
	name: 'Register',
	data() {
		return {
			user: {
				name: '',
				gender: '',
				phoneNumber: '',
				email: '',
				dob: '',
				role: 'user',
				homeAddress: '',
				password: '',
			},
			processing: false,
			error: '',
		}
	},
	methods: {
		...mapActions('Auth', ['registerUser']),
		async onRegister() {
			this.processing = true
			let { err } = await this.registerUser({
				...this.user,
				createdAt: Date.now(),
				updatedAt: Date.now()
			})
			console.log('onRegister', err)
			this.processing = false
		}
	}
}
</script>