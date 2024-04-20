<template>
	<AutoComplete :multiple="multiple" field="label" dropdownMode="current" completeOnFocus class="w-full" dropdown :suggestions="options" v-bind="$attrs" v-model="model" @complete="search($event)">
	</AutoComplete>
</template>
<script>

export default {
	props: {
		apiPath: {
			type: String,
			default: ''
		},
		multiple: {
			type: Boolean,
			default: false
		},
		modelValue: null,
	},
    data: function() {
        return {
			loading: false,
			model: null,
            options: []
        }
    },
    methods: {
        search (event) {
			let search = event.query.trim();
			if(search){
				let qs = this.$utils.serializeQuery({ search });
				let url = this.apiPath+ "?" + qs;
				this.$api.get(url).then((response) => {
					this.options =  response.data ;
				},
				(response) => {});
			}
			else{
				this.options =  [];
			}
		},
		updateValue () {
			let value;
			if(this.multiple && Array.isArray(this.model)){
				value = this.model.map(x=>x.value).toString();
				console.log("value===", value);
			}
			else{
				value = this.model?.value || this.model;
			}
			this.$emit('update:modelValue', value);
		},
    },
	watch: {
		model(){
			this.updateValue();
		},
	},
	mounted () {
		if(this.modelValue){
			if(this.multiple){
				this.model = this.$utils.toArray(this.modelValue);
			}
			else{
				this.model = this.modelValue;
			}
		}
	},
};
</script>