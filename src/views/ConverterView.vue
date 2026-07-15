<script setup>
import { ref, computed } from 'vue'
import { usePopup } from '../composables/usePopup'

const { showPopup } = usePopup()

// Список доступных форматов
const formats = ref([
  { id: 'webp', name: 'WebP' },
  { id: 'png', name: 'PNG' },
  { id: 'jpeg', name: 'JPEG' },
  { id: 'jpg', name: 'JPG' }
])

const selectedFormat = ref(null)
const isDropdownOpen = ref(false)
const compressionQuality = ref(80) // Качество от 10% до 100%

const uploadedFiles = ref([])
const convertedImages = ref([])
const isConverting = ref(false)
const isDragActive = ref(false)

// Управление кастомным дропдауном
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const selectFormat = (format) => {
  selectedFormat.value = format
  isDropdownOpen.value = false
}

// Выбор файлов через проводник
const onFileChange = (e) => {
  const files = Array.from(e.target.files)
  addFiles(files)
}

// Обработка Drag & Drop
const onDragOver = (e) => {
  e.preventDefault()
  isDragActive.value = true
}

const onDragLeave = () => {
  isDragActive.value = false
}

const onDrop = (e) => {
  e.preventDefault()
  isDragActive.value = false
  const files = Array.from(e.dataTransfer.files)
  addFiles(files)
}

// Валидация и добавление файлов
const addFiles = (files) => {
  const imageTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
  
  const validFiles = files.filter(file => {
    const isValid = imageTypes.includes(file.type) || /\.(png|jpe?g|webp)$/i.test(file.name)
    if (!isValid) {
      showPopup('Формат не поддерживается', `Файл "${file.name}" не является подходящим изображением.`)
    }
    return isValid
  })

  uploadedFiles.value.push(...validFiles)
}

// Удалить файл из очереди до конвертации
const removeUploadedFile = (index) => {
  uploadedFiles.value.splice(index, 1)
}

// Красивое форматирование размера файла
const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

// Функция конвертации одиночного файла на Canvas
const convertSingleImage = (file, targetMime, quality) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Не удалось создать Blob'))
            return
          }
          
          const originalName = file.name
          const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'))
          const ext = targetMime.split('/')[1] === 'jpeg' ? 'jpg' : targetMime.split('/')[1]
          const newName = `${nameWithoutExt}.${ext}`
          
          const url = URL.createObjectURL(blob)
          
          resolve({
            id: Math.random().toString(36).substring(2, 9),
            name: newName,
            originalSize: file.size,
            size: blob.size,
            formattedSize: formatBytes(blob.size),
            url: url
          })
        }, targetMime, quality)
      }
      img.onerror = () => reject(new Error('Ошибка рендеринга картинки'))
      img.src = e.target.result
    }
    reader.onerror = () => reject(new Error('Ошибка чтения файла'))
    reader.readAsDataURL(file)
  })
}

// Запуск конвертации для всех файлов в очереди
const startConversion = async () => {
  if (uploadedFiles.value.length === 0) {
    showPopup('Пожалуйста', 'Сначала перетащите или выберите изображения!')
    return
  }
  if (!selectedFormat.value) {
    showPopup('Пожалуйста', 'Выберите формат, в который нужно конвертировать!')
    return
  }

  isConverting.value = true
  convertedImages.value = []

  const mimeMap = {
    webp: 'image/webp',
    png: 'image/png',
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg'
  }

  const targetMime = mimeMap[selectedFormat.value.id]
  const qualityFactor = compressionQuality.value / 100

  for (const file of uploadedFiles.value) {
    try {
      const result = await convertSingleImage(file, targetMime, qualityFactor)
      convertedImages.value.push(result)
    } catch (error) {
      console.error(error)
      showPopup('Ошибка', `Не удалось сконвертировать файл "${file.name}"`)
    }
  }

  isConverting.value = false
}

// Сортировка готовых картинок по весу (от самых тяжелых к легким)
const sortedConvertedImages = computed(() => {
  return [...convertedImages.value].sort((a, b) => b.size - a.size)
})

// Скачивание одного файла
const downloadSingle = (image) => {
  const link = document.createElement('a')
  link.href = image.url
  link.download = image.name
  link.click()
}

// Массовое скачивание с задержкой (чтобы браузер не блокировал множественные загрузки)
const downloadAll = () => {
  sortedConvertedImages.value.forEach((image, index) => {
    setTimeout(() => {
      downloadSingle(image)
    }, index * 250)
  })
}
</script>

