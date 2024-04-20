<template>
    <div class="container">
        <div class="grid justify-content-center">
            <div class="col-12 md:col-6">
				<Message @close="errorMsg=null" class="fadeinUp" v-if="errorMsg" severity="error" key="error">{{errorMsg}}</Message>
                <div class="card text-center">
					<Avatar class="bg-green-500 text-white" size="large" icon="pi pi-check-circle" />
					<div class="text-2xl my-3  font-bold text-green-500"> 
						{{sentMsg}}
					</div>
					<div class="text-500">
						{{ $t('verifyEmailLinkMsg') }}
					</div>
					<hr />
					<div class="text-center">
						<Button :label="$t('resendEmail')" @click="resend()" icon="pi pi-envelope" :loading="loading" />
					</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
	export default {
		props: {},
		data: function () {
			return {
				loading: false,
				errorMsg: null,
				sentMsg: "Email verification link sent to your mailbox"
			};
		},
		methods: {
			resend(){
				let url = "auth/resendverifyemail";
				this.loading = true;
				let formData = {
					token:  this.$route.query.token
				}
				this.$api.post(url, formData).then((response) => {
					this.loading = false;
					this.sentMsg = response.data;
				},
				(request) => {
					this.loading = false;
					this.errorMsg = request?.response?.data || "Unable to complete request";
				});
			}
		},
	};
</script>