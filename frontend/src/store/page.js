import { reactive, ref } from 'vue'; // 导入 Vue 的响应式和引用
import { defineStore } from 'pinia'; // 导入 Pinia 的定义存储函数
import { ApiService } from 'src/services/api'; // 导入 API 服务

function getPageStore(pageName, defaultState = {}) { // 定义获取页面存储的函数，接受页面名称和默认状态
	return defineStore(pageName, () => { // 使用 defineStore 定义存储
		const storeInitialized = ref(false); // 初始化存储是否已初始化的标志
		const pageState = { // 定义页面状态对象
			apiData: null, // API 数据
			records: [], // 记录列表
			currentRecord: null, // 当前记录
			formData: null, // 表单数据
			editRecord: null, // 编辑记录
			filters: {}, // 过滤器
			id: null, // ID
			totalRecords: 0, // 总记录数
			recordCount: 0, // 记录计数
			singleSelect: false, // 单选
			selectedItems: [], // 已选择项
			expandedRows: [], // 展开行
			pagination: { // 分页信息
				page: 1, // 当前页数
				limit: 10, // 每页记录数
				sortBy: '', // 排序字段
				descending: true, // 是否降序
			},
			primaryKey: '', // 主键
			enableCache: false, // 是否启用缓存
			cacheKeys: [], // 缓存键列表
		}

		const initState = { ...pageState, ...defaultState } // 合并初始状态和默认状态
		const state = reactive(initState); // 使用响应式包装状态对象

		function init(data) { // 初始化函数，用于设置初始状态
			Object.assign(state, data); // 合并传入的数据到状态对象
			storeInitialized.value = true; // 设置存储已初始化标志为 true
		}

		async function fetchRecords(args) { // 获取记录函数
			try {
				state.currentRecord = null; // 重置当前记录
				const { url, merge } = args; // 获取参数
				const response = await ApiService.get(url, { cache: state.enableCache }); // 使用 API 服务获取数据
				const apiData = response.data; // 获取 API 数据
				state.apiData = apiData; // 更新 API 数据
				if (apiData) { // 如果 API 数据存在
					const newRecords = apiData.records || apiData; // 获取新记录
					if (merge) { // 如果是合并模式
						state.records = state.records.concat(newRecords); // 合并记录
					}
					else { // 否则
						state.records = newRecords; // 设置为新记录
					}
					state.totalRecords = apiData?.totalRecords; // 更新总记录数
					state.recordCount = apiData?.recordCount; // 更新记录计数
				}
				saveCacheKey(response); // 保存缓存键
				return apiData; // 返回 API 数据
			}
			catch (err) { // 捕获异常
				throw err; // 抛出异常
			}
		}

		async function fetchRecord(url) { // 获取单个记录函数
			try {
				const response = await ApiService.get(url, { cache: false }); // 使用 API 服务获取数据
				const apiData = response.data; // 获取 API 数据
				if (apiData) { // 如果 API 数据存在
					state.currentRecord = apiData; // 更新当前记录
				}
				return apiData; // 返回 API 数据
			}
			catch (err) { // 捕获异常
				throw err; // 抛出异常
			}
		}

		async function fetchEditRecord(url) { // 获取编辑记录函数
			try {
				const response = await ApiService.get(url, { cache: false }); // 使用 API 服务获取数据
				const apiData = response.data; // 获取 API 数据
				if (apiData) { // 如果 API 数据存在
					state.editRecord = apiData; // 更新编辑记录
				}
				return apiData; // 返回 API 数据
			}
			catch (err) { // 捕获异常
				throw err; // 抛出异常
			}
		}

		async function saveRecord(args) { // 保存记录函数
			try {
				const { url, payload } = args; // 获取参数
				const response = await ApiService.post(url, payload); // 使用 API 服务提交数据
				const newRecord = response.data; // 获取新记录
				if (newRecord) { // 如果新记录存在
					if (Array.isArray(newRecord)) { // 如果是数组
						for (let index = 0; index < newRecord.length; index++) { // 遍历新记录
							state.records.unshift(newRecord[index]); // 将新记录添加到记录列表顶部
						}
					}
					else { // 否则
						state.records.unshift(newRecord); // 将新记录添加到记录列表顶部
					}
				}
				await invalidateCache(); // 使缓存失效
				return newRecord; // 返回新记录
			}
			catch (err) { // 捕获异常
				throw err; // 抛出异常
			}
		}

		async function updateRecord(args) { // 更新记录函数
			try {
				let { url, payload, id } = args; // 获取参数
				const response = await ApiService.post(url, payload); // 使用 API 服务提交数据
				const updatedRecord = response.data; // 获取更新后的记录
				id = id || payload[state.primaryKey]; // 获取记录 ID
				if (updatedRecord) { // 如果更新后的记录存在
					const item = state.records.find(item => item[state.primaryKey] == id); // 查找对应的记录
					if (item) { // 如果记录存在
						Object.assign(item, updatedRecord); // 更新记录
						state.currentRecord = item; // 更新当前记录
					}
					if (state.currentRecord) { // 如果当前记录存在
						Object.assign(state.currentRecord, updatedRecord); // 更新当前记录
					}
				}
				await invalidateCache(); // 使缓存失效
				return updatedRecord // 返回更新后的记录
			}
			catch (err) { // 捕获异常
				throw err; // 抛出异常
			}
		}

		async function deleteRecord(args) { // 删除记录函数
			try {
				const { url, id } = args; // 获取参数
				const response = await ApiService.get(url); // 使用 API 服务获取数据
				const deletedRecordIds = response.data; // 获取已删除的记录 ID
				if (Array.isArray(id)) { // 如果 ID 是数组
					id.forEach((itemId) => { // 遍历 ID
						let itemIndex = state.records.findIndex(item => item[state.primaryKey] == itemId); // 查找对应的记录索引
						if (itemIndex != -1) { // 如果找到记录
							state.records.splice(itemIndex, 1); // 删除记录
						}
					})
				}
				else { // 否则
					let itemIndex = state.records.findIndex(item => item[state.primaryKey] == id); // 查找对应的记录索引
					if (itemIndex != -1) { // 如果找到记录
						state.records.splice(itemIndex, 1); // 删除记录
					}
				}
				await invalidateCache(); // 使缓存失效
				return deletedRecordIds; // 返回已删除的记录 ID
			}
			catch (err) { // 捕获异常
				throw err; // 抛出异常
			}
		}

		async function invalidateCache() { // 使缓存失效函数
			state.cacheKeys.forEach(async (id) => { // 遍历缓存键列表
				await ApiService.axios().storage.remove(id); // 删除对应的缓存
			});
		}

		async function saveCacheKey(response) { // 保存缓存键函数
			const id = response.id; // 获取缓存键
			if (!state.cacheKeys.includes(id)) { // 如果缓存键不存在于缓存键列表中
				state.cacheKeys.push(id); // 添加到缓存键列表
			}
		}

		function setFormData(formData) { // 设置表单数据函数
			state.formData = formData; // 设置表单数据
		}

		function resetPageRecords() { // 重置页面记录函数
			state.records = []; // 清空记录列表
			state.recordCount = 0; // 重置记录计数
			state.totalRecords = 0; // 重置总记录数
			state.pagination.page = 1; // 重置分页当前页数
			state.pagination.totalRecords = 0; // 重置分页总记录数
		}

		return { // 返回对象
			state, // 状态对象
			init, // 初始化函数
			storeInitialized, // 存储是否已初始化的标志
			fetchRecords, // 获取记录函数
			fetchRecord, // 获取单个记录函数
			fetchEditRecord, // 获取编辑记录函数
			saveRecord, // 保存记录函数
			updateRecord, // 更新记录函数
			deleteRecord, // 删除记录函数
			setFormData, // 设置表单数据函数
			resetPageRecords // 重置页面记录函数
		}
	})()
}

export function usePageStore(pageName, defaultState) { // 定义使用页面存储的函数
	const store = getPageStore(pageName, defaultState); // 获取页面存储
	if (!store.storeInitialized && defaultState) { // 如果存储未初始化且存在默认状态
		store.init(defaultState); // 初始化存储
	}
	return store; // 返回存储
}
