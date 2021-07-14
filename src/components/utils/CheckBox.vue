<template>
	<label class="util-checkbox path tw-flex tw-items-start" :style="`--border-active: ${color}`">
		<div :class="{ 'mt-1': label }">
			<input type="checkbox" v-model="vModel" />
			<svg viewBox="0 0 21 21" :class="{ 'tw-mt-1': label }">
				<path
					d="M5,10.75 L8.5,14.25 L19.4,2.3 C18.8333333,1.43333333 18.0333333,1 17,1 L4,1 C2.35,1 1,2.35 1,4 L1,17 C1,18.65 2.35,20 4,20 L17,20 C18.65,20 20,18.65 20,17 L20,7.99769186"
				/>
			</svg>
		</div>
		<span
			v-if="label"
			class="tw-ml-2 tw-text-xs tw-text-secondary tw-leading-5 tw-md:leading-6"
		>{{ label }}</span>
	</label>
</template>

<script>
export default {
	name: "CheckBox",
	props: {
		label: [Boolean, String],
		value: Boolean,
		color: {
			type: String,
			default: '#12c2e9'
		}
	},
	computed: {
		vModel: {
			get() {
				return this.value;
			},
			set(e) {
				this.$emit("input", e);
			},
		},
	},
};
</script>

<style lang='scss' scoped>
	.util-checkbox {
		--background: #fff;
		--border: #d1d6ee;
		--border-hover: #bbc1e1;
		--tick: #fff;

		position: relative;
		input,
		svg {
			width: 16px;
			height: 16px;
			display: block;
		}
		input {
			-webkit-appearance: none;
			-moz-appearance: none;
			position: relative;
			outline: none;
			background: var(--background);
			border: none;
			margin: 0;
			padding: 0;
			cursor: pointer;
			border-radius: 3px;
			transition: box-shadow 0.3s;
			box-shadow: inset 0 0 0 var(--s, 1px) var(--b, var(--border));
			&:hover {
				--s: 1.5px;
				--b: var(--border-hover);
			}
			&:checked {
				--b: var(--border-active);
			}
		}
		svg {
			pointer-events: none;
			fill: none;
			stroke-width: 2px;
			stroke-linecap: round;
			stroke-linejoin: round;
			stroke: var(--stroke, var(--border-active));
			position: absolute;
			top: 0;
			left: 0;
			width: 16px;
			height: 16px;
			transform: scale(var(--scale, 1)) translateZ(0);
		}
		&.path {
			input {
				&:checked {
					--s: 1.5px;
					transition-delay: 0.4s;
					& + svg {
						--a: 16.1 86.12;
						--o: 102.22;
					}
				}
			}
			svg {
				stroke-dasharray: var(--a, 86.12);
				stroke-dashoffset: var(--o, 86.12);
				transition: stroke-dasharray 0.6s, stroke-dashoffset 0.6s;
			}
		}
	}
</style>
