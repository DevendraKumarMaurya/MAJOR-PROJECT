<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h2>Dashboard</h2>
      <div class="refresh-btn">
        <button @click="refreshData" class="btn btn-primary" :disabled="budgetStore.loading">
          {{ budgetStore.loading ? 'Loading...' : 'Refresh Data' }}
        </button>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="summary-cards grid grid-1 sm:grid-cols-2 lg:grid-cols-3">
      <div class="card summary-card income">
        <div class="summary-icon">💰</div>
        <div class="summary-info">
          <h3>${{ budgetStore.totalIncome.toLocaleString() }}</h3>
          <p>Total Income</p>
        </div>
      </div>

      <div class="card summary-card expense">
        <div class="summary-icon">💸</div>
        <div class="summary-info">
          <h3>${{ budgetStore.totalExpenses.toLocaleString() }}</h3>
          <p>Total Expenses</p>
        </div>
      </div>

      <div class="card summary-card balance" :class="{ negative: budgetStore.netBalance < 0 }">
        <div class="summary-icon">💳</div>
        <div class="summary-info">
          <h3>${{ budgetStore.netBalance.toLocaleString() }}</h3>
          <p>Net Balance</p>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="charts-section grid grid-1 lg:grid-cols-2">
      <div class="card">
        <h3 class="chart-title">Expenses by Category</h3>
        <ChartPie v-if="Object.keys(budgetStore.expensesByCategory).length > 0" :data="budgetStore.expensesByCategory"
          title="Expense Distribution" />
        <div v-else class="no-data">
          <p>No expense data available</p>
        </div>
      </div>

      <div class="card">
        <h3 class="chart-title">Monthly Income vs Expenses</h3>
        <ChartBar v-if="Object.keys(budgetStore.monthlyData).length > 0" :data="budgetStore.monthlyData"
          title="Monthly Comparison" />
        <div v-else class="no-data">
          <p>No monthly data available</p>
        </div>
      </div>
    </div>

    <!-- Goals Section -->
    <div class="goals-section">
      <div class="card">
        <h3>Goals Progress</h3>
        <div v-if="budgetStore.goals.length > 0" class="goals-list">
          <div v-for="goal in budgetStore.goals" :key="goal.id" class="goal-item">
            <div class="goal-header">
              <h4>{{ goal.name }}</h4>
              <span class="goal-deadline">Due: {{ formatDate(goal.deadline) }}</span>
            </div>
            <div class="goal-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: getGoalProgress(goal) + '%' }"></div>
              </div>
              <span class="progress-text">
                ${{ (budgetStore.netBalance > 0 ? Math.min(budgetStore.netBalance, goal.targetAmount) :
                  0).toLocaleString() }}
                / ${{ goal.targetAmount.toLocaleString() }}
                ({{ getGoalProgress(goal) }}%)
              </span>
            </div>
            <p v-if="goal.description" class="goal-description">{{ goal.description }}</p>
          </div>
        </div>
        <div v-else class="no-data">
          <p>No goals set yet. Create your first goal!</p>
        </div>
      </div>
    </div>

    <!-- Recent Transactions -->
    <div class="transactions-section grid grid-1 lg:grid-cols-2">
      <div class="card">
        <div class="card-header">
          <h3>Recent Income</h3>
          <router-link to="/income" class="view-all-link">View All</router-link>
        </div>
        <div v-if="budgetStore.incomes.length > 0" class="transactions-list">
          <div v-for="income in recentIncomes" :key="income.id" class="transaction-item income">
            <div class="transaction-info">
              <span class="transaction-source">{{ income.source }}</span>
              <span class="transaction-date">{{ formatDate(income.date) }}</span>
            </div>
            <div class="transaction-right">
              <span class="transaction-amount">+${{ income.amount.toLocaleString() }}</span>
              <div class="transaction-actions">
                <button @click="editIncome(income)" class="action-btn edit" title="Edit">✏️</button>
                <button @click="deleteIncome(income)" class="action-btn delete" title="Delete">🗑️</button>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="no-data">
          <p>No income records yet</p>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3>Recent Expenses</h3>
          <router-link to="/expenses" class="view-all-link">View All</router-link>
        </div>
        <div v-if="budgetStore.expenses.length > 0" class="transactions-list">
          <div v-for="expense in recentExpenses" :key="expense.id" class="transaction-item expense">
            <div class="transaction-info">
              <span class="transaction-source">{{ expense.category }}</span>
              <span class="transaction-date">{{ formatDate(expense.date) }}</span>
            </div>
            <div class="transaction-right">
              <span class="transaction-amount">-${{ expense.amount.toLocaleString() }}</span>
              <div class="transaction-actions">
                <button @click="editExpense(expense)" class="action-btn edit" title="Edit">✏️</button>
                <button @click="deleteExpense(expense)" class="action-btn delete" title="Delete">🗑️</button>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="no-data">
          <p>No expense records yet</p>
        </div>
      </div>
    </div>

    <!-- Edit Modals -->
    <IncomeForm v-if="showIncomeForm" :income="selectedIncome" @close="closeIncomeForm" />
    <ExpenseForm v-if="showExpenseForm" :expense="selectedExpense" @close="closeExpenseForm" />

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="cancelDelete">
      <div class="modal-content delete-modal" @click.stop>
        <div class="modal-header">
          <h3>Confirm Delete</h3>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete this {{ deleteType }}?</p>
          <div class="delete-details">
            <strong>{{ itemToDelete?.source || itemToDelete?.category }}</strong> - ${{
              itemToDelete?.amount?.toLocaleString() }}
          </div>
        </div>
        <div class="modal-actions">
          <button @click="cancelDelete" class="btn btn-secondary">Cancel</button>
          <button @click="confirmDelete" class="btn btn-danger" :disabled="deleteLoading">
            {{ deleteLoading ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useBudgetStore } from '@/stores/budget'
import ChartPie from '@/components/charts/ChartPie.vue'
import ChartBar from '@/components/charts/ChartBar.vue'
import IncomeForm from '@/components/forms/IncomeForm.vue'
import ExpenseForm from '@/components/forms/ExpenseForm.vue'

export default {
  name: 'Dashboard',
  components: {
    ChartPie,
    ChartBar,
    IncomeForm,
    ExpenseForm
  },
  setup() {
    const budgetStore = useBudgetStore()
    const showIncomeForm = ref(false)
    const showExpenseForm = ref(false)
    const selectedIncome = ref(null)
    const selectedExpense = ref(null)
    const showDeleteModal = ref(false)
    const itemToDelete = ref(null)
    const deleteType = ref('')
    const deleteLoading = ref(false)

    const recentIncomes = computed(() => {
      return budgetStore.incomes.slice(0, 5)
    })

    const recentExpenses = computed(() => {
      return budgetStore.expenses.slice(0, 5)
    })

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    const getGoalProgress = (goal) => {
      const currentSavings = budgetStore.netBalance > 0 ? Math.min(budgetStore.netBalance, goal.targetAmount) : 0
      return Math.round((currentSavings / goal.targetAmount) * 100)
    }

    const refreshData = async () => {
      await budgetStore.fetchData()
    }

    // Edit functions
    const editIncome = (income) => {
      selectedIncome.value = income
      showIncomeForm.value = true
    }

    const editExpense = (expense) => {
      selectedExpense.value = expense
      showExpenseForm.value = true
    }

    const closeIncomeForm = () => {
      showIncomeForm.value = false
      selectedIncome.value = null
    }

    const closeExpenseForm = () => {
      showExpenseForm.value = false
      selectedExpense.value = null
    }

    // Delete functions
    const deleteIncome = (income) => {
      itemToDelete.value = income
      deleteType.value = 'income'
      showDeleteModal.value = true
    }

    const deleteExpense = (expense) => {
      itemToDelete.value = expense
      deleteType.value = 'expense'
      showDeleteModal.value = true
    }

    const confirmDelete = async () => {
      if (!itemToDelete.value) return

      deleteLoading.value = true
      try {
        if (deleteType.value === 'income') {
          await budgetStore.deleteIncome(itemToDelete.value.id)
        } else {
          await budgetStore.deleteExpense(itemToDelete.value.id)
        }
        cancelDelete()
      } catch (error) {
        console.error('Failed to delete:', error)
      } finally {
        deleteLoading.value = false
      }
    }

    const cancelDelete = () => {
      showDeleteModal.value = false
      itemToDelete.value = null
      deleteType.value = ''
      deleteLoading.value = false
    }

    onMounted(() => {
      refreshData()
    })

    return {
      budgetStore,
      recentIncomes,
      recentExpenses,
      showIncomeForm,
      showExpenseForm,
      selectedIncome,
      selectedExpense,
      showDeleteModal,
      itemToDelete,
      deleteType,
      deleteLoading,
      formatDate,
      getGoalProgress,
      refreshData,
      editIncome,
      editExpense,
      closeIncomeForm,
      closeExpenseForm,
      deleteIncome,
      deleteExpense,
      confirmDelete,
      cancelDelete
    }
  }
}
</script>

<style scoped>
.dashboard {
  max-width: 100%;
  margin: 0 auto;
  padding: 0;
}

@media (min-width: 1200px) {
  .dashboard {
    max-width: 1200px;
    padding: 0 1rem;
  }
}

.dashboard-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

@media (min-width: 640px) {
  .dashboard-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
}

.dashboard-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
}

