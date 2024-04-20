
import { reactive } from 'vue';
import { defineStore } from 'pinia';
import { ApiService } from 'src/services/api';
import { StorageService } from '../services/storage';
export const useAuthStore = defineStore('auth', () => {
	const state = reactive({
		user: null,
		userRole: '',
		userPages: []
	});
	
	function getLoginToken() {
		let token = StorageService.getToken() || null;
		return token;
	}

	async function getUserData() {
		try {
			const response = await ApiService.get("account/currentuserdata");
			const userData = response.data;
			
			state.user = userData

		}
		catch (err) {
			throw err;
		}
	}

	async function login ( args){
		try {
			const { url, formData, rememberUser } = args;
			const response = await ApiService.post(url, formData);
			const loginData = response.data;
			saveLoginData( { loginData, rememberUser });
			return loginData;
		}
		catch (err) {
			throw err;
		}
	}

	async function saveLoginData (args) {
		const { loginData, rememberUser } = args;
		if(loginData?.token){
			StorageService.saveLoginData(loginData, rememberUser);
		}
	}

	async function saveRecord (args) {
		try {
			const { url, payload } = args;
			const response = await ApiService.post(url, payload);
			const record = response.data;
			return record;
		}
		catch (err) {
			throw err;
		}
	}

	async function logout () {
		// Remove the token and remove Authorization header from Api Service as well 
		StorageService.removeLoginData();
		ApiService.removeHeader();
	}

	return {
		state,
		saveLoginData,
		getLoginToken,
		getUserData,
		login,
		logout,
		saveRecord,
	}
});
