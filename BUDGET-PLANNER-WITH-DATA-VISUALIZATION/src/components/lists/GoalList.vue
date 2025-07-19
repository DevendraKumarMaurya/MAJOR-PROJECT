<template>
  <div class="goal-list">
    <div class="list-header">
      <h3>Goals</h3>
      <button @click="$emit('add')" class="btn btn-primary">
        <i class="icon">🎯</i> Add Goal
      </button>
    </div>

    <div v-if="budgetStore.loading" class="loading">
      Loading goals...
    </div>

    <div v-else-if="budgetStore.goals.length === 0" class="no-data">
      <p>No goals set yet. Create your first goal!</p>
    </div>

    <div v-else class="goals-grid">
      <div v-for="goal in budgetStore.goals" :key="goal.id" class="goal-card">
        <div class="goal-header">
          <h4>{{ goal.name }}</h4>
          <div class="goal-actions">
            <button @click="editGoal(goal)" class="btn btn-sm btn-primary" title="Edit Goal">
              ✏️
            </button>
            <button @click="deleteGoal(goal)" class="btn btn-sm btn-danger" title="Delete Goal">
              🗑️
            </button>
          </div>
        </div>

        <div class="goal-amount">
          <div class="target-amount">
            Target: <strong>${{ goal.targetAmount.toLocaleString() }}</strong>
          </div>
          <div class="current-progress">
            Progress: <strong>${{ getCurrentAmount(goal).toLocaleString() }}</strong>
          </div>
        </div>

        <div class="goal-progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: getProgressPercentage(goal) + '%' }"
              :class="getProgressClass(goal)"></div>
          </div>
          <div class="progress-text">
            {{ getProgressPercentage(goal) }}% Complete
          </div>
        </div>

        <div class="goal-deadline">
          <span class="deadline-label">Deadline:</span>
          <span class="deadline-date" :class="getDeadlineClass(goal)">
            {{ formatDate(goal.deadline) }}
          </span>
          <span class="days-left" :class="getDeadlineClass(goal)">
            ({{ getDaysLeft(goal.deadline) }})
          </span>
        </div>

        <div v-if="goal.description" class="goal-description">
          {{ goal.description }}
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="cancelDelete">
      <div class="modal-content delete-modal" @click.stop>
        <div class="modal-header">
          <h3>Confirm Delete</h3>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete this goal?</p>
          <div class="delete-details">
            <strong>{{ goalToDelete?.name }}</strong>
            <br>
            Target: ${{ goalToDelete?.targetAmount?.toLocaleString() }}
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
  name: 'GoalList',
  emits: ['edit', 'add'],
  setup(props, { emit }) {
    const budgetStore = useBudgetStore()
    const showDeleteModal = ref(false)
    const goalToDelete = ref(null)
    const deleteLoading = ref(false)

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString()
    }

    const getCurrentAmount = (goal) => {
      // For simplicity, using net balance as available funds for goals
      // In a more complex app, you might track goal-specific savings
      return Math.max(0, Math.min(budgetStore.netBalance, goal.targetAmount))
    }

    const getProgressPercentage = (goal) => {
      const current = getCurrentAmount(goal)
      return Math.round((current / goal.targetAmount) * 100)
    }

    const getProgressClass = (goal) => {
      const percentage = getProgressPercentage(goal)
      if (percentage >= 100) return 'complete'
      if (percentage >= 75) return 'high'
      if (percentage >= 50) return 'medium'
      if (percentage >= 25) return 'low'
      return 'very-low'
    }

    const getDaysLeft = (deadline) => {
      const today = new Date()
      const deadlineDate = new Date(deadline)
      const timeDiff = deadlineDate.getTime() - today.getTime()
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))

      if (daysDiff < 0) return 'Overdue'
      if (daysDiff === 0) return 'Due today'
      if (daysDiff === 1) return '1 day left'
      return `${daysDiff} days left`
    }

    const getDeadlineClass = (goal) => {
      const today = new Date()
      const deadlineDate = new Date(goal.deadline)
      const timeDiff = deadlineDate.getTime() - today.getTime()
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))

      if (daysDiff < 0) return 'overdue'
      if (daysDiff <= 7) return 'urgent'
      if (daysDiff <= 30) return 'warning'
      return 'normal'
    }

    const editGoal = (goal) => {
      emit('edit', goal)
    }

    const deleteGoal = (goal) => {
      goalToDelete.value = goal
      showDeleteModal.value = true
    }

    const confirmDelete = async () => {
      if (!goalToDelete.value) return

      deleteLoading.value = true
      try {
        await budgetStore.deleteGoal(goalToDelete.value.id)
        showDeleteModal.value = false
        goalToDelete.value = null
      } catch (error) {
        console.error('Failed to delete goal:', error)
      } finally {
        deleteLoading.value = false
      }
    }

    const cancelDelete = () => {
      showDeleteModal.value = false
      goalToDelete.value = null
    }

    return {
      budgetStore,
      showDeleteModal,
      goalToDelete,
      deleteLoading,
      formatDate,
      getCurrentAmount,
      getProgressPercentage,
      getProgressClass,
      getDaysLeft,
      getDeadlineClass,
      editGoal,
      deleteGoal,
      confirmDelete,
      cancelDelete
    }
  }
}
</script>

