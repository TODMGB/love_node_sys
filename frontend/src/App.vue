<template>
    <div :class="containerClass" @click="onWrapperClick">
        <template v-if="auth.isLoggedIn">
            <div class="layout-topbar bg-primary shadow-7">
                <div class="layout-toggle-menu">
                    <Button class="layout-topbar-button" @click="onMenuToggle">
                    <i class="pi pi-bars"></i>
                    </Button>
                </div>
                <router-link to="/" class="layout-topbar-logo flex-grow-none">
                    <img src="images/logo.png" alt="logo" class="my-5" />
                    <span class="text-white">{{ $appName }}</span>
                </router-link>
                <div class="layout-topbar-menu flex-grow-1 justify-content-between">
                    <div class="flex">
                        <template v-for="(item, index) of navbarTopLeftItems" :key="`navtopleftmenu-${index}`">
                            <router-link :to="item.to">
                                <Button :label="item.label" :icon="item.icon" class="p-button-text text-white page-button" />
                            </router-link>
                        </template>
                    </div>
                    <SplitButton class="layout-menu-user-button"  icon="pi pi-user" :model="appBarActionMenu">
                        <router-link to="/account">
                            <Avatar shape="circle" class="bg-primary text-white" size="large" icon="pi pi-user" />
                            </router-link>
                        </SplitButton>
                    </div>
                </div>
                <div class="layout-sidebar   " @click="onSidebarClick">
                    <div class="text-center p-2">
                        <router-link to="/account">
                            <Avatar size="xlarge" shape="circle" icon="pi pi-user" />
                            </router-link>
                            <div class="font-bold text-center py-2">
                                {{ $t('hi') }} {{ auth.userName }}
                            </div>
                        </div>
                        <AppMenu :model="navbarSideLeftItems" @menuitem-click="onMenuItemClick" />
                        </div>
                    </template>
                    <template v-else>
                        <div class="layout-topbar bg-primary text-white shadow-7">
                            <router-link to="/" class="layout-topbar-logo">
                                <img src="images/logo.png" alt="logo" class="my-5" />
                                <span class="text-white">{{ $appName }}</span>
                            </router-link>
                        </div>
                    </template>
                    
                    <div class="layout-main-container ">
                        <div class="layout-main">
                            <router-view />
                            
                        </div>
                        <div class="layout-footer grid justify-content-evenly align-items-center">
                            <div class="col-fixed text-center md:text-left">
                                &copy; {{ new Date().getFullYear() }} {{$appName}}. {{ $t('allRightsReserved') }}
                            </div>
                            <div class="col-fixed flex align-items-center gap-3">
                                {{ $t('language') }} <lang-switcher></lang-switcher>
                            </div>
                        </div>
                        
                    </div>
                    <!-- App right drawer -->
                    <Sidebar :showCloseIcon="false" position="right" v-model:visible="rightDrawer.showDrawer" :style="{width: rightDrawer.width}">
                        <component v-if="rightDrawer.showDrawer" is-sub-page :is="drawerComponentFile" :api-path="rightDrawer.pageUrl" :page-data="rightDrawer.pageData" />
                    </Sidebar>
                    
                    <transition name="layout-mask">
                        <div class="layout-mask p-component-overlay" v-if="mobileMenuActive"></div>
                    </transition>
                    
                    <!-- Page display dialog -->
                    <Dialog class="card py-4 px-0" :breakpoints="{'960px': '50vw', '640px': '95vw'}" :style="{width: pageDialog.width, maxWidth: pageDialog.maxWidth}" :modal="!pageDialog.seamless" :maximized="pageDialog.maximized" :dismissableMask="!pageDialog.persistent" :position="pageDialog.position" v-model:visible="pageDialog.showDialog" :showHeader="false">
                        <Button v-if="pageDialog.closeBtn" @click="pageDialog.showDialog=false" style="position:absolute;right:0px;top:0px" icon="pi pi-times" class="p-button-rounded p-button-text p-button-plain" />
                        
                        <component  v-if="pageDialog.showDialog" is-sub-page :is="dialogComponentFile" :api-path="pageDialog.pageUrl" :page-data="pageDialog.pageData" />
                    </Dialog>
                    
                    <!-- image preview dialog-->
                    <Dialog class="card p-0" header="..." :showHeader="true" :breakpoints="{'960px': '40vw', '640px': '95vw'}" style="width:auto" v-model:visible="imageDialog.showDialog" dismissableMask modal>
                        <div class="text-center">
                            <Carousel v-if="imageDialog.images.length > 1" :value="imageDialog.images" :circular="false" :page="imageDialog.currentSlide">
                            <template #item="{data}">
                                <div class="text-center">
                                    <NiceImage style="max-width:100%;max-height:70vh" :src="data" />
                                </div>
                            </template>
                            </Carousel>
                            <NiceImage v-else style="max-width:100%;max-height:70vh" :src="imageDialog.images[0]" />
                        </div>
                    </Dialog>
                    
                    <!-- request error dialog -->
                    <Dialog class="card p-0" modal  v-model:visible="errorDialog" :breakpoints="{'960px': '50vw', '640px': '95vw'}" style="width:30vw;" position="top">
                        <template #header>
                            <div class="flex align-items-center">
                                <div class="mr-2">
                                    <Avatar size="large" class="bg-pink-100 text-pink-600" icon="pi pi-exclamation-triangle" />
                                    </div>
                                    <div class="flex text-lg text-pink-600 font-bold">
                                        {{ $t('unableToCompleteRequest') }}
                                    </div>
                                </div>
                            </template>
                            <div class="text-grey-500 font-bold text-lg" v-for="(msg, index) in pageErrors" :key="index">
                                {{msg}}
                            </div>
                        </Dialog>
                        
                        <!-- app confirm page dialog -->
                        <ConfirmDialog></ConfirmDialog>
                        
                        <!-- app flash message toast -->
                        <Toast position="top-center" />
                        
                        <!-- app fullscreen loading dialog -->
                        <Dialog class="card m-0" :showHeader="false" modal  v-model:visible="fullScreenLoading" :breakpoints="{'960px': '50vw', '640px': '95vw'}" style="width:20vw;" position="center">
                            <ProgressBar mode="indeterminate" style="height: 6px"></ProgressBar>
                            <div class="mt-2 text-center text-500">{{ fullScreenLoadingMsg }}</div>
                        </Dialog>
                    </div>
                
