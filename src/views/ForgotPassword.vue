<template>
	<div>
		<form @submit.prevent="resetPassword">
			<p>
				Back to Login
				<router-link :to="{ name: 'Login' }">Login</router-link>
			</p>
			<h1>Reset Password</h1>
			<div class="form-group">
				<label for>Email</label>
				<input type="email" v-model="email" class="form-control" placeholder="Email" required />
			</div>
			<br />
			<button class="btn btn-primary" :disabled="processing">Reset Password</button>
		</form>
	</div>
</template>

<script>
import { Auth } from '../firebase/init'
export default {
	name: 'ForgotPassword',
	data() {
		return {
			email: '',
			processing: false,
		}
	},
	methods: {
		async resetPassword() {
			this.processing = true
			try {
				await Auth.sendPasswordResetEmail(this.email)
				alert("Check your email inbox to reset your password.")
				this.$router.push({ name: 'Login' })
			} catch (error) {
				console.log(error)
			}
			this.processing = false
		}
	}
}
</script>

<style lang="scss" scoped>
</style>