@media (min-width: 768px) {
  .dashboard-header h2 {
    font-size: 1.875rem;
  }
}

.summary-cards {
  margin-bottom: 1.5rem;
}

@media (min-width: 768px) {
  .summary-cards {
    margin-bottom: 2rem;
  }
}

.summary-card {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-left: 4px solid;
  min-height: 80px;
}

@media (min-width: 768px) {
  .summary-card {
    padding: 1.25rem;
    min-height: 100px;
  }
}

.summary-card.income {
  border-left-color: #28a745;
}

.summary-card.expense {
  border-left-color: #dc3545;
}

.summary-card.balance {
  border-left-color: #007bff;
}

.summary-card.balance.negative {
  border-left-color: #dc3545;
}

.summary-icon {
  font-size: 1.5rem;
  margin-right: 0.75rem;
  flex-shrink: 0;
}

@media (min-width: 768px) {
  .summary-icon {
    font-size: 2rem;
    margin-right: 1rem;
  }
}

.summary-info h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #333;
  word-break: break-word;
}

@media (min-width: 768px) {
  .summary-info h3 {
    font-size: 1.5rem;
  }
}

.summary-info p {
  margin: 0.25rem 0 0 0;
  color: #666;
  font-size: 0.75rem;
}

@media (min-width: 768px) {
  .summary-info p {
    font-size: 0.875rem;
  }
}

