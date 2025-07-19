<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ isEdit ? 'Edit Expense' : 'Add Expense' }}</h3>
        <button @click="closeModal" class="close-btn">&times;</button>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="amount">Amount:</label>
          <input type="number" id="amount" v-model.number="form.amount" required step="0.01"
            placeholder="Enter amount" />
        </div>

        <div class="form-group">
          <label for="category">Category:</label>
          <select id="category" v-model="form.category" required>
            <option value="">Select category</option>
            <option value="Food">Food</option>
            <option value="Transportation">Transportation</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Shopping">Shopping</option>
            <option value="Bills">Bills</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Education">Education</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div class="form-group">
          <label for="date">Date:</label>
          <input type="date" id="date" v-model="form.date" required />
        </div>

        <div class="form-group">
          <label for="notes">Notes (Optional):</label>
          <textarea id="notes" v-model="form.notes" placeholder="Additional notes..." rows="3"></textarea>
        </div>

        <div v-if="error" class="error mb-3">
          {{ error }}
        </div>

        <div class="modal-actions">
          <button type="button" @click="closeModal" class="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" class="btn btn-danger" :disabled="loading">
            {{ loading ? (isEdit ? 'Updating...' : 'Adding...') : (isEdit ? 'Update Expense' : 'Add Expense') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watch } from 'vue'
import { useBudgetStore } from '@/stores/budget'

export default {
  name: 'ExpenseForm',
  props: {
    expense: {
      type: Object,
      default: null
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const budgetStore = useBudgetStore()
    const loading = ref(false)
    const error = ref('')

    const isEdit = computed(() => !!props.expense)

    const form = reactive({
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    })

    // Initialize form with expense data if editing
    const initializeForm = () => {
      if (props.expense) {
        form.amount = props.expense.amount
        form.category = props.expense.category
        form.date = props.expense.date
        form.notes = props.expense.notes || ''
      }
    }

    // Watch for prop changes
    watch(() => props.expense, initializeForm, { immediate: true })

    const handleSubmit = async () => {
      error.value = ''
      loading.value = true

      try {
        let result
        if (isEdit.value) {
          result = await budgetStore.updateExpense(props.expense.id, {
            amount: form.amount,
            category: form.category,
            date: form.date,
            notes: form.notes
          })
        } else {
          result = await budgetStore.addExpense({
            amount: form.amount,
            category: form.category,
            date: form.date,
            notes: form.notes
          })
        }

        if (result.success) {
          emit('close')
        } else {
          error.value = result.error
        }
      } catch (err) {
        error.value = isEdit.value ? 'Failed to update expense' : 'Failed to add expense'
      } finally {
        loading.value = false
      }
    }

    const closeModal = () => {
      emit('close')
    }

    return {
      form,
      loading,
      error,
      isEdit,
      handleSubmit,
      closeModal
    }
  }
}
</script>

<style scoped>
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
  z-index: 99999;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.close-btn:hover {
  color: #333;
}

form {
  padding: 20px;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
