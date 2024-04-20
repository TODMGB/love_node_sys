<template>
    <div class="container">
        <div class="text-center card">
            <Avatar size="large" class="bg-orange-500 text-white" icon="pi pi-user" /> 
            <div class="text-4xl font-bold text-orange-500 my-3">
                {{ $t('promptAccountInReview') }}
            </div>
            <div class="text-primary">
                {{ $t('contactSystemAdmin') }}
            </div>
            <hr />
            <router-link to="/">
                <Button :label="$t('continue')" icon="pi pi-home" />
            </router-link>
        </div>
    </div>
</template>
