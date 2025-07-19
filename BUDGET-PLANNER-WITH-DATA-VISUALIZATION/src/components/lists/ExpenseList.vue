<template>
  <div class="expense-list">
    <div class="list-header">
      <h3>Expense Records</h3>
      <button @click="$emit('add')" class="btn btn-danger">
        <i class="icon">➕</i> Add Expense
      </button>
    </div>

    <div v-if="budgetStore.loading" class="loading">
      Loading expense records...
    </div>

    <div v-else-if="budgetStore.expenses.length === 0" class="no-data">
      <p>No expense records found. Add your first expense!</p>
    </div>

    <!-- Mobile View -->
    <div v-else class="mobile-view md:hidden">
      <div v-for="expense in budgetStore.expenses" :key="expense.id" class="mobile-card">
        <div class="mobile-card-header">
          <h4 class="mobile-card-title">{{ expense.category }}</h4>
          <div class="mobile-card-actions">
            <button @click="editExpense(expense)" class="btn btn-sm btn-primary" title="Edit">
              ✏️
            </button>
            <button @click="deleteExpense(expense)" class="btn btn-sm btn-danger" title="Delete">
              🗑️
            </button>
          </div>
        </div>
        <div class="mobile-card-content">
          <div class="mobile-card-row">
            <span class="mobile-card-label">Amount:</span>
            <span class="mobile-card-value expense-amount">${{ expense.amount.toLocaleString() }}</span>
          </div>
          <div class="mobile-card-row">
            <span class="mobile-card-label">Date:</span>
            <span class="mobile-card-value">{{ formatDate(expense.date) }}</span>
          </div>
          <div class="mobile-card-row" v-if="expense.notes">
            <span class="mobile-card-label">Notes:</span>
            <span class="mobile-card-value">{{ expense.notes }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Desktop View -->
    <div v-else class="table-container hidden md:block">
      <table class="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="expense in budgetStore.expenses" :key="expense.id">
            <td>{{ formatDate(expense.date) }}</td>
            <td>
              <span class="category-badge" :class="getCategoryClass(expense.category)">
                {{ expense.category }}
              </span>
            </td>
            <td class="amount expense-amount">${{ expense.amount.toLocaleString() }}</td>
            <td>{{ expense.notes || '-' }}</td>
            <td class="actions">
              <button @click="editExpense(expense)" class="btn btn-sm btn-primary" title="Edit">
                ✏️
              </button>
              <button @click="deleteExpense(expense)" class="btn btn-sm btn-danger" title="Delete">
                🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="cancelDelete">
      <div class="modal-content delete-modal" @click.stop>
        <div class="modal-header">
          <h3>Confirm Delete</h3>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete this expense record?</p>
          <div class="delete-details">
            <strong>{{ expenseToDelete?.category }}</strong> - ${{ expenseToDelete?.amount?.toLocaleString() }}
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
import { ref } from 'vue'
import { useBudgetStore } from '@/stores/budget'

export default {
  name: 'ExpenseList',
  emits: ['edit', 'add'],
  setup(props, { emit }) {
    const budgetStore = useBudgetStore()
    const showDeleteModal = ref(false)
    const expenseToDelete = ref(null)
    const deleteLoading = ref(false)

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString()
    }

    const getCategoryClass = (category) => {
      const categoryMap = {
        'Food': 'food',
        'Transportation': 'transportation',
        'Entertainment': 'entertainment',
        'Shopping': 'shopping',
        'Bills': 'bills',
        'Healthcare': 'healthcare',
        'Education': 'education',
        'Other': 'other'
      }
      return categoryMap[category] || 'other'
    }

    const editExpense = (expense) => {
      emit('edit', expense)
    }

    const deleteExpense = (expense) => {
      expenseToDelete.value = expense
      showDeleteModal.value = true
    }

    const confirmDelete = async () => {
      if (!expenseToDelete.value) return

      deleteLoading.value = true
      try {
        await budgetStore.deleteExpense(expenseToDelete.value.id)
        showDeleteModal.value = false
        expenseToDelete.value = null
      } catch (error) {
        console.error('Failed to delete expense:', error)
      } finally {
        deleteLoading.value = false
      }
    }

    const cancelDelete = () => {
      showDeleteModal.value = false
      expenseToDelete.value = null
    }

    return {
      budgetStore,
      showDeleteModal,
      expenseToDelete,
      deleteLoading,
      formatDate,
      getCategoryClass,
      editExpense,
      deleteExpense,
      confirmDelete,
      cancelDelete
    }
  }
}
</script>

<style scoped>
.expense-list {
  background: white;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

@media (min-width: 768px) {
  .expense-list {
    border-radius: 0.75rem;
    padding: 1.25rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
}

.list-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

@media (min-width: 640px) {
  .list-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.list-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.25rem;
}

@media (min-width: 768px) {
  .list-header h3 {
    font-size: 1.5rem;
  }
}

/* Mobile Cards */
.mobile-view {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.mobile-card {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  background: #fafafa;
}

.mobile-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.mobile-card-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  flex: 1;
  margin-right: 0.5rem;
}

.mobile-card-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.mobile-card-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mobile-card-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mobile-card-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.mobile-card-value {
  font-size: 0.875rem;
  color: #1f2937;
  text-align: right;
  flex: 1;
  margin-left: 0.5rem;
}

/* Desktop Table */
.table-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.5rem;
}

.data-table th,
.data-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
  white-space: nowrap;
}

@media (min-width: 768px) {

  .data-table th,
  .data-table td {
    padding: 1rem;
  }
}

.data-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #333;
  font-size: 0.875rem;
}

.data-table tr:hover {
  background-color: #f8f9fa;
}

.amount {
  font-weight: 600;
}

.expense-amount {
  color: #dc3545;
}

.category-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: white;
  white-space: nowrap;
}

.category-badge.food {
  background-color: #fd7e14;
}

.category-badge.transportation {
  background-color: #6610f2;
}

.category-badge.entertainment {
  background-color: #e83e8c;
}

.category-badge.shopping {
  background-color: #20c997;
}

.category-badge.bills {
  background-color: #dc3545;
}

.category-badge.healthcare {
  background-color: #0dcaf0;
}

.category-badge.education {
  background-color: #198754;
}

.category-badge.other {
  background-color: #6c757d;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-sm {
  padding: 0.375rem 0.5rem;
  font-size: 0.75rem;
  min-width: auto;
  min-height: 32px;
}

.loading,
.no-data {
  text-align: center;
  padding: 2rem 1rem;
  color: #666;
}

@media (min-width: 768px) {

  .loading,
  .no-data {
    padding: 2.5rem;
  }
}

/* Modal styles */
.delete-modal {
  background: white;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 400px;
}

@media (min-width: 640px) {
  .delete-modal {
    width: auto;
  }
}

.modal-body {
  padding: 1rem;
}

@media (min-width: 768px) {
  .modal-body {
    padding: 1.25rem;
  }
}

.delete-details {
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 0.25rem;
  border-left: 4px solid #dc3545;
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
  padding: 1rem;
}

.modal-header {
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

@media (min-width: 768px) {
  .modal-header {
    padding: 1.25rem;
  }
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  border-top: 1px solid #e0e0e0;
}

@media (min-width: 640px) {
  .modal-actions {
    flex-direction: row;
    justify-content: flex-end;
    padding: 1.25rem;
  }
}

/* Utility classes */
.hidden {
  display: none;
}

@media (max-width: 767px) {
  .md\:hidden {
    display: none;
  }
}

@media (min-width: 768px) {
  .hidden.md\:block {
    display: block;
  }
}
</style>