</template>
<script setup>
	import { defineAsyncComponent, ref, toRefs, computed } from "vue";
	import AppMenu from 'src/components/AppMenu.vue';
	import { useApp } from 'src/composables/app';
	import { useAuth } from 'src/composables/auth';
	import { useRoute, useRouter } from 'vue-router';
	import { $t } from 'src/services/i18n';
	
	import { useAppStore } from 'src/store/app';

	const app = useApp();
	const auth = useAuth();
	const store = useAppStore();
	//const route = useRoute();
	//const router = useRouter();

	const { pageDialog, imageDialog, rightDrawer, pageErrors, fullScreenLoading, fullScreenLoadingMsg } = toRefs(store);
	const dialogComponentFile = computed(() => {
		if(pageDialog.value.showDialog && pageDialog.value.pageComponent){
			return defineAsyncComponent(() => import(`src/pages/${pageDialog.value.pageComponent}.vue`));
		}
		return null;
	});

	const drawerComponentFile = computed(() => {
		if(rightDrawer.value.showDrawer && rightDrawer.value.pageComponent){
			return defineAsyncComponent(() => import(`src/pages/${rightDrawer.value.pageComponent}.vue`));
		}
		return null;
	});

	const errorDialog = computed ({
		get() {
			return pageErrors.value.length > 0;
		},
		set(newValue) {
			pageErrors.value = [];
		}
	});
	const layoutMode = ref('static');
	const menuClick = ref(false);
	const staticMenuInactive = ref(false);
	const overlayMenuActive = ref(false);
	const mobileMenuActive = ref(false);

	const containerClass = computed(() => {
		if(!auth.isLoggedIn){
			staticMenuInactive.value = true;
			mobileMenuActive.value = false;
		}

		return ['layout-wrapper', {
			'layout-overlay': layoutMode.value === 'overlay',
			'layout-static': layoutMode.value === 'static',
			'layout-static-sidebar-inactive': staticMenuInactive.value && layoutMode.value === 'static',
			'layout-overlay-sidebar-active': overlayMenuActive.value && layoutMode.value === 'overlay',
			'layout-mobile-sidebar-active': mobileMenuActive.value,
			'p-input-filled': false,
		}];
	});
	const navbarSideLeftItems = app.menus.navbarSideLeft;
	const navbarTopLeftItems = app.menus.navbarTopLeft;
	const navbarTopRightItems = app.menus.navbarTopRight;
	function onMenuItemClick(event) {
		if (event.item && !event.item.items) {
			overlayMenuActive.value = false;
			mobileMenuActive.value = false;
		}
	}

	function onWrapperClick() {
		if (!menuClick.value) {
			overlayMenuActive.value = false;
			mobileMenuActive.value = false;
		}
		menuClick.value = false;
	}

	function onMenuToggle() {
		menuClick.value = true;
		if (app.isDesktop()) {
			if (layoutMode.value === 'overlay') {
				if(mobileMenuActive.value === true) {
					overlayMenuActive.value = true;
				}
				overlayMenuActive.value = !overlayMenuActive.value;
				mobileMenuActive.value = false;
			}
			else if (layoutMode.value === 'static') {
				staticMenuInactive.value = !staticMenuInactive.value;
			}
		}
		else {
			mobileMenuActive.value = !mobileMenuActive.value;
		}
	}
	const  appBarActionMenu = [
		{
			to: '/account',
			label: $t('myAccount'),
			icon: 'pi pi-user',
		},
		{
			label: $t('logout'),
			icon: 'pi pi-window-minimize',
			command: (event) => {
				startLogout();
			},
		},
	];
	function startLogout() {
		auth.logout();
		location.href = "/"; //reload page and navigated to index page
	}

</script>