<template>
    <div id="master-detailpage">
        <TabView v-model:activeIndex="activeTab">
            <TabPanel>
                <template #header>
                    <div class=" text-lg font-bold" >
                        {{ $t('userLoveNodes') }}
                    </div>
                </template>
                <div class="card my-3 p-3 surface-50">
                    <LovenodesViewPage ref="lovenodesViewPage"  :id="masterRecord.u_id" :show-header="false" :show-breadcrumbs="false" isSubPage>
                    </LovenodesViewPage>
                </div>
            </TabPanel>
            <TabPanel>
                <template #header>
                    <div class=" text-lg font-bold" >
                        {{ $t('userUsers') }}
                    </div>
                </template>
                <div class="card my-3 p-3 surface-50">
                    <UsersListPage ref="usersListPage"  field-name="users.u_id_fk" :field-value="masterRecord.u_id" :show-header="false" :show-breadcrumbs="false" isSubPage>
                    </UsersListPage>
                </div>
            </TabPanel>
        </TabView>
    </div>
</template>
<script setup>
import { watch, computed, ref, onMounted } from 'vue';
import { useApp } from 'src/composables/app.js';
import { $t } from 'src/services/i18n';
import { usePageStore } from 'src/store/page';
import LovenodesViewPage from "../lovenodes/view.vue";
import UsersListPage from "../users/list.vue";
const props = defineProps({
	isSubPage: {
		type : Boolean,
		default : true,
	},
	scrollIntoView: {
		type : Boolean,
		default : false,
	},
});
const store = usePageStore('USERS');
const app = useApp();
const masterRecord = computed(() => store.state.currentRecord);
const activeTab = ref(0);
const pageReady = computed(() => masterRecord.value != null);
//scroll detail page into view
function scrollToDetailPage() {
	if (props.scrollIntoView) {
		const pageElement = document.getElementById('master-detailpage');
		if(pageElement){
			pageElement.scrollIntoView({behavior:'smooth', block:'start'});
		}
	}
}
// pass form data from master to detail
function setDetailPageFormData(){
	const record = masterRecord.value;
	 
	// set lovenodes form data
	const lovenodesStore = usePageStore('lovenodes');
	lovenodesStore.setFormData({ u_id:record?.u_id });
	 
	// set users form data
	const usersStore = usePageStore('users');
	usersStore.setFormData({ u_id_fk:record?.u_id });
}
watch(() => masterRecord, () => {
		setDetailPageFormData();
		scrollToDetailPage();
	},
	{ deep: true, immediate: true }
);
onMounted(()=>{ 
    scrollToDetailPage();
});
</script>
