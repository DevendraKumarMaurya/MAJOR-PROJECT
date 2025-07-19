<template>
  <div class="income-list">
    <div class="list-header">
      <h3>Income Records</h3>
      <button @click="$emit('add')" class="btn btn-success">
        <i class="icon">➕</i> Add Income
      </button>
    </div>

    <div v-if="budgetStore.loading" class="loading">
      Loading income records...
    </div>

    <div v-else-if="budgetStore.incomes.length === 0" class="no-data">
      <p>No income records found. Add your first income!</p>
    </div>

    <div v-else class="table-container">
      <!-- Mobile Cards View -->
      <div class="mobile-view md:hidden">
        <div v-for="income in budgetStore.incomes" :key="income.id" class="mobile-card">
          <div class="mobile-card-header">
            <h4 class="mobile-card-title">{{ income.source }}</h4>
            <div class="mobile-card-actions">
              <button @click="editIncome(income)" class="btn btn-sm btn-primary" title="Edit">
                ✏️
              </button>
              <button @click="deleteIncome(income)" class="btn btn-sm btn-danger" title="Delete">
                🗑️
              </button>
            </div>
          </div>
          <div class="mobile-card-content">
            <div class="mobile-card-row">
              <span class="mobile-card-label">Amount:</span>
              <span class="mobile-card-value income-amount">${{ income.amount.toLocaleString() }}</span>
            </div>
            <div class="mobile-card-row">
              <span class="mobile-card-label">Date:</span>
              <span class="mobile-card-value">{{ formatDate(income.date) }}</span>
            </div>
            <div v-if="income.notes" class="mobile-card-row">
              <span class="mobile-card-label">Notes:</span>
              <span class="mobile-card-value">{{ income.notes }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Desktop Table View -->
      <table class="data-table hidden md:table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Source</th>
            <th>Amount</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="income in budgetStore.incomes" :key="income.id">
            <td>{{ formatDate(income.date) }}</td>
            <td>{{ income.source }}</td>
            <td class="amount income-amount">${{ income.amount.toLocaleString() }}</td>
            <td>{{ income.notes || '-' }}</td>
            <td class="actions">
              <button @click="editIncome(income)" class="btn btn-sm btn-primary" title="Edit">
                ✏️
              </button>
              <button @click="deleteIncome(income)" class="btn btn-sm btn-danger" title="Delete">
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
          <p>Are you sure you want to delete this income record?</p>
          <div class="delete-details">
            <strong>{{ incomeToDelete?.source }}</strong> - ${{ incomeToDelete?.amount?.toLocaleString() }}
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
  name: 'IncomeList',
  emits: ['edit', 'add'],
  setup(props, { emit }) {
    const budgetStore = useBudgetStore()
    const showDeleteModal = ref(false)
    const incomeToDelete = ref(null)
    const deleteLoading = ref(false)

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString()
    }

    const editIncome = (income) => {
      emit('edit', income)
    }

    const deleteIncome = (income) => {
      incomeToDelete.value = income
      showDeleteModal.value = true
    }

    const confirmDelete = async () => {
      if (!incomeToDelete.value) return

      deleteLoading.value = true
      try {
        await budgetStore.deleteIncome(incomeToDelete.value.id)
        showDeleteModal.value = false
        incomeToDelete.value = null
      } catch (error) {
        console.error('Failed to delete income:', error)
      } finally {
        deleteLoading.value = false
      }
    }

    const cancelDelete = () => {
      showDeleteModal.value = false
      incomeToDelete.value = null
    }

    return {
      budgetStore,
      showDeleteModal,
      incomeToDelete,
      deleteLoading,
      formatDate,
      editIncome,
      deleteIncome,
      confirmDelete,
      cancelDelete
    }
  }
}
</script>

<style scoped>
.income-list {
  background: white;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

@media (min-width: 768px) {
  .income-list {
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

.income-amount {
  color: #28a745;
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
  .hidden.md\:table {
    display: table;
  }
}
</style>
