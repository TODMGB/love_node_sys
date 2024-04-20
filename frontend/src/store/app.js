import { defineStore } from 'pinia';

export const useAppStore = defineStore('appstore', {
	state: () => ({
		leftDrawer: true,
		leftDrawerMini: false,
		rightDrawer: {
			showDrawer: false,
			pageComponent: '',
			pageUrl: '',
			pageData: null,
			rightDrawerWidth: 400,
		},
		pageErrors: [],
		pageDialog: {
			showDialog: false,
			pageComponent: '',
			pageUrl: '',
			pageData: null,
			seamless: false,
			position: 'standard',
			persistent: false,
			maximized: false,
			closeBtn: false,
			width: '700px',
			width: '95vw',
		},
		imageDialog: {
			showDialog: false,
			currentSlide: 1,
			images: [],
		},
		fullScreenLoading: false,
		fullScreenLoadingMsg: null,
	}),
	getters: {
		isDialogOpen(state) {
			return (state.pageDialog.showDialog || state.rightDrawer.showDrawer)
		},
	},
	actions: {
		openFullScreenLoading(value){
			this.fullScreenLoading = true;
			this.fullScreenLoadingMsg = value;
		},
		openPageDrawer(payload) {
			this.rightDrawer.width = payload.width || 400;
			this.rightDrawer.pageComponent = payload.page;
			this.rightDrawer.pageUrl = payload.url;
			this.rightDrawer.pageData = payload.pageData;
			this.rightDrawer.showDrawer = true;
		},
		openPageDialog(payload) {
			this.pageDialog.pageComponent = payload.page;
			this.pageDialog.pageUrl = payload.url;
			this.pageDialog.pageData = payload.pageData;

			this.pageDialog.seamless = payload.seamless || false;
			this.pageDialog.persistent = payload.persistent || false;
			this.pageDialog.position = payload.position || 'center';
			this.pageDialog.maximized = payload.maximized || false;
			this.pageDialog.closeBtn = payload.closeBtn || false;
			if (payload.maximized) {
				this.pageDialog.width = payload.width || '';
				this.pageDialog.maxWidth = '';
			}
			else {
				this.pageDialog.width = payload.width || '700px';
				this.pageDialog.maxWidth = '95vw';
			}
			this.pageDialog.showDialog = true;
		},
		openImageDialog(payload) {
			this.imageDialog.images = payload.images;
			this.imageDialog.currentSlide = payload.currentSlide;
			this.imageDialog.showDialog = true;
		},
		closeDialogs() {
			this.pageDialog.showDialog = false;
			this.imageDialog.showDialog = false;
			this.rightDrawer.showDrawer = false;
			this.fullScreenLoading = false;
		},
		closePageDialog() {
			this.pageDialog.showDialog = false;
		},
		closeImageDialog() {
			this.imageDialog.showDialog = false;
		},
		closeRightDrawer() {
			this.rightDrawer.showDrawer = false;
		},
		closeFullScreenLoading() {
			this.fullScreenLoading = false;
		},
		showPageErrors(errors) {
			this.pageErrors = errors;
		},
	},
});