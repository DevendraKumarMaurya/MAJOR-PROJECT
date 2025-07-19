<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ isEdit ? 'Edit Goal' : 'Add Goal' }}</h3>
        <button @click="closeModal" class="close-btn">&times;</button>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="name">Goal Name:</label>
          <input type="text" id="name" v-model="form.name" required placeholder="Emergency Fund, Vacation, etc." />
        </div>

        <div class="form-group">
          <label for="targetAmount">Target Amount:</label>
          <input type="number" id="targetAmount" v-model.number="form.targetAmount" required step="0.01"
            placeholder="Enter target amount" />
        </div>

        <div class="form-group">
          <label for="deadline">Deadline:</label>
          <input type="date" id="deadline" v-model="form.deadline" required />
        </div>

        <div class="form-group">
          <label for="description">Description (Optional):</label>
          <textarea id="description" v-model="form.description" placeholder="Describe your goal..." rows="3"></textarea>
        </div>

        <div v-if="error" class="error mb-3">
          {{ error }}
        </div>

        <div class="modal-actions">
          <button type="button" @click="closeModal" class="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? (isEdit ? 'Updating...' : 'Adding...') : (isEdit ? 'Update Goal' : 'Add Goal') }}
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
  name: 'GoalForm',
  props: {
    goal: {
      type: Object,
      default: null
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const budgetStore = useBudgetStore()
    const loading = ref(false)
    const error = ref('')

    const isEdit = computed(() => !!props.goal)

    const form = reactive({
      name: '',
      targetAmount: '',
      deadline: '',
      description: ''
    })

    // Initialize form with goal data if editing
    const initializeForm = () => {
      if (props.goal) {
        form.name = props.goal.name
        form.targetAmount = props.goal.targetAmount
        form.deadline = props.goal.deadline
        form.description = props.goal.description || ''
      }
    }

    // Watch for prop changes
    watch(() => props.goal, initializeForm, { immediate: true })

    const handleSubmit = async () => {
      error.value = ''
      loading.value = true

      try {
        let result
        if (isEdit.value) {
          result = await budgetStore.updateGoal(props.goal.id, {
            name: form.name,
            targetAmount: form.targetAmount,
            deadline: form.deadline,
            description: form.description
          })
        } else {
          result = await budgetStore.addGoal({
            name: form.name,
            targetAmount: form.targetAmount,
            deadline: form.deadline,
            description: form.description,
            currentAmount: 0
          })
        }

        if (result.success) {
          emit('close')
        } else {
          error.value = result.error
        }
      } catch (err) {
        error.value = isEdit.value ? 'Failed to update goal' : 'Failed to add goal'
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
