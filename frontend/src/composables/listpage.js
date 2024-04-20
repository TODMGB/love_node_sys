import { reactive, computed, onMounted, onUnmounted, watch, toRefs } from "vue";
import { utils } from 'src/utils';
import { useApp } from 'src/composables/app';

import { useRoute } from 'vue-router';
import { useConfirm } from 'primevue/useconfirm';

export function useListPage({ store, props }) {
	const app = useApp();
	const route = useRoute();
	const confirm = useConfirm();

	const { pagination, totalRecords, records, expandedRows, selectedItems, currentRecord } = toRefs(store.state);

	const state = reactive({
		pageReady: false,
		loading: false,
		deleting: false
	});

	const filters = store.state.filters;

	const filterParams = computed(() => {
		const query = {}
		for (const [key, filter] of Object.entries(filters)) {
			if (filterHasValue(filter)) {
				if (filter.valueType == 'range') {
					query[key] = { min: filter.value[0], max: filter.value[1] };
				}
				else if (filter.valueType == 'range-date') {
					let fromDate = utils.formatDate(filter.value[0]);
					let toDate = utils.formatDate(filter.value[1]);
					query[key] = { from: fromDate, to: toDate };
				}
				else if (filter.valueType == 'multiple-date') {
					query[key] = filter.value.map((val) => utils.formatDate(val));
				}
				else if (filter.valueType == 'single-date') {
					query[key] = utils.formatDate(filter.value);
				}
				else {
					query[key] = filter.value;
				}
			}
		}
		return query;
	});

	const apiUrl = computed(() => {
		let path = props.apiPath;

		if (props.fieldName) {
			path = path + '/' + encodeURIComponent(props.fieldName) + '/' + encodeURIComponent(props.fieldValue);
		}

		const query = {};

		const orderBy = pagination.value.sortBy;
		const orderType = pagination.value.descending ? "desc" : "asc";

		query.page = pagination.value.page;
		query.limit = pagination.value.limit;

		if (orderBy) {
			query.orderby = orderBy;
			query.ordertype = orderType;
		}


		Object.assign(query, filterParams.value);
		const queryParams = utils.serializeQuery(query);
		if (path.includes('?')) {
			return `${path}&${queryParams}`;
		}
		return `${path}?${queryParams}`;
	});

	const recordsPosition = computed(() => {
		const position = Math.min(pagination.value.page * pagination.value.limit, totalRecords.value);
		return Math.abs(position);
	});

	const totalPages = computed(() => {
		if (totalRecords.value > pagination.value.limit) {
			return Math.ceil(totalRecords.value / pagination.value.limit);
		}
		return 1;
	});

	const finishedLoading = computed(() => {
		if (records.value.length > pagination.value.limit && records.value.length >= totalRecords.value) {
			return true;
		}
		return false;
	});

	const canLoadMore = computed(() => {
		if (state.loading || finishedLoading.value) {
			return false;
		}
		return true;
	});

	const pageBreadCrumb = computed(() => {
		let items = [];
		let filterName = route.query.tag || props.fieldName;
		items.push({
			label: filterName,
			to: `/${props.pageName}`
		});

		let filterValue = route.query.label || props.fieldValue;
		items.push({
			label: filterValue,
			to: `/${props.pageName}`
		});
		return items;
	});

	function onSort(event) {
		if (props.mergeRecords) {
			store.resetPageRecords();
		}
		pagination.value.sortBy = event.sortField;
		pagination.value.descending = event.sortOrder == -1;
	}

	function loadNextPage() {
		pagination.value.page++; //will trigger load function
	}

	function loadPreviousPage() {
		if (pagination.value.page > 0) {
			pagination.value.page--; //will trigger load function
		}
	}

	function scrollToTop() {
		// display starting from first record
		// if not infinite load,
		if (props.routeName === route.name && !props.mergeRecords) {
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	}

	async function load() {
		if (!canLoadMore.value) {
			return;
		}
		scrollToTop();

		state.pageReady = false;
		state.loading = true;

		const url = apiUrl.value;
		const payload = {
			url,
			merge: props.mergeRecords
		}
		try {
			//the store will load the page data and set current records
			await store.fetchRecords(payload);
			state.pageReady = true;
		}
		catch (err) {
			app.showPageRequestError(err);
		}
		finally {
			state.loading = false;
		}
	}

	function reload() {
		store.resetPageRecords();
	}

	function setCurrentRecord(record) {
		selectedItems.value = [record];
		currentRecord.value = record;
	}

	function onRowExpand(event) {
		const record = event.data;
		expandedRows.value = [record];
		setCurrentRecord(record)
	}

	function isCurrentRecord(row) {
		return row == currentRecord.value;
	}

	function importComplete(message) {
		app.flashMsg(message);
		reload();
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

		if (exportType === "print") {
			app.printReport(exportUrl)
		}
		else {
			let downloadFileName = `${utils.dateNow()} ${props.pageName}.${fileExt}`;
			app.downloadReport(exportUrl, downloadFileName);
		}
	}

	async function deleteItem(id) {
		if (Array.isArray(id)) {
			id = id.map(value => value[props.primaryKey]);
		}

		if (id) {
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
					state.deleting = true;
					try {
						await store.deleteRecord(payload);
						app.flashMsg(title, props.msgAfterDelete);
					}
					catch (err) {
						app.showPageRequestError(err);
					}
					finally {
						state.deleting = false;
					}
				},
				reject: () => {
					//callback to execute when user rejects the action
				}
			});
		}
	}

	function setFilterValue(filter, value) {
		let valueType = filter.valueType;
		if (valueType == "range") {
			let range = []
			if (Array.isArray(value)) {
				range = value;
			}
			else {
				range.push(0)
				range.push(value)
			}
			value = range.map(val => Number(val));
		}
		else if (valueType == "range-date") {
			let range = []
			if (Array.isArray(value)) {
				range = value;
			}
			else {
				range.push(utils.dateNow())
				range.push(value)
			}
			value = range.map(val => new Date(val));
		}
		else if (valueType == "multiple" || valueType == "multiple-date") {
			if (!Array.isArray(value)) {
				value = value.split(',').filter(Boolean)
			}
			if (valueType == "multiple-date") {
				value = value.map(val => new Date(val));
			}
		}
		else if (valueType == "single-date") {
			value = new Date(value);
		}
		filter.value = value;
	}

	function removeFilter(filter, selectedVal) {
		let valueType = filter.valueType;
		if (valueType == 'range' || valueType == 'range-date') {
			filter.value = [];
		}
		else if (valueType == 'multiple' || valueType == 'multiple-date') {
			let idx = filter.value.indexOf(selectedVal);
			filter.value.splice(idx, 1);
		}
		else {
			filter.value = null;
		}
	}

	function filterHasValue(filter) {
		if (filter.valueType == 'range') {
			return filter.value.length > 0;
		}
		else if (filter.valueType == 'range-date') {
			const toDate = filter.value[1] || null;
			if (toDate) return true;//if second date is selected
			return false;
		}
		else if (Array.isArray(filter.value)) {
			return filter.value.length > 0;
		}
		else if (filter.value) {
			return true;
		}
		return false;
	}

	function getFilterLabel(filter, selectedVal) {
		if (filter.valueType == 'range' && filter.value.length) {
			let min = filter.value[0];
			let max = filter.value[1];
			return `${min} - ${max}`;
		}
		else if (filter.valueType == 'range-date' && filter.value.length) {
			let minDate = utils.humanDate(filter.value[0]);
			let maxDate = utils.humanDate(filter.value[1]);
			return `${minDate} - ${maxDate}`;
		}
		else if (filter.valueType == 'multiple-date') {
			let val = selectedVal || filter.value;
			return utils.humanDate(val);
		}
		else if (filter.valueType == 'single-date') {
			return utils.humanDate(filter.value);
		}
		else if (filter.options.length) {
			let val = selectedVal || filter.value;
			let selectedFilter = filter.options.find(obj => obj.value == val);
			if (selectedFilter) {
				return selectedFilter.label;
			}
		}
		else if (selectedVal) {
			return selectedVal.toString();
		}
		return filter.value.toString();
	}

	function updateFilterValues() {
		const params = props.queryParams
		for (const key in params) {
			const filter = filters[key];
			if (filter) {
				setFilterValue(filter, params[key]);
			}
		}
	}

	//reset pagination when filter changes
	const pageNeedReset = computed(() => {
		const filters = filterParams.value;
		const query = {
			field: props.field,
			value: props.fieldValue,
			...filters
		}
		return query
	});

	watch(pageNeedReset, () => {
		store.resetPageRecords();
	});

	watch(apiUrl, () => {
		load()
	});

	watch(() => props.queryParams, () => {
		updateFilterValues();
	});

	onMounted(() => {
		updateFilterValues();
		if (props.autoLoad) {
			//for infinite load, ignore reload of the page if records already loaded
			const ignoreLoad = props.mergeRecords && totalRecords.value > 0
			if (!ignoreLoad) {
				load();
			}
			else{
				state.pageReady = true;
			}
		}
	});

	onUnmounted(() => {
		if (props.isSubPage) {
			store.$dispose();
		}
	});

	const computedProps = {
		apiUrl,
		pageBreadCrumb,
		canLoadMore,
		finishedLoading,
		totalPages,
		recordsPosition
	}

	const methods = {
		load,
		reload,
		loadNextPage,
		loadPreviousPage,
		exportPage,
		debounce: utils.debounce(),
		onSort,
		deleteItem,
		setCurrentRecord,
		onRowExpand,
		isCurrentRecord,
		setFilterValue,
		removeFilter,
		getFilterLabel,
		filterHasValue,
		importComplete
	}

	const filterController = { filters, removeFilter, getFilterLabel, filterHasValue }
	return {
		state,
		computedProps,
		methods,
		filterController
	}
}