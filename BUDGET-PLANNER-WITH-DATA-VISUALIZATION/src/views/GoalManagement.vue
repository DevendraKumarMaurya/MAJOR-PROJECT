<template>
  <div class="goal-management">
    <div class="page-header">
      <h1>Goal Management</h1>
      <p>Set, track, and achieve your financial goals</p>
    </div>

    <GoalList @add="showAddModal" @edit="showEditModal" />

    <!-- Add/Edit Goal Modal -->
    <GoalForm v-if="showModal" :goal="selectedGoal" @close="closeModal" />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useBudgetStore } from '@/stores/budget'
import GoalList from '@/components/lists/GoalList.vue'
import GoalForm from '@/components/forms/GoalForm.vue'

export default {
  name: 'GoalManagement',
  components: {
    GoalList,
    GoalForm
  },
  setup() {
    const budgetStore = useBudgetStore()
    const showModal = ref(false)
    const selectedGoal = ref(null)

    const showAddModal = () => {
      selectedGoal.value = null
      showModal.value = true
    }

    const showEditModal = (goal) => {
      selectedGoal.value = goal
      showModal.value = true
    }

    const closeModal = () => {
      showModal.value = false
      selectedGoal.value = null
    }

    onMounted(() => {
      budgetStore.fetchGoals()
    })

    return {
      budgetStore,
      showModal,
      selectedGoal,
      showAddModal,
      showEditModal,
      closeModal
    }
  }
}
</script>

<style scoped>
.goal-management {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  margin: 0 0 10px 0;
  color: #333;
}

.page-header p {
  margin: 0;
  color: #666;
  font-size: 16px;
}
</style>
