<template>
    <div v-if="status == 'loading'" class="loading text-center flex align-items-center justify-content-center nice-shadow-6 surface-100" v-bind="$attrs">
        <ProgressSpinner style="width:30px;height:30px" />
    </div>
    <div v-if="status == 'error'" v-bind="$attrs" class="surface-100 flex align-items-center justify-content-center text-center border-round">
        <i class="text-400 pi pi-info-circle text-4xl"></i>
    </div>
    <img v-show="status == 'loaded'" :src="src" v-bind="$attrs" @load="loaded" @error="error">
</template>
<script>
export default {
    props: {
        src: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            status: 'loading',
        };
    },
    methods: {
        loaded() {
            this.status = 'loaded';
        },
        error() {
            this.status = 'error';
        },
    },
};
</script>