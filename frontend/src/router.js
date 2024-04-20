
import { createRouter, createWebHashHistory } from 'vue-router';

import { useAuth } from 'src/composables/auth';


function passRouteToProps(route){
	return {
		queryParams: route.query,
		fieldName: route.params.fieldName, 
		fieldValue: route.params.fieldValue
	}
}


let routes = [
	//Dashboard routes


//lovenodes routes
			{
				path: '/lovenodes/:fieldName?/:fieldValue?',
				name: 'lovenodeslist',
				component: () => import('./pages/lovenodes/list.vue'), 
				props: route => passRouteToProps(route)
			},
	
			{ 
				path: '/lovenodes/view/:id', 
				name: 'lovenodesview', 
				component: () => import('./pages/lovenodes/view.vue'), 
				props: true
			},
		
			{ 
				path: '/lovenodes/add', 
				name: 'lovenodesadd', 
				component: () => import('./pages/lovenodes/add.vue'), 
				props: true
			},
	
			{ 
				path: '/lovenodes/edit/:id', 
				name: 'lovenodesedit', 
				component: () => import('./pages/lovenodes/edit.vue'), 
				props: true
			},
		

//picture routes
			{
				path: '/picture/:fieldName?/:fieldValue?',
				name: 'picturelist',
				component: () => import('./pages/picture/list.vue'), 
				props: route => passRouteToProps(route)
			},
	
			{ 
				path: '/picture/view/:id', 
				name: 'pictureview', 
				component: () => import('./pages/picture/view.vue'), 
				props: true
			},
		
			{ 
				path: '/picture/add', 
				name: 'pictureadd', 
				component: () => import('./pages/picture/add.vue'), 
				props: true
			},
	
			{ 
				path: '/picture/edit/:id', 
				name: 'pictureedit', 
				component: () => import('./pages/picture/edit.vue'), 
				props: true
			},
		

//users routes
			{
				path: '/users/:fieldName?/:fieldValue?',
				name: 'userslist',
				component: () => import('./pages/users/list.vue'), 
				props: route => passRouteToProps(route)
			},
	
			{ 
				path: '/users/view/:id', 
				name: 'usersview', 
				component: () => import('./pages/users/view.vue'), 
				props: true
			},
		
			{ 
				path: '/index/register', 
				name: 'usersuserregister', 
				component: () => import('./pages/index/userregister.vue'), 
				props: true
			},
	
			{ 
				path: '/account/edit', 
				name: 'usersaccountedit', 
				component: () => import('./pages/account/accountedit.vue'), 
				props: true
			},
	
			{ 
				path: '/account', 
				name: 'usersaccountview', 
				component: () => import('./pages/account/accountview.vue'), 
				props: true
			},
	
			{ 
				path: '/users/add', 
				name: 'usersadd', 
				component: () => import('./pages/users/add.vue'), 
				props: true
			},
	
			{ 
				path: '/users/edit/:id', 
				name: 'usersedit', 
				component: () => import('./pages/users/edit.vue'), 
				props: true
			},
		

			{ 
				path: '/mainpage', 
				name: 'mainpage', 
				component: () => import('././pages/custom/mainpage.vue'), 
				props: true
			},
	
	
	
//Password reset routes
			{ 
				path: '/index/forgotpassword', 
				name: 'forgotpassword', 
				component: () => import('./pages/index/forgotpassword.vue'), 
				props: true
			},
			{ 
				path: '/index/resetpassword', 
				name: 'resetpassword', 
				component: () => import('./pages/index/resetpassword.vue'), 
				props: true
			},
			{ 
				path: '/index/resetpassword_completed', 
				name: 'resetpassword_completed', 
				component: () => import('./pages/index/resetpassword_completed.vue'), 
				props: true
			},
	
	
	
	{ 
		path:  '/error/forbidden', 
		name: 'forbidden', 
		component: () => import('./pages/errors/forbidden.vue'),
		props: true
	},
	{ 
		path: '/error/notfound', 
		name: 'notfound',
		component: () => import('./pages/errors/pagenotfound.vue'),
		props: true
	},
	{
		path: '/:catchAll(.*)', 
		component: () => import('./pages/errors/pagenotfound.vue')
	}
];

export default () => {
	
const auth = useAuth();

	
	const user = auth.user;
	if(user){
		routes.push({ path: '/', alias: '/home', name: 'home', component: () => import(`./pages/home/home.vue`) });
	}
	else{
		routes.push({ path: '/', alias: '/index', name: 'index', component: () => import('./pages/index/index.vue') });
	}

	const router = createRouter({
		history: createWebHashHistory(),
		routes,
		scrollBehavior(to, from, savedPostion){
			if(savedPostion) return savedPostion;
			return { top:0 }
		}
	});
	
	router.beforeEach((to, from, next) => {
		const user = auth.user;
		let path = to.path;
		let authRequired = auth.pageRequiredAuth(path);
		
		//authenticate user
		if (authRequired && !user) {
			//user is not logged. redirect to login
			return next({ path: '/',  query: { nexturl: to.fullPath } });
		}

		if(user && to.name == "index"){
			//already logged in, show home when try to access index page
			return next({ path: "/home"});
		}

		//navigate to redirect url if available
		if(to.name == "home" && to.query.nexturl){
			return next({ path: to.query.nexturl});
		}

		//close dialog from previous page
		//store.dispatch('app/closeDialogs');

		//continue to specified route
		next();
	});

	return router;
}
