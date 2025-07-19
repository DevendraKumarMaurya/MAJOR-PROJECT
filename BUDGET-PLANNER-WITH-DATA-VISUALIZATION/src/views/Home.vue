<template>
  <div class="home">
    <Dashboard />
  </div>
</template>

<script>
import Dashboard from '@/components/ui/Dashboard.vue'

export default {
  name: 'Home',
  components: {
    Dashboard
  }
}
</script>

<style scoped>
.home {
  min-height: 100%;
}
</style>
