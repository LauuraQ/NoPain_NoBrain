<script setup>
import { ref } from 'vue'
import { usePopup } from '../composables/usePopup'

const { showPopup } = usePopup()

import noSheetsImg from '../assets/img/desktop-app.webp' 
import meowkaImg from '../assets/img/desktop-app.webp'

const apps = ref([
  {
    id: 'nosheets',
    name: 'NoSheets NoDocks',
    image: noSheetsImg,
    description: `Инструмент для автоматизации проверок и исправлений в текстах.
    - Парсинг Goodle Sheets и Google Dokcs с использованием Google API.
    - Автоматически редактирует текста по заданным правилам и ведет отчет об исправлениях и ошибках.`,

    tasks: [
      ' Автоматизация проверки больших объемов текстовых документов для закупа ссылок.'
      
    ],
    version: '1.0.0',
    lastUpdate: '12.07.2026',
    developer: 'Громада Д.А, Толстова М.Д',
    downloadUrl: '/downloads/NoSheet.exe'
  },
  {
    id: 'meowka',
    name: 'Meowka',
    image: meowkaImg,
    description: '"Meowka" — универсальный десктопный помощник, созданный для автоматизации рутинных задач.',
    tasks: [
      ' Автоматизация процессов взаимодействия с вебсайтами: Копирование и вставка.',
      ' Работа с контентом.',
    ],
    version: '1.2.5',
    lastUpdate: '07.02.2026',
    developer: 'Громада Д.А',
    downloadUrl: '/downloads/Meowka.exe'
  }
])

const openDetails = (appName) => {
  showPopup('Информация', `Подробное описание для приложения ${appName} находится в разработке.`)
}
</script>

<template>
  <div class="container apps-page">
    <div class="title">
        <h1>Приложения</h1>
        <p class="subtitle">Полезный (?) софт собственной разработки</p>
    </div>
    <div class="card">
      <div class="apps-list">
        <div v-for="app in apps" :key="app.id" class="app-card">
          <div class="app-image-container">
            <img :src="app.image" :alt="app.name" class="app-image" />
          </div>
          <div class="app-content">
            <div class="app-header">
              <h2 class="app-title">{{ app.name }}</h2>
              <div class="app-meta-top">
                <span class="meta-tag">v{{ app.version }}</span>
                <span class="meta-tag">Обновлено: {{ app.lastUpdate }}</span>
              </div>
            </div>
            <p class="app-description">{{ app.description }}</p>
            <div class="app-tasks-block">
              <span class="tasks-title">Для каких задач подходит:</span>
              <ul class="app-tasks-list">
                <li v-for="(task, idx) in app.tasks" :key="idx">
                  <span class="custom-bullet">▪</span>
                  <span class="task-text">{{ task }}</span>
                </li>
              </ul>
            </div>
            <div class="app-footer">
              <span class="app-developer">Разработчик: {{ app.developer }}</span>
              <div class="app-actions">
                <button class="btn btn-secondary" @click="openDetails(app.name)">
                  Подробнее
                </button>
                <a :href="app.downloadUrl" class="btn btn-primary">
                  Скачать
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.apps-page {
  max-width: 1100px;
}

.apps-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 32px;
}

.app-card {
  display: flex;
  background-color: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  min-height: 280px; 
}

.app-image-container {
  width: 25%;
  background-color: #0b0b0c;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid var(--border-color);
  padding: 16px;
}

.app-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

.app-content {
  width: 75%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.app-title {
  font-size: 22px;
  font-weight: 600;
  margin: 0;
  color: var(--text-main);
}

.app-meta-top {
  display: flex;
  gap: 12px;
}

.meta-tag {
  font-size: 11px;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  padding: 4px 10px;
  border-radius: 20px;
  font-weight: 500;
}

.app-description {
  font-size: 14px;
   white-space: pre-line;
  color: var(--text-muted);
  line-height: 1.5;
  margin: 12px 0 0 0;
}

.app-tasks-block {
  margin-top: 12px;
}

.tasks-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-main);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.app-tasks-list {
  margin: 6px 0 0 0;
  padding-left: 20px;
  list-style-type: square;
}

.app-tasks-list li {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 4px;
}

.app-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--border-color);
  padding-top: 16px;
  margin-top: 12px;
}

.app-developer {
  font-size: 13px;
  color: var(--text-muted);
}

.app-actions {
  display: flex;
  gap: 12px;
}



.btn-primary {
  font-size: 13px;
  padding: 8px 22px;
}

</style>