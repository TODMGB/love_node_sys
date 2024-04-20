import { reactive, useAttrs } from "vue";
import { useApp } from 'src/composables/app';
import { ApiService } from 'src/services/api';
import useVuelidate from '@vuelidate/core';
import { useConfirm } from 'primevue/useconfirm';
export function useForm({ props, formData, rules = {}, afterSubmit, beforeSubmit }) {

	const attrs = useAttrs();

	const app = useApp();
	const confirm = useConfirm();

	const state = reactive({
		id: null,
		pageReady: false,
		submitted: false,
		saving: false,
	});

	const $v = useVuelidate(rules, formData);

	function validateForm() {
		return !$v.value.$invalid;
	}

	async function submitForm() {
		state.submitted = true;

		if (beforeSubmit !== undefined) {
			if (!beforeSubmit()) { return; }
		}

		if (!validateForm()) {
			app.flashMsg(props.formValidationError, props.formValidationMsg, "error");
			return;
		}

		const confirmMsg = props.msgBeforeSave;
		if (confirmMsg) {
			confirm.require({
				message: confirmMsg,
				header: props.msgTitle,
				icon: 'pi pi-pencil',
				accept: async () => {
					saveFormData();
				},
				reject: () => {
					//callback to execute when user rejects the action
				}
			});
		}
		else {
			saveFormData();
		}
	}

	async function saveFormData() {
		state.saving = true;
		try {
			const response = await ApiService.post(props.apiPath, formData);
			if (attrs.onSubmitted) {
				attrs.onSubmitted(response);
			}
			else if (afterSubmit) {
				afterSubmit(response);
			}
		}
		catch (err) {
			app.showPageRequestError(err);
		}
		finally {
			state.submitted = false;
			state.saving = false;
		}
	}

	function getErrorClass(field) {
		const isInvalid = ($v.value[field]?.$invalid || false) && state.submitted;;
		return { "p-invalid": isInvalid };
	}

	function isFieldValid(field) {
		return ($v.value[field]?.$invalid || false) && state.submitted;
	}

	function getFieldError(field) {
		const fieldErrors = $v.value[field]?.$silentErrors;
		if (fieldErrors?.length) {
			return fieldErrors[0].$message; //return the first error
		}
		return null;
	}

	return {
		validateForm,
		submitForm,
		getErrorClass,
		getFieldError,
		isFieldValid,
		formData,
		state,
	}
}