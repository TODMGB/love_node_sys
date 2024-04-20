<template>
	<div style="position:relative;">
		<api-data-source :api-path="apiPath" v-slot="apiProp" @loaded="searchCompleted">
			<div class="p-input-icon-left w-full">
				<i class="pi pi-search" />
				<InputText @focus="showResult" v-bind="$attrs" :value="searchText" @input="debounceInput($event)" class="w-full" />
			</div>
			<div v-show="show" class="search-result-holder" :class="menuClass">
				<div class="flex justify-content-between">
					<div class="p-2">
						<div class="font-bold text-lg">Search Result</div>
						<div v-if="totalRecords" class="text-grey">Showing record {{recordsPosition}} of {{totalRecords}} </div>
					</div>
					<div>
						<Button @click="hideSearch()" class="p-button-text p-button-sm p-button-danger" icon="pi pi-times" />
					</div>
				</div>
				<hr />
				<div class="result-list">
					<slot :close="hideSearch" :records="records" :searchText="searchText" :loading="apiProp.loading"></slot>
				</div>
				<Paginator v-if="totalPages>1" @page="(event)=>{pagination.page = event.page + 1}" :rows="pagination.limit" :totalRecords="totalRecords">
				</Paginator>
			</div>
		</api-data-source>
	</div>
</template>
<script>
	export default {
		props: {
			searchPage: {
				type: String,
				default: ''
			},
			menuClass: {
				type: String,
				default: ''
			},
			icon: {
				type: String,
				default: ''
			},
			autoClose: {
				type: Boolean,
				default: true
			},
		},
		data: function() {
			return {
				totalRecords: 0,
				records: [],
				searchText: '',
				show: false,
				pagination: {
					page: 1,
					limit: 10,
				},
			}
		},
		computed: {
			apiPath () {
				let search = this.searchText;
				if(search){
					let query = {
						page: this.pagination.page,
						limit: this.pagination.limit,
						search
					};
					let qs = this.$utils.serializeQuery(query);
					return this.searchPage + "?" + qs;
				}
				return null;
			},
			recordsPosition(){
				return Math.min(this.pagination.page * this.pagination.limit, this.totalRecords);
			},
			totalPages(){
				if (this.totalRecords > this.pagination.limit) {
					return Math.ceil(this.totalRecords / this.pagination.limit);
				}
				return 1;
			}
		},
		methods: {
			debounceInput(event){
				const debounced = this.$utils.debounce();
				debounced(()=>{
					this.searchText = event.target.value;
				});
			},
			searchCompleted(response) {
				if (response.records){
					this.records = response.records;
					this.totalRecords = response.totalRecords;
				}
				else{
					this.records = [];
					this.totalRecords = 0;
				}
			},
			showResult () {
				this.show = this.searchText !== '';
				return this.show;
			},
			hideSearch () {
				this.show = false;
			},
		},
		watch: {
			searchText: function() {
                this.showResult();
			}
		},
	};
</script>