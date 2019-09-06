<template>
  <div>
    {{search}}
  </div>
</template>
<script>
export default {
  name: 'SearchLayout',
  props: {
    search: {
      type: Array,
      default: () => [],
    }
  },
}
</script>