<style scoped>
.goal-list {
  background: white;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

@media (min-width: 768px) {
  .goal-list {
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

.goals-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 640px) {
  .goals-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.25rem;
  }
}

@media (min-width: 768px) {
  .goals-grid {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  }
}

.goal-card {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  background: #fafafa;
  transition: box-shadow 0.2s;
}

@media (min-width: 768px) {
  .goal-card {
    border-radius: 0.75rem;
    padding: 1.25rem;
  }
}

.goal-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 0.5rem;
}

.goal-header h4 {
  margin: 0;
  color: #333;
  font-size: 1rem;
  flex: 1;
  line-height: 1.4;
  word-break: break-word;
}

@media (min-width: 768px) {
  .goal-header h4 {
    font-size: 1.125rem;
  }
}

.goal-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.goal-amount {
  margin-bottom: 1rem;
}

.target-amount,
.current-progress {
  margin-bottom: 0.375rem;
  color: #6b7280;
  font-size: 0.875rem;
}

@media (min-width: 768px) {

  .target-amount,
  .current-progress {
    font-size: 1rem;
  }
}

.goal-progress {
  margin-bottom: 1rem;
}

.progress-bar {
  width: 100%;
  height: 0.75rem;
  background-color: #e5e7eb;
  border-radius: 0.375rem;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

@media (min-width: 768px) {
  .progress-bar {
    height: 0.875rem;
  }
}

.progress-fill {
  height: 100%;
  transition: width 0.3s ease;
  border-radius: 0.375rem;
}

.progress-fill.complete {
  background-color: #10b981;
}

.progress-fill.high {
  background-color: #06b6d4;
}

.progress-fill.medium {
  background-color: #f59e0b;
}

.progress-fill.low {
  background-color: #f97316;
}

.progress-fill.very-low {
  background-color: #ef4444;
}

.progress-text {
  text-align: center;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
}

.goal-deadline {
  margin-bottom: 1rem;
  font-size: 0.875rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem;
}

@media (min-width: 768px) {
  .goal-deadline {
    font-size: 1rem;
  }
}

.deadline-label {
  color: #6b7280;
}

.deadline-date {
  font-weight: 500;
}

.days-left {
  font-size: 0.75rem;
}

@media (min-width: 768px) {
  .days-left {
    font-size: 0.875rem;
  }
}

.deadline-date.overdue,
.days-left.overdue {
  color: #dc2626;
  font-weight: 600;
}

.deadline-date.urgent,
.days-left.urgent {
  color: #ea580c;
  font-weight: 600;
}

.deadline-date.warning,
.days-left.warning {
  color: #d97706;
  font-weight: 500;
}

.deadline-date.normal,
.days-left.normal {
  color: #059669;
}

.goal-description {
  font-size: 0.875rem;
  color: #6b7280;
  font-style: italic;
  line-height: 1.4;
  word-break: break-word;
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
  color: #6b7280;
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
  border-left: 4px solid #dc2626;
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
  border-bottom: 1px solid #e5e7eb;
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
  border-top: 1px solid #e5e7eb;
}

@media (min-width: 640px) {
  .modal-actions {
    flex-direction: row;
    justify-content: flex-end;
    padding: 1.25rem;
  }
}
</style>
