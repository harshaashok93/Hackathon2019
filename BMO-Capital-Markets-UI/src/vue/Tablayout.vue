<template>
  <div>
    <ul>
        <li v-for="item in tab1">
            {{ item._source.title }}
        </li>
    </ul>
    <ul>
        <li v-for="item in tab2">
            {{ item._source.title }}
        </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'Tablayout',
  props: {
    tab1: {
      type: Array,
      default: () => [],
    },
    tab2: {
      type: Array,
      default: () => [],
    }
  },
}
</script>

