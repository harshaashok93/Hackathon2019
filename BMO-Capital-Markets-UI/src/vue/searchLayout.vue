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

<style>
  .search-layout {
    margin-left: 40px;
    width: 100%;
    border-top: 1px solid #e9e9e9;
    box-shadow: 1px 0 4px 1px rgba(0,0,0,0.1)
  }
</style>
