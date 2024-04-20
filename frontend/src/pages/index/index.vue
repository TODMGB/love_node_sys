<template>
    <main class="main-page" id="">
        <section class="page-section mb-3" >
            <div class="container-fluid">
                <div class="grid justify-content-center">
                    <div  class="col-12 sm:col-6 md:col-3 comp-grid" >
                        <div class="p-3 card  flex gap-2 align-items-center " >
                            <Avatar size="large" class="bg-primary" icon="pi pi-user" />
                                <div class="text-xl font-bold text-primary flex-1">
                                    {{ $t('userLogin') }}
                                </div>
                            </div>
                            <div :class="{ 'card ': !isSubPage }" class=" my-3">
                                <div >
                                    <form ref="observer"  tag="form" @submit.prevent="startLogin()">
                                        <div class="mb-2 p-input-icon-right w-full">
                                            <i class="pi pi-user"></i>
                                            <InputText :label="$t('usernameEmailPhoneNumber')" :placeholder="$t('usernameEmailPhoneNumber')" class="w-full" v-model.trim="formData.username"  required="required" type="text" />
                                        </div>
                                        <div class="mb-2 p-input-icon-left w-full">
                                            <i class="pi pi-lock"></i>
                                            <Password :label="$t('password')" inputClass="w-full" :feedback="false" toggleMask class="w-full" :placeholder="$t('password')" required="required" v-model="formData.password" />
                                        </div>
                                        <div class="flex justify-content-between align-items-center my-2">
                                            <div class="flex align-items-center">
                                                <Checkbox class="mr-2" inputId="rememberme" name="rememberme" :binary="true" v-model="rememberUser" />
                                                <label class="text-sm text-500" for="rememberme">{{ $t('rememberMe') }}</label>
                                            </div>
                                            <div style="width:auto">
                                                <router-link to="/index/forgotpassword"><Button class="p-button-danger p-button-text" :label="$t('resetPassword')" /></router-link>
                                            </div>
                                        </div>
                                        <Message v-if="loginErrorMsg" severity="error" :closable="true" @close="loginErrorMsg=null">
                                        {{ loginErrorMsg.toString() }}
                                        </Message>
                                        <div class="text-center">
                                            <Button :label="$t('login')"  :loading="loading" icon="pi pi-lock-open" class="p-button-lg p-button-raised w-full" type="submit"> 
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div :class="{ 'card ': !isSubPage }" class="p-2">
                                <div class="grid gap-3 align-items-center justify-content-between">
                                    <div class="col text-500 font-bold text-sm">
                                        {{ $t('dontHaveAnAccount') }}
                                    </div>
                                    <div class="col-fixed text-right">
                                        <router-link to="/index/register">
                                            <Button icon="pi pi-user" :label="$t('register')" class="p-button-success" />
                                        </router-link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    
</template>
<script setup>
	import {  ref, reactive } from 'vue';
	import { useApp } from 'src/composables/app';
	import { useAuth } from 'src/composables/auth';
	import { useRoute, useRouter } from 'vue-router';
	
	
	
	const props = defineProps({
		pageName: {
			type: String,
			default: 'index',
		},
		routeName: {
			type: String,
			default: 'index',
		},
		isSubPage: {
			type : Boolean,
			default : false,
		},
	});
	const auth = useAuth();
	const route = useRoute();
	const router = useRouter();
	const app = useApp();
	const formData = reactive({
		username: '',
		password:'',
	});
	const loading = ref(false);
	const pageReady = ref(true);
	const loginErrorMsg = ref('');
	const rememberUser = ref(false);
	async function startLogin (){
		try{
			loading.value = true;
			loginErrorMsg.value = '';
			let url = "/auth/login";
			let payload = {
				formData,
				rememberUser:rememberUser.value,
				url
			};
			const loginData = await auth.login(payload);
			loading.value = false;
			if (loginData.token) {
				let nextUrl = route.query.nexturl || '/home'
				router.go(nextUrl);
			}
			else{
				router.push(loginData.nextpage);
			}
		}
		catch(error){
			loading.value = false;
			loginErrorMsg.value = error.request?.response || "Unable to establish connection...";
		}
	}
	
</script>
<style></style>
