<template>
    <main class="main-page"  id="">
        <template v-if="pageReady">
            <template v-if="showHeader">
                <section class="page-section mb-3" >
                    <div class="container">
                        <div class="grid justify-content-between align-items-center">
                            <div  v-if="!isSubPage"  class="col-fixed " >
                                <Button @click="$router.go(-1)"   class="p-button p-button-text " icon="pi pi-arrow-left"  />
                            </div>
                            <div  class="col " >
                                <div class=" text-2xl text-primary font-bold" >
                                    {{ $t('addNewLoveNode') }}
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </section>
            </template>
            <section class="page-section " >
                <div class="container">
                    <div class="grid ">
                        <div  class="md:col-9 sm:col-12 comp-grid" >
                            <div >
                                <form ref="observer" tag="form" @submit.prevent="submitForm()"  >
                                    <div class="grid">
                                        <div class="col-12">
                                            <div class="formgrid grid">
                                                <div class="col-12 md:col-3">
                                                    {{ $t('message') }} 
                                                </div>
                                                <div class="col-12 md:col-9">
                                                    <InputText  ref="ctrlmessage" v-model.trim="formData.message"  :label="$t('message')" type="text" :placeholder="$t('enterMessage')"      
                                                    class=" w-full" :class="getErrorClass('message')">
                                                    </InputText>
                                                    <small v-if="isFieldValid('message')" class="p-error">{{ getFieldError('message') }}</small> 
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="formgrid grid">
                                                <div class="col-12 md:col-3">
                                                    {{ $t('uId') }} 
                                                </div>
                                                <div class="col-12 md:col-9">
                                                    <api-data-source :enable-cache="true"   api-path="components_data/u_id_option_list" >
                                                        <template v-slot="req">
                                                            <Dropdown  class="w-full" :class="getErrorClass('u_id')"   :loading="req.loading"   optionLabel="label" optionValue="value" ref="ctrlu_id"  v-model="formData.u_id" :options="req.response" :label="$t('uId')"  :placeholder="$t('selectAValue')" >
                                                            </Dropdown> 
                                                            <small v-if="isFieldValid('u_id')" class="p-error">{{ getFieldError('u_id') }}</small> 
                                                        </template>
                                                    </api-data-source>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="showSubmitButton" class="text-center my-3">
                                        <Button class="p-button-primary" type="submit" :label="$t('submit')" icon="pi pi-send" :loading="saving" />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </template>
    </main>
</template>
<script setup>
	    import {  computed,  reactive, toRefs, onMounted } from 'vue';
    import { required } from 'src/services/validators';
    import { useApp } from 'src/composables/app.js';
    import { $t } from 'src/services/i18n';
    import { useAddPage } from 'src/composables/addpage.js';
    import { usePageStore } from 'src/store/page';
    //[--PAGE-IMPORT-STATEMENT--]
    const props = defineProps({
        pageStoreKey: {
            type: String,
            default: 'LOVENODES',
        },
        pageName : {
            type : String,
            default : 'lovenodes',
        },
        routeName : {
            type : String,
            default : 'lovenodesadd',
        },
        apiPath : {
            type : String,
            default : 'lovenodes/add',
        },
        submitButtonLabel: {
            type: String,
            default: () => $t('submit'),
        },
        formValidationError: {
            type: String,
            default: $t('formIsInvalid'),
        },
        formValidationMsg: {
            type: String,
            default: $t('pleaseCompleteTheForm'),
        },
        msgTitle: {
            type: String,
            default: $t('createRecord'),
        },
        msgAfterSave: {
            type: String,
            default: () => $t('recordAddedSuccessfully'),
        },
        msgBeforeSave: {
            type: String,
            default: () => $t(''),
        },
        showHeader: {
            type: Boolean,
            default: true,
        },
        showSubmitButton: {
            type: Boolean,
            default: true,
        },
        redirect: {
            type : Boolean,
            default : true,
        },
        isSubPage: {
            type : Boolean,
            default : false,
        },
        pageData: { // use to set formData default values from another page
            type: Object,
            default: () => ({
        message: "", 
            })
        },
    });
    //lines
    const store = usePageStore(props.pageStoreKey);
    const app = useApp();
    const formData = reactive({ ...props.pageData });
    //vuelidate form validation rules
    const rules = computed(() => {
        return {
            message: {  }
        }
    });
    const page = useAddPage({ store, props, formData, rules, beforeSubmit, afterSubmit });
    // event raised before submit form
    function beforeSubmit(){
        return true;
    }
    // event raised after form submited
    function afterSubmit(response) { 
        app.flashMsg(props.msgTitle, props.msgAfterSave);
        page.setFormDefaultValues(); //reset form data
        if(app.isDialogOpen()){
            app.closeDialogs(); // if page is open as dialog, close dialog
        }
        else if(props.redirect) {
            app.navigateTo(`/lovenodes`);
        }
    }
    const {  saving, pageReady, } = toRefs(page.state);
    const { submitForm, getErrorClass, getFieldError, isFieldValid,  } = page.methods;
    onMounted(()=>{
        const pageTitle = $t('addNewLoveNode');
        app.setPageTitle(props.routeName, pageTitle); // set browser page title
    });
    // expose page object for other components access
    defineExpose({
        page
    });
</script>
<style scoped>
</style>
<style scoped>

</style>
