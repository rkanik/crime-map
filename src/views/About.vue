<template>
	<b-container class="tw-py-5 tw-flex-1 scrollbar-y">
		<div class="accordion" role="tablist">
			<b-button class="tw-block tw-w-full" v-b-toggle.about-accordion>About this application</b-button>
			<b-collapse id="about-accordion" visible accordion="info-accordion" role="tabpanel">
				<b-card-body
					class="tw-px-1"
				>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iste adipisci maiores animi consequuntur hic vero rerum magni fugiat, sint repellat. Doloremque atque itaque a? Animi a repudiandae nesciunt eaque adipisci!</b-card-body>
			</b-collapse>

			<b-button class="tw-block tw-mt-4 tw-w-full" v-b-toggle.faq-accordion>FAQ</b-button>
			<b-collapse id="faq-accordion" visible accordion="info-accordion" role="tabpanel">
				<b-card-body
					class="tw-px-1"
				>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iste adipisci maiores animi consequuntur hic vero rerum magni fugiat, sint repellat. Doloremque atque itaque a? Animi a repudiandae nesciunt eaque adipisci!</b-card-body>
			</b-collapse>

			<b-button class="tw-block tw-mt-4 tw-w-full" v-b-toggle.help-accordion>Help</b-button>
			<b-collapse id="help-accordion" visible accordion="info-accordion" role="tabpanel">
				<b-card-body
					class="tw-px-1"
				>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iste adipisci maiores animi consequuntur hic vero rerum magni fugiat, sint repellat. Doloremque atque itaque a? Animi a repudiandae nesciunt eaque adipisci!</b-card-body>
			</b-collapse>

			<b-button class="tw-block tw-mt-4 tw-w-full" v-b-toggle.contact-accordion>Contact / Message Us</b-button>
			<b-collapse id="contact-accordion" visible accordion="info-accordion" role="tabpanel">
				<b-card-body
					class="tw-px-1"
				>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iste adipisci maiores animi consequuntur hic vero rerum magni fugiat, sint repellat. Doloremque atque itaque a? Animi a repudiandae nesciunt eaque adipisci!</b-card-body>
			</b-collapse>
		</div>
	</b-container>
</template>

<script>
export default {
	name: 'About',
}
</script>

<style lang="scss" scoped>
	#about {
		padding: 25px;
	}
	.buttons {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		li {
			margin-bottom: 15px;
			width: 100%;

			button {
				width: 100%;
			}
		}
	}
</style>