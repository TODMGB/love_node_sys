<template>
    <div ref="trigger"></div>
</template>

<script>
export default {
    props: {
        options: {
            type: Object,
            default: () => {
                return {
                    // circumstances under which the observer's callback is invoked
                    root: null, // defaults to the browser viewport if not specified or if null
                    threshold: "0", // the degree of intersection between the target element and its root (0 - 1)
                    // threshold of 1.0 means that when 100% of the target is visible within
                    //the element specified by the root option, the callback is invoked
                };
            },
            // Whether you're using the viewport or some other element as the root,the API works the same way,
            // executing a callback function you provide whenever the visibility of the target element changes
            // so that it crosses desired amounts of intersection with the root
        },
    },
    data() {
        return {
            observer: null,
        };
    },

    mounted() {
        this.observer = new IntersectionObserver((entries) => {
            this.handleIntersect(entries[0]);
        }, this.options);

        this.observer.observe(this.$refs.trigger);
    },

    beforeDestroy() {
        this.observer.disconnect();
    },

    methods: {
        handleIntersect(entry) {
            if (entry.isIntersecting) this.$emit("scrollEnd");
        },
    },
};
</script>