<template>
  <div class="container converter-page">
      <div class="title">
        <h1>Конвертер изображений</h1>
        <p class="subtitle">Инструмент чтобы не думать</p>
    </div>
    <div class="card">

  

      <div class="converter-layout">
        <!-- Левая колонка: Настройки -->
        <div class="settings-panel">
          
          <!-- Наш кастомный дропдаун выбора формата -->
          <div class="form-group">
            <label>Конвертировать в</label>
            <div class="custom-dropdown">
              <div class="dropdown-trigger" @click="toggleDropdown" :class="{ placeholder: !selectedFormat }">
                {{ selectedFormat ? selectedFormat.name : 'Выберите формат...' }}
                <span class="arrow" :class="{ open: isDropdownOpen }">▼</span>
              </div>
              <ul v-if="isDropdownOpen" class="dropdown-menu">
                <li 
                  v-for="format in formats" 
                  :key="format.id" 
                  @click="selectFormat(format)"
                  :class="{ active: selectedFormat?.id === format.id }"
                >
                  {{ format.name }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Ползунок сжатия -->
          <div class="form-group">
            <div class="slider-header">
              <label>Качество сжатия</label>
              <span class="slider-value">{{ compressionQuality }}%</span>
            </div>
            <div class="range-container">
              <input 
                type="range" 
                min="10" 
                max="100" 
                step="5"
                v-model="compressionQuality" 
                class="custom-slider"
              />
              <div class="range-labels">
                <span>Макс. сжатие</span>
                <span>Макс. качество</span>
              </div>
            </div>
          </div>

          <!-- Кнопки действий -->
          <div class="actions-group">
            <button 
              class="btn btn-primary" 
              @click="startConversion" 
              :disabled="isConverting"
            >
              {{ isConverting ? 'Конвертируем...' : 'Сконвертировать' }}
            </button>
            
            <button 
              v-if="convertedImages.length > 0" 
              class="btn download-all-btn" 
              @click="downloadAll"
            >
              Скачать все ({{ convertedImages.length }})
            </button>
          </div>
        </div>

        <!-- Правая колонка: Дропбокс для загрузки -->
        <div class="dropbox-panel">
          <div 
            class="dropbox" 
            :class="{ active: isDragActive }"
            @dragover="onDragOver"
            @dragleave="onDragLeave"
            @drop="onDrop"
          >
            <div class="dropbox-inner">
              <p class="dropbox-text">Перетащите изображения сюда</p>
              <span class="dropbox-or">или</span>
              <label class="btn btn-select">
                Выбрать файлы
                <input 
                  type="file" 
                  multiple 
                  accept="image/png, image/jpeg, image/jpg, image/webp" 
                  @change="onFileChange" 
                  class="hidden-input"
                />
              </label>
            </div>
          </div>

          <!-- Список очереди на конвертацию -->
          <div v-if="uploadedFiles.length > 0" class="upload-queue-container">
            <div class="queue-header">Очередь на обработку ({{ uploadedFiles.length }})</div>
            <div class="upload-queue">
              <div v-for="(file, idx) in uploadedFiles" :key="idx" class="queue-item">
                <span class="file-name" :title="file.name">{{ file.name }}</span>
                <button class="btn-remove" @click="removeUploadedFile(idx)">✕</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Сетка результатов ниже -->
      <div v-if="sortedConvertedImages.length > 0" class="results-section">
        <h2 class="section-title">Результаты </h2>
        <p class="subtitle">Отсортированы по убыванию веса</p>
        <div class="results-grid">
          <div v-for="img in sortedConvertedImages" :key="img.id" class="result-card">
            <div class="preview-container">
              <img :src="img.url" :alt="img.name" class="result-preview" />
            </div>
            <div class="result-info">
              <div class="result-filename" :title="img.name">{{ img.name }}</div>
              <div class="result-weight">{{ img.formattedSize }}</div>
              <button class="btn btn-download" @click="downloadSingle(img)">
                Скачать
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.converter-page {
  max-width: 1100px;
}

.page-title {
  margin-bottom: 4px;
}

.converter-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 32px;
  margin-top: 32px;
}

.settings-panel {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
}












/* Ползунок сжатия */
.slider-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.slider-value {
  font-size: 13px;
  font-weight: 600;
  color: var(--accent);
}

.range-container {
  background-color: var(--bg-input);
  border: 1px solid var(--border-color);
  padding: 16px 12px 10px;
  border-radius: 8px;
}

.custom-slider {
  -webkit-appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: var(--border-color);
  outline: none;
  padding: 0;
  margin-bottom: 10px;
}

.custom-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--accent);
  cursor: pointer;
  transition: transform 0.1s;
}

.custom-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.range-labels {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--text-muted);
}

/* Кнопки */
.actions-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
}

.download-all-btn {
  background-color: var(--success);
  color: #000000;
  font-weight: 600;
  border: none;
}

.download-all-btn:hover {
  background-color: #059669;
}

/* Дропбокс */
.dropbox-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 25px;

}

.dropbox {
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  background-color: var(--bg-input);
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  height: 200px;

}

.dropbox.active,
.dropbox:hover {
  border-color: var(--text-main);
  background-color: #1e1e21;
}

.dropbox-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-muted);
}

.dropbox-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.dropbox-text {
  font-size: 14px;
  color: var(--text-main);
  margin: 0;
}

.dropbox-or {
  font-size: 12px;
  margin: 4px 0;
  margin-bottom: 12px;
}

.btn-select {
  background-color: var(--bg-card);
  border-color: var(--border-color);
  font-size: 13px;
  padding: 6px 14px;
}

.btn-select:hover {
  background-color: var(--bg-input);
}

.hidden-input {
  display: none;
}

/* Очередь файлов */
.upload-queue-container {
  background-color: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 12px;
}

.queue-header {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 8px;
  font-weight: 500;
}

.upload-queue {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-height: 120px;
  overflow-y: auto;
}

.queue-item {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  padding: 4px 8px 4px 12px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 240px;
}

.file-name {
  font-size: 12px;
  color: var(--text-main);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-remove {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 11px;
  padding: 4px;
}

.btn-remove:hover {
  color: var(--danger);
}

/* Результаты */
.results-section {
  margin-top: 40px;
  border-top: 1px solid var(--border-color);
  padding-top: 24px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.result-card {
  background-color: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.preview-container {
  aspect-ratio: 16/10;
  background-color: #0b0b0c;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-bottom: 1px solid var(--border-color);
}

.result-preview {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.result-info {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex-grow: 1;
}

.result-filename {
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--text-main);
}

.result-weight {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 6px;
}

.btn-download {
  font-size: 13px;
  padding: 6px 12px;
  background-color: var(--accent);
  color: #000000;
  border: none;
  font-weight: 600;
  margin-top: auto;
}

.btn-download:hover {
  background-color: var(--accent-hover);
}


</style>