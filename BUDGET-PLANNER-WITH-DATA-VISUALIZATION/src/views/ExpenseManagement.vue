<template>
  <div class="expense-management">
    <div class="page-header">
      <h1>Expense Management</h1>
      <p>Track and manage all your expenses by category</p>
    </div>

    <ExpenseList @add="showAddModal" @edit="showEditModal" />

    <!-- Add/Edit Expense Modal -->
    <ExpenseForm v-if="showModal" :expense="selectedExpense" @close="closeModal" />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useBudgetStore } from '@/stores/budget'
import ExpenseList from '@/components/lists/ExpenseList.vue'
import ExpenseForm from '@/components/forms/ExpenseForm.vue'

export default {
  name: 'ExpenseManagement',
  components: {
    ExpenseList,
    ExpenseForm
  },
  setup() {
    const budgetStore = useBudgetStore()
    const showModal = ref(false)
    const selectedExpense = ref(null)

    const showAddModal = () => {
      selectedExpense.value = null
      showModal.value = true
    }

    const showEditModal = (expense) => {
      selectedExpense.value = expense
      showModal.value = true
    }

    const closeModal = () => {
      showModal.value = false
      selectedExpense.value = null
    }

    onMounted(() => {
      budgetStore.fetchExpenses()
    })

    return {
      budgetStore,
      showModal,
      selectedExpense,
      showAddModal,
      showEditModal,
      closeModal
    }
  }
}
</script>

<style scoped>
.expense-management {
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
