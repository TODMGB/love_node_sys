<template>
    <div class="uploader p-2 surface-100 border-round">
        <FileUpload :disabled="disableUpload" ref="uploader" name="file" :auto="true" :maxFileSize="maxFileSize"
            :accept="accept" :multiple="multiple" mode="advanced" :showUploadButton="false" :showCancelButton="false"
            :url="setUploadPath" @before-send="setheaders" @select="validateUpload" @upload="uploadComplete"
            @error="uploadError" @progress="uploadProgress">
            <template #empty>
                <div class="flex align-items-center gap-3 justify-content-center text-2xl text-400">
                    <i class="pi pi-cloud-upload border-2 border-circle p-2 border-400  text-4xl" />
                    <strong>{{ label }}</strong>
                </div>
            </template>
            <template #content="{ files, uploadedFiles, removeUploadedFileCallback, onFileRemove, messages }">
                <div>
                    <Message v-for="msg of messages" severity="error" :key="msg">{{ msg }}</Message>
                    <div v-if="files.length > 0">
                        <ProgressBar :value="uploadPercent" />
                        <div class="flex justify-content-around flex-wrap gap-2">
                            <div v-for="(file, index) of files" :key="file.name + file.type + file.size">
                                <div :class="fileHolderClass" v-if="isImage(file.name)">
                                    <img width="50px" height="50px" :src="file.objectURL" />
                                    <div class="text-sm text-500">
                                        {{ $utils.strEllipsis(file.name, 10) }} <br />
                                        <b>{{ $utils.formatSize(file.size) }}</b>
                                    </div>
                                    <Button class="p-button-danger p-button-sm p-button-text"
                                        @click="onFileRemove(index)" icon="pi pi-times" />
                                </div>

                                <div :class="fileHolderClass" v-else>
                                    <Avatar size="large" icon="pi pi-file" class="bg-green-100 text-green-500" />
                                    <div class="text-sm text-500">
                                        {{ $utils.strEllipsis(file.name, 10) }} <br />
                                        <b>{{ $utils.formatSize(file.size) }}</b>
                                    </div>

                                    <Button class="p-button-danger p-button-sm p-button-text"
                                        @click="onFileRemove(index)" icon="pi pi-times" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="p-3 font-bold" v-if="!disableUpload && uploadedFiles.length">{{ label }}</div>
                </div>
            </template>
        </FileUpload>
        <template v-if="showUploadedFiles && getUploadedFiles.length">
            <div class="flex align-items-center justify-content-evenly gap-2 flex-wrap mt-2">
                <div class="p-2 font-bold text-center text-500">
                    <i class="pi pi-upload"></i>
                    {{ $t('uploadedFiles') }}
                </div>
                <template v-for="file in getUploadedFiles" :key="file.path">
                    <div :class="fileHolderClass" v-if="file.isImage">
                        <ImageViewer width="40px" height="40px" :src="file.path" />
                        <span class="text-sm text-500">{{ file.shortName }}</span>
                        <Button class="p-button-danger p-button-sm p-button-text" @click="removeFile(file)"
                            icon="pi pi-times" />
                    </div>
                    <div :class="fileHolderClass" v-else>
                        <a class="flex gap-2 align-items-center" target="_blank"
                            :href="$utils.getFileFullPath(file.path)">
                            <Avatar size="large" icon="pi pi-file" class="bg-green-100 text-green-500" />
                            <span class="text-sm text-500">{{ file.shortName }}</span>
                        </a>
                        <Button class="p-button-danger p-button-sm p-button-text" @click="removeFile(file)"
                            icon="pi pi-times" />
                    </div>
                </template>
            </div>
        </template>
    </div>
