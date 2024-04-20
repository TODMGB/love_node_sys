
import { utils } from 'src/utils';
import { useAuthStore } from 'src/store/auth';

const publicPages = ['/', 'index', 'error', ]; //public pages which do not need authentation

const roleAbilities = {
  "admin": [],
  "user": []
};

export function useAuth() {
	const store = useAuthStore();

	const user = store.state.user;
	const userRole = store.state.userRole;

	let isLoggedIn = false;
	let userName = '';
	let userEmail = '';
	let userId = '';
	let userPhoto = '';
	let userPhone = '';
	
	setUserData();

	function setUserData(){
		if(user){
			isLoggedIn = true;
			userName = user.username;
			userId = user.u_id;
			userEmail = user.email;
			
			userPhone = user.telephone;
		}
	}

	
	async function getUserData(){
		const token = store.getLoginToken();
		//Token is available, user might still be logged in
		if (token) {
			try {
				//fetch user data for the first time and saves in the store
				await store.getUserData();
			}
			catch (e) {
				store.logout(); //token must have expired
			}
		}
		return { 
			user: store.state.user, 
			userRole: store.state.userRole, 
			userPages: store.state.userPages 
		};
	}

	function login(payload) {
		return store.login(payload);
	}

	function saveLoginData(loginData, rememberUser) {
		const payload =  { loginData, rememberUser };
		store.saveLoginData(payload);
	}
	
	function logout() {
		store.logout();
	}

	const pageRequiredAuth = function(path){
		const { pageName, routePath } = utils.parseRoutePath(path);
		return !publicPages.includes(pageName) && !publicPages.includes(routePath);
	}

	const canView = function(path){
		if (path) {
			let { routePath } = utils.parseRoutePath(path);
			const userPages = store.state.userPages;
			return publicPages.includes(routePath) || userPages.includes(routePath);
		}
		return true;
	}

	const canManage = function(page, userRecId){
		if(userRole){
			let userRoleAbilities = roleAbilities[userRole.toLowerCase()] || [];
			if (userRoleAbilities.includes(page)){
				return true;
			}
		}
		return userRecId == userId;
	}

	function isOwner(userRecId) {
		if(user){
			return userRecId == userId;
		}
		return false;
	}

	

	return {
		store,
		isLoggedIn,
		user,
		userName,
		userId,
		userEmail,
		userPhone,
		userPhoto,
		userRole,
		getUserData,
		login,
		logout,
		saveLoginData,
		pageRequiredAuth,
		canView,
		canManage,
		isOwner,
		
	}
}
