<template>
  <div class="income-management">
    <div class="page-header">
      <h1>Income Management</h1>
      <p>Track and manage all your income sources</p>
    </div>

    <IncomeList @add="showAddModal" @edit="showEditModal" />

    <!-- Add/Edit Income Modal -->
    <IncomeForm v-if="showModal" :income="selectedIncome" @close="closeModal" />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useBudgetStore } from '@/stores/budget'
import IncomeList from '@/components/lists/IncomeList.vue'
import IncomeForm from '@/components/forms/IncomeForm.vue'

export default {
  name: 'IncomeManagement',
  components: {
    IncomeList,
    IncomeForm
  },
  setup() {
    const budgetStore = useBudgetStore()
    const showModal = ref(false)
    const selectedIncome = ref(null)

    const showAddModal = () => {
      selectedIncome.value = null
      showModal.value = true
    }

    const showEditModal = (income) => {
      selectedIncome.value = income
      showModal.value = true
    }

    const closeModal = () => {
      showModal.value = false
      selectedIncome.value = null
    }

    onMounted(() => {
      budgetStore.fetchIncomes()
    })

    return {
      budgetStore,
      showModal,
      selectedIncome,
      showAddModal,
      showEditModal,
      closeModal
    }
  }
}
</script>

<style scoped>
.income-management {
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
