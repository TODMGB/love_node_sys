<template>
    <span>
		<slot :dialog="dialog" :response="response"></slot>
		<Dialog header="Import Data" v-model:visible="dialog"  position="bottom"  :breakpoints="{'960px': '50vw', '640px': '95vw'}" style="width:40vw" >
			<div>
				<Uploader @uploadError="importFail" @uploadComplete="importComplete" mode="basic" :label="label" :upload-path="uploadPath" accept=".csv" field-name="import" v-model="response" :showUploadedFiles="false" />
			</div>
		</Dialog>
	</span>
</template>

<script>
export default {
    name: "ImportData",
    props: {
        uploadPath: {
            type: String,
            default: "filehelper/uploadfile",
        },
        label: {
            type: String,
            default: "Choose file to import",
        },
    },
    data: () => ({
        dialog: false,
        response: "",
	}),
	methods: {
		openDialog(){
			this.dialog = true;
		},
		importFail(val){
			this.$toast.add({severity: "error", summary: "Import Data Failed", detail: val, life: 3000});
		},
		importComplete(result){
			this.dialog = false;
			this.$emit('importComplete', result);
		}
	}
};
</script>