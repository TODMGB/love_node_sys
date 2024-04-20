<template>
	<Chart v-bind="$attr" :data="chartData" :type="chartType" :options="mergedOptions" />
</template>
<script>
import Chart from 'primevue/chart';
export default {
	components: {
		'Chart': Chart,
	},
	props: {
		chartType: {
			type: String,
			default: 'bar'
		},
		maintainAspectRatio: {
			type: Boolean,
			default: true
		},
		responsive: {
			type: Boolean,
			default: true
		},
		options: {
			type: Object,
			default() {
				return {}
			}
		},
		chartData: null,
	},
	computed: {
		mergedOptions() {
			const defaultOptions = {
				maintainAspectRatio: this.maintainAspectRatio,
				responsive: this.responsive,
			}
			return { ...defaultOptions, ...this.options }
		}
	},
}
</script>