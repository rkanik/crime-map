<template>
	<div ref="menu" class="menu">
		<slot name="toggler" :on="{ click: onClickToggler }">
			<button @click="onClickToggler">Click Me</button>
		</slot>
		<transition
			enter-class="menu__enter-from"
			enter-active-class="menu__enter-active"
			enter-to-class="menu__enter-to"
			leave-class="menu__leave-from"
			leave-active-class="menu__leave-active"
			leave-to-class="menu__leave-to"
		>
			<div
				v-if="value"
				:class="contentClass"
				class="menu__content"
				@click="closeOnContentClick && $emit('input', false)"
			>
				<slot />
			</div>
		</transition>
	</div>
</template>

<script>
export default {
	name: 'Menu',
	props: {
		contentClass: String,
		closeOnContentClick: {
			type: Boolean,
			default: true
		},
		value: {
			type: Boolean,
			required: true
		}
	},
	methods: {
		bind() {
			document.addEventListener('mousedown', this.onMouseDown)
		},
		unbind() {
			document.removeEventListener('mousedown', this.onMouseDown)
		},
		onMouseDown(e) {
			if (!this.value) return this.unbind()
			if (this.isClickedOutside(e, this.$refs.menu)) {
				this.$emit('input', false)
			}
		},
		onClickToggler() {
			!this.value ? this.bind() : this.unbind()
			this.$emit('input', !this.value)
		},
		isClickedOutside(event, el) {
			const path = event.path || (event.composedPath && event.composedPath())
			return path ? path.indexOf(el) < 0 : !el.contains(event.target)
		}
	}
}
</script>
<style lang="scss">
	.menu {
		position: relative;
		&__content {
			z-index: 10;
			min-width: 100%;
			position: absolute;
			transition-property: all;
		}
		&__leave-to,
		&__enter-from {
			opacity: 0;
			transform: translateY(4px);
		}
		&__enter-to,
		&__leave-from {
			opacity: 100;
			transform: translateY(0);
		}
		&__enter-active {
			transition-duration: 300ms;
			transition-timing-function: ease-out;
		}
		&__leave-active {
			transition-duration: 200ms;
			transition-timing-function: ease-in;
		}
	}
</style>