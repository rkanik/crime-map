<template>
	<div>
		<form action @submit.prevent="onSignIn">
			<p>
				Don't have an account?
				<router-link :to="{ name: 'Register' }">Register</router-link>
			</p>
			<h2>Login</h2>
			<p v-if="error" class="alert alert-danger" role="alert">{{ error }}</p>
			<div class="form-group">
				<label for>Email</label>
				<input type="email" v-model="email" class="form-control" placeholder="Email" required />
			</div>
			<br />
			<div class="form-group">
				<label for>Password</label>
				<input type="password" v-model="password" class="form-control" placeholder="Password" required />
			</div>
			<br />
			<button class="btn btn-primary" :disabled="processing">Sign In</button>
		</form>
	</div>
</template>

<script>
import { mapActions } from 'vuex'
// import firebase from "firebase/app"
// import "firebase/auth"

export default {
	name: 'Login',
	data() {
		return {
			email: '',
			password: '',
			processing: false,
			error: '',
		}
	},
	methods: {
		...mapActions('Auth', ['signInUser']),
		async onSignIn() {
			let { err } = await this.signInUser({
				email: this.email,
				password: this.password
			})
			if (err) this.error = err.message
			this.processing = false
		}
	}
}
</script>