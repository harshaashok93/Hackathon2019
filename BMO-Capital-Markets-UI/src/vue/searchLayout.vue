<template>
  <div class="search-layout">
    <div class="input-group mb-3">
      <select class="custom-select" id="inputGroupSelect01">
        <option v-for="item in dropdownData.companies">{{item}}</option>
      </select>
       <select class="custom-select" id="inputGroupSelect02">
        <option v-for="item in dropdownData.analysts">{{item}}</option>
      </select>
       <select class="custom-select" id="inputGroupSelect03">
        <option v-for="item in dropdownData.sectors">{{item}}</option>
      </select>
    </div>
    <ul>
        <li v-for="item in search">
            {{ item.name }}
        </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'SearchLayout',
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