</template>
<script>
import { StorageService } from '../services/storage';
export default {
    props: {
        fileHolderClass: {
            type: String,
            default: 'flex  justify-content-between gap-3 align-items-center p-1 card text-green-500'
        },
        accept: {
            type: String,
            default: '.png,.gif,.jpg,.jpg'
        },
        extensions: {
            type: String,
            default: ''
        },
        fileLimit: {
            type: Number,
            default: 5
        },
        maxFileSize: {
            type: Number,
            default: 10000000
        },
        multiple: {
            type: Boolean,
            default: true
        },
        uploadPath: {
            type: String,
            required: true
        },
        fieldName: {
            type: String,
            default: 'photo'
        },
        label: {
            type: String,
            default: 'Choose files or Drop files here'
        },
        showUploadedFiles: {
            type: Boolean,
            default: true
        },
        modelValue: null
    },
    data: function () {
        return {
            files: [],
            uploadedFilePaths: [],
            uploadPercent: 0,
        }
    },
    methods: {
        uploadProgress(event) {
            this.uploadPercent = event.progress
        },
        validateUpload(event) {
            const selectedFilesCount = event.files.length;
            const uploadedFileCount = this.uploadedFilePaths.length;
            const totalFiles = selectedFilesCount + uploadedFileCount;
            if (totalFiles > this.fileLimit) {
                const uploader = this.$refs.uploader;
                uploader.clear();
                let limit = this.fileLimit;
                this.$toast.add({ severity: 'error', summary: this.$t('uploadFailed'), detail: this.$t('maxFileLimit', { limit }), life: 3000 });
            }
        },
        updateValue() {
            this.$emit('update:modelValue', this.uploadedFilePaths.toString());
        },
        setheaders(event) {
            const token = StorageService.getToken();
            event.xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        },
        uploadComplete: function (event) {
            this.uploadPercent = 0;
            const uploadedPaths = (event.xhr.response || '').toString();
            const arrPaths = uploadedPaths.split(',');
            this.uploadedFilePaths.push(...arrPaths);
            this.updateValue();
            this.$emit('uploadComplete', uploadedPaths);
        },
        uploadError: function (event) {
            this.$emit('uploadError', event.xhr.responseText);
        },
        openFile(file) {
            if (file.path) {
                let path = file.path
                let fullPath = this.$utils.getFileFullPath(path);
                window.open(fullPath, '_blank');
            }
        },
        removeFile: function (file) {
            let index = this.uploadedFilePaths.indexOf(file.path);
            if (index !== -1) {
                this.uploadedFilePaths.splice(index, 1);
                this.$refs.uploader.uploadedFileCount--;
                let url = "fileuploader/remove_temp_file";
                let formData = {
                    temp_file: file.path
                }
                this.$api.post(url, formData).then((response) => {

                },
                    (response) => {
                        this.loading = false;
                    });
            }
            this.updateValue();
        },
        isImage: function (fileName) {
            let ext = fileName.split('.').pop().toLowerCase();
            let imgExt = ['jpg', 'png', 'gif', 'jpeg', 'bmp'];
            return (imgExt.indexOf(ext) > -1);
        },
    },
    computed: {
        maxFileSizeInKB: function () {
            return this.maxFileSize * 1024 * 1024;
        },
        setUploadPath() {
            return this.$utils.setApiPath(this.uploadPath);
        },
        getUploadedFiles() {
            let files = [];
            this.uploadedFilePaths.forEach(path => {
                let fileName = path.split('\\').pop().split('/').pop();
                let isImage = this.isImage(fileName);
                let size = "small"; //use resize image for the display
                if (path.indexOf("temp/") > -1) {
                    size = "";  //if image is still in temp folder use the original image
                }
                let fileShortName = this.$utils.strEllipsis(fileName, 10);
                files.push({
                    name: fileName,
                    shortName: fileShortName,
                    isImage: isImage,
                    size: size,
                    path: path
                })
            });
            return files;
        },
        disableUpload() {
            if (this.uploadedFilePaths.length >= this.fileLimit) {
                return true;
            }
            return false;
        },
    },
    watch: {

    },
    mounted: function () {
        if (this.modelValue) {
            this.uploadedFilePaths = this.$utils.toArray(this.modelValue);
            this.$refs.uploader.uploadedFileCount = this.uploadedFilePaths.length;
        }
        else {
            this.uploadedFilePaths = []
        }
    },
    created: function () {

    },
};
</script>

<style>
    .p-fileupload .p-fileupload-content, .p-fileupload .p-fileupload-buttonbar {
        padding:10px;
    }
</style>