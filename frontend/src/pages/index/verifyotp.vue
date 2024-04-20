<template>
	<div class="container">
		<div class="grid justify-content-center">
			<div class="col-12 md:col-5">
			<Message @close="errorMsg=null" class="fadeinUp" v-if="errorMsg" severity="error" key="error">{{errorMsg}}</Message>
				<div class="card">
					<div class="mb-4">
						<div class="grid align-items-center justify-content-between">
							<div class="col-2">
								<Avatar class="bg-green-500 text-white" icon="pi pi-check-circle" size="large" />
							</div>
							<div class="col">
								<div class="text-2xl font-bold">{{ $t('otpVerification') }}</div>
							</div>
							<div class="col-3">
								<div class="text-2xl font-bold text-info">{{ countDown }}</div>
							</div>
						</div>
						<div class="text-primary">{{ $t('otpSentSMS') }}</div>
					</div>
					<form ref="observer" tag="form" @submit.prevent="startOtpValidation()">
						<div class="grid justify-content-between">
							<div class="col">
								<InputText class="w-full text-center otp-input" :placeholder="$t('enterOtp')" v-model="otpCode" required="required" type="text" />
							</div>
							<div class="col-3 tetx-right">
								<Button class="p-button-lg" :loading="loading" type="submit" :label="$t('verify')" />
							</div>
						</div>
						<div class="flex align-items-center justify-content-between">
							<div class="text-sm text-500">
								Didn't receive OTP ?
							</div>
							<div>
								<Button class="p-button-text" :disabled="!canResend" :loading="resending" @click="resendOtp()" type="button" label="Resend..." />
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import { useAuthStore } from 'src/store/auth';
	export default {
		setup() {
			const store = useAuthStore()
			return { store }
		},
		props: {},
		data: function () {
			return {
				otpCode: '',
				loading: false,
				resending: false,
				canResend: false,
				errorMsg: null,
				countDown: '00:00',
			};
		},
		methods: {
			async startOtpValidation() {
				if (this.otpCode) {
					this.loading = true;
					this.errorMsg = '';
					let formData = {
						otp_code: this.otpCode,
						token: this.$route.query.token
					}
					let rememberUser = false;
					let url = "/auth/validateotp";
					let payload = {
						formData,
						rememberUser,
						url
					};
					try{
						this.loading = true;
						const loginData = await this.store.login(payload);
						if (loginData.token) {
							window.location = "/"; //user is now logged in. Navigate to home page
						}
						else{
							this.$router.push(loginData.nextpage);
						}
					}
					catch(request){
						this.errorMsg = request?.response?.data || "Unable to validate otp";
					}
					finally{
						this.loading = false;
					}
				}
			},
			async resendOtp() {
				this.resending = true;
				this.errorMsg = '';
				let formData = { token: this.$route.query.token }
				let url = "/auth/resendotp";
				try{
					await this.$api.post(url, formData);
					this.canResend = false;
					this.startCountDown();
					this.$q.notify({message: "OTP Sent Successfully", type: 'positive'});
				}
				catch(request){
					this.errorMsg = request?.response?.data || "Unable to resend otp";
				}
				finally{
					this.resending = false;
				}
			},
			startCountDown() {
				let duration = parseInt(this.$route.query.duration) || 5; // in minutes
				let minutes = 60 * duration;
				let timer = minutes;
				let seconds;
				var self = this;
				const interval = setInterval(function () {
					minutes = parseInt(timer / 60, 10);
					seconds = parseInt(timer % 60, 10);
					minutes = minutes < 10 ? "0" + minutes : minutes;
					seconds = seconds < 10 ? "0" + seconds : seconds;
					self.countDown = minutes + ":" + seconds;
					if (--timer < 0) {
						clearInterval(interval);
						self.errorMsg = "OTP has expired";
						self.canResend = true;
					}
				}, 1000);
			}
		},
		mounted() {
			this.startCountDown();
		},
	};
</script>
<style>
	.otp-input {
		font-weight: bold;
		font-size: 20px;
		text-align: center;
		letter-spacing: 10px;
	}
	.otp-input::placeholder {
		font-weight: normal;
		font-size: 14px;
		text-align: center;
		letter-spacing: 1px;
	}
</style>