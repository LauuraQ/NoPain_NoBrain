<script setup>
import { usePopup } from '../composables/usePopup'

const { isOpen, title, message, closePopup } = usePopup()
</script>

<template>
  <Transition name="fade">
    <div v-if="isOpen" class="popup-overlay" @click.self="closePopup">
      <div class="popup-content">
        <h3 class="popup-title">{{ title || 'Уведомление' }}</h3>
        <p class="popup-message">{{ message }}</p>
        
        <div class="popup-actions">
          <button class="btn btn-primary btn-sm" @click="closePopup">Хорошо</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.popup-content {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 24px;
  width: 360px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
}

.popup-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--text-main);
}

.popup-message {
  font-size: 14px;
  color: var(--text-muted);
  line-height: 1.5;
  margin-bottom: 20px;
}

.popup-actions {
  display: flex;
  justify-content: flex-end;
}

.btn-sm {
  padding: 8px 20px;
  font-size: 13px;
}

/* Анимация плавного появления */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-active .popup-content {
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-from .popup-content {
  transform: scale(0.95);
}
</style>