.charts-section {
  margin-bottom: 1.5rem;
}

@media (min-width: 768px) {
  .charts-section {
    margin-bottom: 2rem;
  }
}

.chart-title {
  margin: 0 0 1rem 0;
  color: #333;
  text-align: center;
  font-size: 1rem;
}

@media (min-width: 768px) {
  .chart-title {
    margin: 0 0 1.25rem 0;
    font-size: 1.125rem;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.card-header h3 {
  margin: 0;
  color: #333;
}

.view-all-link {
  color: #007bff;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
}

.view-all-link:hover {
  text-decoration: underline;
}

.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.transaction-item:last-child {
  border-bottom: none;
}

.transaction-item:hover {
  background-color: #f8f9fa;
  margin: 0 -10px;
  padding: 12px 10px;
  border-radius: 4px;
}

.transaction-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.transaction-actions {
  display: flex;
  gap: 5px;
  opacity: 0;
  transition: opacity 0.2s;
}

.transaction-item:hover .transaction-actions {
  opacity: 1;
}

.action-btn {
  background: none;
  border: none;
  padding: 4px 6px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s;
}

.action-btn.edit:hover {
  background-color: #e3f2fd;
}

.action-btn.delete:hover {
  background-color: #ffebee;
}

.delete-modal {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.modal-body {
  padding: 20px;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding: 20px;
  border-top: 1px solid #e0e0e0;
}

.delete-details {
  margin-top: 10px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 4px solid #dc3545;
}

.goals-section {
  margin-bottom: 30px;
}

.goals-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.goal-item {
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #f8f9fa;
}

.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.goal-header h4 {
  margin: 0;
  color: #333;
}

.goal-deadline {
  font-size: 12px;
  color: #666;
}

.goal-progress {
  margin-bottom: 10px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 5px;
}

.progress-fill {
  height: 100%;
  background: #007bff;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: #666;
}

.goal-description {
  margin: 10px 0 0 0;
  font-size: 14px;
  color: #666;
}

.transactions-section {
  margin-bottom: 30px;
}

.transactions-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  background: #f8f9fa;
}

.transaction-info {
  display: flex;
  flex-direction: column;
}

.transaction-source {
  font-weight: 500;
  color: #333;
}

.transaction-date {
  font-size: 12px;
  color: #666;
}

.transaction-amount {
  font-weight: 600;
}

.transaction-item.income .transaction-amount {
  color: #28a745;
}

.transaction-item.expense .transaction-amount {
  color: #dc3545;
}

.no-data {
  text-align: center;
  padding: 40px;
  color: #666;
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .grid-2,
  .grid-3 {
    grid-template-columns: 1fr;
  }
}
</style>
