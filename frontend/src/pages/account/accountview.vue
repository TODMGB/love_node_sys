<template>
    <main class="main-page"  id="">
        <template v-if="pageReady">
            <section class="page-section " >
                <div class="container">
                    <div class="grid ">
                        <div  class="col comp-grid" >
                            <div >
                                <div class="mb-4 card surface-100">
                                    <div class="grid align-items-center">
                                        <div class="col-fixed" style="width:120x">
                                            <Avatar icon="pi pi-user" size="xlarge" shape="circle" />
                                            </div>
                                            <div class="col">
                                                <div class="text-2xl text-primary"> {{ auth.userName }} </div>
                                                <div class="text-sm text-gray-500"> {{ auth.userEmail }} </div>
                                            </div>
                                        </div>
                                    </div>
                                    <TabView v-model:activeIndex="activeTab">
                                        <TabPanel>
                                            <template #header>
                                                <i class="pi pi-user mr-2"></i>
                                                <span>{{ $t('accountDetail') }}</span>
                                            </template>
                                            <div class="mb-3 grid ">
                                                <div class="col-12 md:col-4">
                                                    <div class="flex gap-2 align-items-center card shadow-none p-3 surface-100 ">
                                                        <div class="">
                                                            <div class="text-400 mb-1">{{ $t('uId') }}</div>
                                                            <div class="font-bold">{{ item.u_id }}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-12 md:col-4">
                                                    <div class="flex gap-2 align-items-center card shadow-none p-3 surface-100 ">
                                                        <div class="">
                                                            <div class="text-400 mb-1">{{ $t('username') }}</div>
                                                            <div class="font-bold">{{ item.username }}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-12 md:col-4">
                                                    <div class="flex gap-2 align-items-center card shadow-none p-3 surface-100 ">
                                                        <div class="">
                                                            <div class="text-400 mb-1">{{ $t('telephone') }}</div>
                                                            <div class="font-bold">{{ item.telephone }}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-12 md:col-4">
                                                    <div class="flex gap-2 align-items-center card shadow-none p-3 surface-100 ">
                                                        <div class="">
                                                            <div class="text-400 mb-1">{{ $t('email') }}</div>
                                                            <div class="font-bold">{{ item.email }}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-12 md:col-4">
                                                    <div class="flex gap-2 align-items-center card shadow-none p-3 surface-100 ">
                                                        <div class="">
                                                            <div class="text-400 mb-1">{{ $t('uIdFk') }}</div>
                                                            <div class="font-bold">
                                                                <Button class="p-button-text" icon="pi pi-eye" :label="$t('usersDetail')" v-if="item.u_id_fk" @click="app.openPageDialog({ page: 'users/view', url: `/users/view/${item.u_id_fk}` , closeBtn: true })" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-12 md:col-4">
                                                    <div class="flex gap-2 align-items-center card shadow-none p-3 surface-100 ">
                                                        <div class="">
                                                            <div class="text-400 mb-1">{{ $t('isLinked') }}</div>
                                                            <div class="font-bold">{{ item.is_linked }}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </TabPanel>
                                        <TabPanel>
                                            <template #header>
                                                <i class="pi pi-pencil  mr-2"></i>
                                                <span>{{ $t('editAccount') }}</span>
                                            </template>
                                            <div class="reset-grid">
                                                <account-edit-page is-sub-page></account-edit-page>
                                                </div>
                                            </TabPanel>
                                            <TabPanel>
                                                <template #header>
                                                    <i class="pi pi-lock  mr-2"></i>
                                                    <span>{{ $t('changePassword') }}</span>
                                                </template>
                                                <div class="reset-grid">
                                                    <change-password-page is-sub-page></change-password-page>
                                                </div>
                                            </TabPanel>
                                        </TabView>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </template>
                <template v-if="loading">
                    <div style="min-height:200px" class="flex gap-3 justify-content-center align-items-center p-3">
                        <div><ProgressSpinner style="width:50px;height:50px" /> </div>
                        <div class="text-500">{{ $t('loading') }} </div>
                    </div>
                </template>
            </main>
</template>
<script setup>
	import {  ref, toRefs, onMounted } from 'vue';
	import { useApp } from 'src/composables/app.js';
	import { useAuth } from 'src/composables/auth';
	import { $t } from 'src/services/i18n';
	import  AccountEditPage  from "./accountedit.vue";
	import  ChangePasswordPage  from "./changepassword.vue";
	import { useViewPage } from 'src/composables/viewpage.js';
	import { usePageStore } from 'src/store/page';
	const props = defineProps({
		id: [String, Number],
		primaryKey: {
			type: String,
			default: 'u_id',
		},
		pageStoreKey: {
			type: String,
			default: 'ACCOUNT',
		},
		pageName: {
			type: String,
			default: 'users',
		},
		routeName: {
			type: String,
			default: 'usersaccountview',
		},
		apiPath: {
			type: String,
			default: 'account',
		},
		autoLoad: {
			type: Boolean,
			default: true,
		},
		titleBeforeDelete: {
			type: String,
			default: $t('deleteRecord'),
		},
		msgBeforeDelete: {
			type: String,
			default: () => $t('promptDeleteRecord'),
		},
		msgAfterDelete: {
			type: String,
			default: () => $t('recordDeletedSuccessfully'),
		},
		exportButton: {
			type: Boolean,
			default: true,
		},
		showHeader: {
			type: Boolean,
			default: true,
		},
		showFooter: {
			type: Boolean,
			default: true,
		},
		isSubPage: {
			type : Boolean,
			default : false,
		},
	});
	const store = usePageStore(props.pageStoreKey);
	const app = useApp(props);
	const auth = useAuth();
	const page = useViewPage({ store, props });
	const activeTab = ref(0);
	const { currentRecord } = toRefs(store.state);
	const { loading, pageReady } = toRefs(page.state);
	const item = currentRecord;
	const { load, deleteItem, } = page.methods;
	function getActionMenuModel(data){
		return [
		{
			label: () => $t('edit'),
			command: (event) => { app.openPageDialog({ page:'users/edit', url: `/users/edit/${data.u_id}`, closeBtn: true }) },
			icon: "pi pi-pencil"
		},
		{
			label: () => $t('delete'),
			command: (event) => { deleteItem(data.u_id) },
			icon: "pi pi-trash"
		}
	]
	}
	onMounted(()=>{
		const pageTitle = $t('myAccount');
		app.setPageTitle(props.routeName, pageTitle); // set browser page title
	});
</script>
<style scoped>
</style>
