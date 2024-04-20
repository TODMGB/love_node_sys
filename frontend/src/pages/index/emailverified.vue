<template>
    <div class="grid justify-content-center">
        <div class="col-12 md:col-6">
            <div class="card text-center">
                <Avatar class="bg-green-500 text-white" icon="pi pi-check-circle" size="large" />
                <div class="text-2xl my-4 font-bold text-green-500">
                    {{ $t('emailVerificationCompleted') }}
                </div>
                <hr  />
                <router-link to="/">
                    <Button icon="pi pi-home" :label="$t('continue')" />
                </router-link>
            </div>
        </div>
    </div>
</template>