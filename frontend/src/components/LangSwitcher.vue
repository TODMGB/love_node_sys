<template>
    <SplitButton :label="langName" :model="menuItems" />
</template>
<script>
export default {
    data() {
        return {
            locales: this.$menus.locales,
        };
    },
    computed: {
        menuItems (){
            let menus = []
            for (let [key, value] of Object.entries(this.locales)) {
                menus.push({
                    label: value,
                    command: ()=>{this.changeLocale(key)}
                });
            }
            return menus
        },
        langName() {
            let lang = this.$i18n.locale
            let name = this.locales[lang] || lang;
            return name;
        },
    },
    methods: {
        changeLocale(locale) {
            this.$localStore.setLocale(locale);
            window.location.reload();
        },
    }
};
</script>