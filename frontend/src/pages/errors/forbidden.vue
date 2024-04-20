<template>
    <div class="">
        <div class="grid justify-content-center p-2 lg:p-0" style="min-width:80%">
            <div class="col-12 xl:col-6" style="border-radius:56px; padding:0.3rem; background: linear-gradient(180deg, rgba(247, 149, 48, 0.4) 10%, rgba(247, 149, 48, 0) 30%);">
                <div class="h-full w-full m-0 py-4 px-4" style="border-radius:53px; background: linear-gradient(180deg, var(--surface-50) 38.9%, var(--surface-0));">
                    <div class="flex justify-content-center h-full w-full m-0 px-4" style="border-radius:53px; background: linear-gradient(180deg, var(--surface-50) 38.9%, var(--surface-0));">
                    <div class="grid flex-column align-items-center">
                        <div class="flex justify-content-center align-items-center bg-orange-500 border-circle" style="width:3.2rem; height:3.2rem;">
                            <i class="pi pi-fw pi-lock text-2xl text-50"></i>
                        </div>
                        <div class="text-pink-500 font-bold text-5xl">403</div>
                        <div class="text-900 font-medium text-3xl mb-2">Access Denied</div>
                        <span class="text-gray-600">You do not have the necesary permisions. Please contact admins.</span>
                        
                        <div class="col-12 flex align-items-center py-5 mt-6 border-300 border-bottom-1">
                            <div class="flex justify-content-center align-items-center bg-cyan-400 border-round" style="height:3.5rem; width:3.5rem;">
                                <i class="pi pi-fw pi-table text-50 text-2xl"></i>
                            </div>
                            <div class="ml-4">
                                <router-link to="/">
                                    <p class="text-900 lg:text-xl font-medium mb-0">Frequently Asked Questions</p>
                                </router-link>
                                <span class="text-gray-600">Link to FAQs</span>
                            </div>
                        </div>

                        <div class="col-12 flex align-items-center py-5 border-300 border-bottom-1">
                            <div class="flex justify-content-center align-items-center bg-orange-400 border-round" style="height:3.5rem; width:3.5rem;">
                                <i class="pi pi-fw pi-question-circle text-50 text-2xl"></i>
                            </div>
                            <div class="ml-4">
                                <router-link to="/">
                                    <p class="text-900 lg:text-xl font-medium mb-0">Solution Center</p>
                                </router-link>
                                <span class="text-gray-600">Link to support center</span>
                            </div>
                        </div>
                        
                        <div class="col-12 mt-5 text-center">
                            <router-link to="/" class="text-blue-500">
                                <Button icon="pi pi-arrow-left" class="" label="Go to Dashboard" />
                            </router-link>
                        </div>
                    </div>
                </div>


                    
                </div>
            </div>
        </div>
    </div>
</template>