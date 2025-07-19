<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ isEdit ? 'Edit Income' : 'Add Income' }}</h3>
        <button @click="closeModal" class="close-btn">&times;</button>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="amount">Amount:</label>
          <input type="number" id="amount" v-model.number="form.amount" required step="0.01"
            placeholder="Enter amount" />
        </div>

        <div class="form-group">
          <label for="source">Source:</label>
          <input type="text" id="source" v-model="form.source" required placeholder="Salary, Freelance, etc." />
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
          <button type="submit" class="btn btn-success" :disabled="loading">
            {{ loading ? (isEdit ? 'Updating...' : 'Adding...') : (isEdit ? 'Update Income' : 'Add Income') }}
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
  name: 'IncomeForm',
  props: {
    income: {
      type: Object,
      default: null
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const budgetStore = useBudgetStore()
    const loading = ref(false)
    const error = ref('')

    const isEdit = computed(() => !!props.income)

    const form = reactive({
      amount: '',
      source: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    })

    // Initialize form with income data if editing
    const initializeForm = () => {
      if (props.income) {
        form.amount = props.income.amount
        form.source = props.income.source
        form.date = props.income.date
        form.notes = props.income.notes || ''
      }
    }

    // Watch for prop changes
    watch(() => props.income, initializeForm, { immediate: true })

    const handleSubmit = async () => {
      error.value = ''
      loading.value = true

      try {
        let result
        if (isEdit.value) {
          result = await budgetStore.updateIncome(props.income.id, {
            amount: form.amount,
            source: form.source,
            date: form.date,
            notes: form.notes
          })
        } else {
          result = await budgetStore.addIncome({
            amount: form.amount,
            source: form.source,
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
        error.value = isEdit.value ? 'Failed to update income' : 'Failed to add income'
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
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  margin: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

@media (min-width: 640px) {
  .modal-content {
    border-radius: 0.75rem;
    margin: 0;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  font-size: 1.125rem;
}

@media (min-width: 768px) {
  .modal-header h3 {
    font-size: 1.25rem;
  }
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0.25rem;
  border-radius: 0.25rem;
  min-width: 32px;
  min-height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #333;
  background-color: #f3f4f6;
}

form {
  padding: 1rem;
}

@media (min-width: 768px) {
  form {
    padding: 1.25rem;
  }
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  justify-content: stretch;
  margin-top: 1.5rem;
}

@media (min-width: 640px) {
  .modal-actions {
    flex-direction: row;
    justify-content: flex-end;
  }
}
</style>
