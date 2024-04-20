<template>
	<div class="flex">
		<Button class="p-button-text" v-for="(file, index) in files" :key="index" :icon="icon" :label="file.shortName" @click="openFile(file)" />
	</div>
</template>
<script>
    export default {
        props: {
            modelValue: {
				type: String,
			},
			icon: {
				type: String,
				default: "pi pi-file"
			},
			numDisplay: {
				type: Number, 
				required: false,
				default: 1
			},
        },
        data: function() {
            return {
				files: [],
            };
		},
		watch: {
			modelValue(){
				this.setFiles();
			},
			files: function(){
				let filePaths = [];
				this.files.forEach(file => {
					if(file.path){
						filePaths.push(file.path);
					}
				});
				this.$emit('update:modelValue', filePaths.toString());
			},
		},
        methods: {
			openFile(file){
				if(file.path){
					let path = file.path
					let fullPath = this.$utils.getFileFullPath(path);
					window.open(fullPath, '_blank');
				}
			},
			setFiles(){
				if(this.modelValue){
					let filePaths = this.modelValue.toString().split(",");
					this.files = [];
					filePaths.forEach(path => {
						let fileName = path.split('\\').pop().split('/').pop();
						let ext = fileName.split('.').pop().toLowerCase();
						let imgExt = ['jpg', 'png', 'gif', 'jpeg', 'bmp'];
						let isImage = false;
						if(imgExt.indexOf(ext) > -1){
							isImage = true;
						}
						let size = "small"; //use resize image for the display
						if(path.indexOf("temp/") > -1){
							size = "";  //if image is still in temp folder use the original image
						}
						let fileShortName = this.$utils.strEllipsis(fileName, 15);
						this.files.push({
							name: fileName,
							shortName: fileShortName,
							isImage: isImage,
							size: size,
							path: path
						})
					});
				}
			},
			removeFile(index){
				this.files.splice(index,1);
			}
		},
		mounted() {
			this.setFiles();
		},
    }
</script>
