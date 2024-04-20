import { reactive, computed, watch, onMounted, useAttrs } from "vue"; // 导入 Vue 的响应式、计算属性、观察、挂载钩子和使用属性的函数
import useVuelidate from '@vuelidate/core'; // 导入 Vuelidate 核心库
import { useApp } from 'src/composables/app'; // 导入自定义的应用程序组合函数

import { useConfirm } from 'primevue/useconfirm'; // 导入 PrimeVue 的确认对话框组件

export function useAddPage({ store, props, formData, rules = {}, beforeSubmit, afterSubmit }) { // 定义 useAddPage 函数，接受参数包括 store、props、formData、rules、beforeSubmit 和 afterSubmit

	const app = useApp(); // 使用应用程序组合函数
	const attrs = useAttrs(); // 使用属性

	const confirm = useConfirm(); // 使用确认对话框组件

	const storeState = store.state; // 获取存储的状态

	const state = reactive({ // 创建响应式状态对象
		id: null,
		pageReady: false,
		submitted: false,
		saving: false,
	});

	const $v = useVuelidate(rules, formData); // 使用 Vuelidate 进行表单验证

	setFormDefaultValues(); // 设置表单默认值

	const apiUrl = computed(() => { // 计算 API 地址
		return props.apiPath
	});

	function validateForm() { // 验证表单函数
		state.submitted = true; // 设置已提交状态
		$v.value.$validate(); // 执行表单验证
		const isValid = !$v.value.$invalid; // 检查表单是否有效
		if(!isValid){ // 如果表单无效
			app.flashMsg(props.formValidationError, props.formValidationMsg, "error"); // 显示表单验证错误消息
		}
		return isValid; // 返回表单是否有效
	}


	function normalizeFormData(formValues) { // 标准化表单数据函数
		if (typeof formValues === 'string') { // 如果表单值是字符串
			return formValues; // 返回原始字符串
		}
		if (Array.isArray(formValues)) { // 如果表单值是数组
			return formValues.map(form => normalizeFormData(form)); // 递归标准化数组中的每个元素
		}
		if (typeof formValues === 'object') { // 如果表单值是对象
			const postData = { ...formValues } // 创建副本
			Object.keys(postData).forEach(function (key) { // 遍历对象的键
				const fieldValue = postData[key]; // 获取键对应的值
				if (Array.isArray(fieldValue)) { // 如果值是数组
					if(fieldValue.every(item => typeof item === "string")){ // 如果数组的所有元素都是字符串
						postData[key] = fieldValue.toString(); // 将数组转换为字符串
					}
					else{ // 否则
						postData[key] = normalizeFormData(fieldValue); // 递归标准化数组
					}
				}
				else if (fieldValue instanceof Date) { // 如果值是日期对象
					postData[key] = fieldValue.toISOString().slice(0, 19).replace('T', ' '); // 转换为 ISO 格式的字符串
				}
				else if (fieldValue === '') { // 如果值为空字符串
					postData[key] = null; // 将其设为 null
				}
			});
			return postData; // 返回标准化后的对象
		}
		return formValues // 返回原始值
	}

	function submitForm() { // 提交表单函数
		state.submitted = true; // 设置已提交状态
		if (beforeSubmit !== undefined) { // 如果有提交前处理函数
			if (!beforeSubmit()) { return; } // 如果提交前处理函数返回 false，直接返回
		}

		if (!validateForm()) { // 如果表单验证失败
			return; // 直接返回
		}

		const confirmMsg = props.msgBeforeSave; // 获取保存前确认消息
		if (confirmMsg) { // 如果有确认消息
			confirm.require({ // 显示确认对话框
				message: confirmMsg,
				header: props.msgTitle,
				icon: 'pi pi-save',
				accept: async () => { // 用户确认时执行
					saveFormData(); // 保存表单数据
				},
				reject: () => { // 用户拒绝时执行
					//callback to execute when user rejects the action
				}
			});
		}
		else { // 否则
			saveFormData(); // 保存表单数据
		}
	}

	async function saveFormData() { // 保存表单数据函数
		state.saving = true; // 设置保存状态为 true
		const url = apiUrl.value; // 获取 API 地址
		let payload;
		if (Array.isArray(formData)) { // 如果表单数据是数组
			payload = formData.map(form => normalizeFormData(form)); // 标准化数组中的每个表单数据
		}
		else { // 否则
			payload = normalizeFormData(formData) // 标准化单个表单数据
		}

		const data = { url, payload } // 构建请求数据
		try {
			const response = await store.saveRecord(data); // 保存记录
			if (attrs.onSubmitted) { // 如果存在提交后处理函数
				attrs.onSubmitted(response); // 执行提交后处理函数
			}
			else if (afterSubmit) { // 否则，如果存在提交后处理回调函数
				afterSubmit(response); // 执行提交后处理回调函数
			}
		}
		catch (err) { // 捕获异常
			app.showPageRequestError(err); // 显示页面请求错误
		}
		finally { // 最终执行
			state.saving = false; // 设置保存状态为 false
		}
	}

	function setFormDefaultValues() { // 设置表单默认值函数
		state.submitted = false; // 设置已提交状态为 false
		const storeFormData = computed(() => storeState.formData); // 获取存储的表单数据
		const pageData = props.pageData; // 获取页面数据
		const formDefaultValues = { ...pageData, ...storeFormData.value }; // 合并页面数据和存储的表单数据

		if (Array.isArray(formData)) { // 如果表单数据是数组
			formData.forEach(oldFormData => { // 遍历每个表单数据
				Object.assign(oldFormData, formDefaultValues); // 更新表单数据
			})
		}
		else { // 否则
			Object.assign(formData, formDefaultValues); // 更新单个表单数据
		}
	}

	function getErrorClass(field, index) { // 获取错误类函数
		let isInvalid = false; // 默认为无效状态
		if (index === undefined) { // 如果索引未定义
			isInvalid = ($v.value[field]?.$invalid || false) && state.submitted; // 检查字段是否无效并已提交
		}
		else { // 否则，对于多表单验证
			isInvalid = ($v.value.$each.$response.$errors[index][field]?.length || false) && state.submitted; // 检查字段是否无效并已提交
		}
		return { "p-invalid": isInvalid }; // 返回是否无效的类对象
	}

	function isFieldValid(field, index) { // 检查字段是否有效函数
		if (index === undefined) { // 如果索引未定义
			return ($v.value[field]?.$invalid || false) && state.submitted; // 返回字段是否无效并已提交
		}
		else { // 否则
			return ($v.value.$each.$response.$errors[index][field]?.length || false) && state.submitted; // 返回字段是否无效并已提交
		}
	}

	function getFieldError(field, index) { // 获取字段错误函数
		let fieldErrors = null; // 初始化字段错误为 null
		if (index === undefined) { // 如果索引未定义
			fieldErrors = $v.value[field]?.$silentErrors; // 获取字段的静默错误
			if (fieldErrors?.length) { // 如果存在错误
				return fieldErrors[0].$message; // 返回第一个错误消息
			}
		}
		else { // 否则
			fieldErrors = $v.value.$each.$response.$errors[index][field]; // 获取字段的错误
			if (fieldErrors?.length) { // 如果存在错误
				return fieldErrors[0].$message; // 返回第一个错误消息
			}
		}
		return null; // 返回 null
	}

	watch(() => props.pageData, (current) => { // 监听页面数据的变化
		Object.assign(formData, current); // 更新表单数据
	},
		{ deep: true, immediate: true } // 深度监听，并立即执行
	);

	onMounted(() => { // 在挂载时执行
		state.pageReady = true; // 设置页面准备状态为 true
	});


	const computedProps = { // 计算属性
		apiUrl, // API 地址
	}

	const methods = { // 方法对象
		submitForm, // 提交表单
		getErrorClass, // 获取错误类
		getFieldError, // 获取字段错误
		isFieldValid // 检查字段是否有效
	}

	return { // 返回对象
		validateForm, // 验证表单函数
		setFormDefaultValues, // 设置表单默认值函数
		formData, // 表单数据
		state, // 状态
		computedProps, // 计算属性
		methods // 方法
	}

}
