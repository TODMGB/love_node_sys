<template>
    <div class="container">
        <div class="text-center card">
            <Avatar size="large" class="bg-green-500 text-white" icon="pi pi-check-circle" />    
            <div class="text-4xl my-3 font-bold text-green-500 my-3">
                {{ $t('congratulations') }}
            </div>
            <div class="text-2xl text-primary">
                {{ $t('promptAccountCreated') }}
            </div>
            <hr />
            <router-link to="/">
                <Button :label="$t('continue')" icon="pi pi-home" />
            </router-link>
        </div>
    </div>
</template>
