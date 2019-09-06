<template>
  <div class="search-layout">
    <DropdownForm
      :dropdownData="dropdownData"
    />
  </div>
</template>
<script>
import DropdownForm from './DropdownForm';
export default {
  name: 'SearchLayout',
  components: {
    DropdownForm
  },
  props: {
    search: {
      type: Array,
      default: () => [],
    },
    dropdownData: {
        type: Object,
        default: () => {},
    }
  },
}
</script>
