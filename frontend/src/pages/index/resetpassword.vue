<template>
	<div class="container">
		<div class="grid justify-content-center">
			<div class="col md:col-5">
				<div class="card">
					<div class="my-3">
						<div class="text-2xl font-bold">{{ $t('passwordReset') }}</div>
					</div>
					<form ref="observer" tag="form" @submit.prevent="submitForm()">
						<div class="my-3">
							<Password class="w-full" inputClass="w-full" :feedback="true" toggleMask v-model="formData.password" :placeholder="$t('newPassword')" :class="getErrorClass('password')" />
							 <small v-if="isFieldValid('password')" class="p-error">{{ getFieldError('password') }}</small>
						</div>
						<div class="my-3">
							<Password class="w-full" inputClass="w-full" :feedback="false" toggleMask v-model="formData.confirm_password" :placeholder="$t('confirmNewPassword')"
							:class="getErrorClass('confirm_password')" />
							 <small v-if="isFieldValid('confirm_password')" class="p-error">{{ getFieldError('confirm_password') }}</small> 
						</div>
						<div class="text-center">
							<Button type="submit" :loading="saving" :label="$t('changePassword')" />
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup>
	import { computed, reactive, onMounted, toRefs } from 'vue';
	import {useRoute} from 'vue-router';
	import { required, sameAs, } from 'src/services/validators';
	import { useApp } from 'src/composables/app.js';
	import { useForm } from 'src/composables/formpage.js';
	import { $t } from 'src/services/i18n';
	const props = defineProps({
		pageName : {
			type : String,
			default : 'auth',
		},
		routeName : {
			type : String,
			default : 'resetpassword',
		},
		apiPath : {
			type : String,
			default : 'auth/resetpassword',
		},
		formValidationError: {
			type: String,
			default: $t('formIsInvalid'),
		},
		formValidationMsg: {
			type: String,
			default: $t('pleaseCompleteTheForm'),
		},
	});
	const app = useApp();
	const route = useRoute();
	const formDefaultValues = {
		password: "",
		confirm_password: "",
		token: route.query.token,
		email: route.query.email
	}
	const formData = reactive({ ...formDefaultValues });
	// redirect to another page
	function afterSubmit(response) {
		app.navigateTo("/index/resetpassword_completed");
	}
	//form validation rules
	const rules = computed(() => {
		return {
			password: { required },
			confirm_password: { required, sameAs: sameAs(formData.password, 'Password') }
		}
	});
	const page = useForm({ props, formData, rules, afterSubmit });
	const { saving } = toRefs(page.state) ;
	//page methods
	const { submitForm, getErrorClass, getFieldError, isFieldValid } = page;
	onMounted(()=>{
		const pageTitle = $t('resetPassword');
		app.setPageTitle(props.routeName, pageTitle); // set browser page title
	});
</script>