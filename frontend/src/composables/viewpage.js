
import { computed, watch, reactive, onMounted } from "vue";
import { utils } from 'src/utils';
import { useApp } from 'src/composables/app';

import { useRoute, useRouter } from 'vue-router';
import { useConfirm } from 'primevue/useconfirm';

export function useViewPage({ store, props }) {
	const app = useApp();
	const route = useRoute();
	const router = useRouter();
	const confirm = useConfirm();

	const state = reactive({
		pageReady: false,
		loading: false,
		deleting: false
	});

	const apiUrl = computed(() => {
		let id = props.id || "";
		if (id) id = encodeURIComponent(id);
		let path = `${props.apiPath}/${id}`;
		let query = route.query;
		let queryParams = utils.serializeQuery(query);
		if (queryParams) {
			path += "?" + queryParams;
		}
		return path
	});

	async function load(apiPath) {
		let url = apiPath || apiUrl.value;
		try {
			state.pageReady = false;
			state.loading = true;
			// fetch currentRecord from api and keep in page store
			await store.fetchRecord(url);
			state.pageReady = true;
		}
		catch (err) {
			app.showPageRequestError(err);
		}
		finally {
			state.loading = false;
		}
	}

	function exportPage(exportType) {
		
		exportType = exportType || 'csv';
		
		app.openFullScreenLoading("Exporting...");
		
		let fileExt = exportType.toLowerCase();
		if (exportType == 'excel') {
			fileExt = 'xlsx';
		}

		let queryParam = {
			export: exportType
		}

		let exportUrl = utils.setApiPath(apiUrl.value, queryParam);
		if(exportType === "print"){
			app.printReport(exportUrl)
		}
		else{
			let downloadFileName = `${utils.dateNow()} ${props.pageName}.${fileExt}`;
			app.downloadReport(exportUrl, downloadFileName);
		}
	}

	function deleteItem(id) {
		if (!id) {
			return;
		}

		const title = props.titleBeforeDelete;
		const prompt = props.msgBeforeDelete;
		confirm.require({
			message: prompt,
			header: title,
			icon: 'pi pi-exclamation-triangle',
			accept: async () => {
				const recid = encodeURIComponent(id.toString());
				const url = `${props.pageName}/delete/${recid}`;
				const payload = { id, url };
				try {
					await store.deleteRecord(payload);
					if (app.isDialogOpen()) {
						app.closeDialogs()
					}
					else {
						router.back();
					}
					app.flashMsg(title, props.msgAfterDelete);
				}
				catch (e) {
					app.showPageRequestError(e);
				}
			},
			reject: () => {
				//callback to execute when user rejects the action
			}
		});
	}

	function moveRecord(recid) {
		let id = encodeURIComponent(recid);
		let path = `/${props.apiPath}/${id}`;
		load(path);
	}

	function moveToNextRecord() {
		moveRecord(store.state.currentRecord.nextRecordId);
	}

	function moveToPreviousRecord() {
		moveRecord(store.state.currentRecord.previousRecordId);
	}

	watch(apiUrl, () => { 
		load(); 
	});

	onMounted(() => {
        if(props.autoLoad){
			load();
		}
    });

	const computedProps = {
		apiUrl,
	}
	const methods = {
		load,
		deleteItem,
		moveToNextRecord,
		moveToPreviousRecord,
		exportPage,
	}

	return {
		state,
		computedProps,
		methods,
	}
}