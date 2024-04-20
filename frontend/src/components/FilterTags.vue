<template>
    <template v-for="(filter, key) in filters" :key="key">
        <div v-if="filterHasValue(filter)" :class="tagClass">
            {{ filter.tag || key }}
            
            <Chip v-if="isMultipleFilter(filter)" v-for="val in filter.value" :key="`filtertag-${val}`"
            :class="chipClass" removable @remove="removeFilter(filter, val)" :label="getFilterLabel(filter, val)" />
            
            <Chip v-else :class="chipClass" removable @remove="removeFilter(filter)" :label="getFilterLabel(filter)" />
        </div>
    </template>
</template>

<script setup>
const props = defineProps({
    controller: {
        type: Object,
        default: () => { }
    },
    chipClass: {
        type: String,
        default: 'bg-primary font-medium text-white',
    },
    tagClass: {
        type: String,
        default: 'px-3 p-2  m-1 mb-3 card',
    }
});
function isMultipleFilter(filter) {
    return (filter.valueType === 'multiple' || filter.valueType === 'multiple-date');
}

const { filterHasValue, getFilterLabel, removeFilter, filters } = props.controller
</script>