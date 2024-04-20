<template>
	<div class="flex align-items-center">
		<template v-if="src">
			<div class="mr-2 flex-1" v-for="(img, index) in images" :key="index">
				<NiceImage v-bind="$attrs" v-if="index < numDisplay" @click="openGallery(index)" :src="$utils.setImgUrl(img, imageSize)" class="cursor-pointer" :style="{height, width}" />
			</div>
		</template>
		<div v-else  :style="{width, height}" v-bind="$attrs" class="flex justify-content-center align-items-center text-center surface-100 p-2 border-round">
			<i className="text-400 pi pi-image text-4xl"></i>
		</div>
	</div>
</template>

<script>
	import { useAppStore } from 'src/store/app';
    export default {
		setup() {
			const app = useAppStore()
			return { app }
		},
        props: {
            src: {
				type: String,
			},
            imageSize: {
				type: String,
				default: 'small'
			},
            previewSize: {
				type: String,
				default: 'large'
			},
            width: {
				type: String,
				required: false,
				default: '50px'
			},
			height: {
				type: String,
				required: false,
				default: '50px'
			},
			numDisplay: {
				type: Number, 
				required: false,
				default: 1
			}, 
        },
        data: function() {
            return {
				images: [],
            };
		},
		computed: {
			getLargeImages(){
				let largImages = [];
				this.images.forEach((path, index) => {
					if(this.previewSize){
						let imgUrl = this.$utils.setImgUrl(path, this.previewSize);
						largImages.push(imgUrl);
					}
					else{
						let imgUrl = this.$utils.getFileFullPath(path);
						largImages.push(imgUrl);
					}
				});
				return largImages;
			},
		},
        methods: {
            openGallery(index){
				let payload = { 
					currentSlide: index,
					images: this.getLargeImages
				}
				this.app.openImageDialog(payload);
			},
			setImages(){
				if(this.src){
					this.images = this.src.toString().split(",");
				}
			},
		},
		watch: {
			src: function(){
				this.setImages();
			}
		},
		mounted() {
			this.setImages();
		},
    }
</script>
