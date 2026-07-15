<script setup>
import { ref, watch, computed } from 'vue'
import { usePopup } from '../composables/usePopup'

const { showPopup } = usePopup()

// Список доступных категорий и соответствующих им файлов в public/data/
const categories = ref([
  { id: 'philosophy', name: 'Философия', file: 'philosophy.json' },
  { id: 'scifi', name: 'Научная фантастика', file: 'scifi.json' }
])

// Состояние интерфейса
const selectedCategory = ref(null)
const isDropdownOpen = ref(false)
const isOlFormat = ref(false) // false = ul, true = ol
const generatedOutput = ref('')

// Храним текущие выбранные источники, чтобы при переключении тогла ul/ol 
// список мгновенно перестраивался без повторного рандома
const currentActiveSources = ref([])

// Переключатель формата тега
const outputTag = computed(() => (isOlFormat.value ? 'ol' : 'ul'))

// Закрытие кастомного дропдауна при клике мимо
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const selectCategory = (category) => {
  selectedCategory.value = category
  isDropdownOpen.value = false
}

// Загрузка JSON-файла с учетом базового URL для GitHub Pages
const loadCategorySources = async (filename) => {
  try {
    // import.meta.env.BASE_URL крайне важен на GitHub Pages, 
    // так как проект часто лежит в подпапке /имя-репозитория/
    const baseUrl = import.meta.env.BASE_URL
    const response = await fetch(`${baseUrl}data/${filename}`)
    
    if (!response.ok) {
      throw new Error(`Не удалось загрузить файл: ${filename}`)
    }
    
    const data = await response.json()
    return data.sources
  } catch (error) {
    console.error('Ошибка при получении источников:', error)
    return []
  }
}

// Генерация случайных источников
const generateSources = async () => {
  if (!selectedCategory.value) {
    showPopup('Пожалуйста', 'Сначала выберите категорию из списка!')
    return
  }

  const allSources = await loadCategorySources(selectedCategory.value.file)
  if (!allSources.length) return

  // Перемешиваем массив источников
  const shuffled = [...allSources].sort(() => 0.5 - Math.random())
  
  // Берем случайное количество источников (например, от 2 до 4)
  const randomCount = Math.min(shuffled.length, Math.floor(Math.random() * 3) + 2)
  currentActiveSources.value = shuffled.slice(0, randomCount)

  updateOutputText()
}

// Сборка итоговой строки для textarea
const updateOutputText = () => {
  if (!currentActiveSources.value.length) return

  const listItems = currentActiveSources.value
    .map(source => `  <li>${source}</li>`)
    .join('\n')

  generatedOutput.value = `<${outputTag.value}>\n${listItems}\n</${outputTag.value}>`
}

watch(isOlFormat, () => {
  updateOutputText()
})
</script>

<template>
  <div class="container">
        <div class="title">
        <h1>Генератор литературных источников</h1>
        <p class="subtitle">Инструмент чтобы не думать</p>
    </div>
    <div class="sources-page">

    <div class="card ">
      <h1 class="page-title"></h1>
      <p class="subtitle"></p>

      <div class="generator-grid">
        <!-- Левая колонка: Управление -->
        <div class="control-panel">
          
          <!-- 1. Кастомный выпадающий список -->
          <div class="form-group">
            <label>Категория источников</label>
            <div class="custom-dropdown">
              <div class="dropdown-trigger" @click="toggleDropdown" :class="{ placeholder: !selectedCategory }">
                {{ selectedCategory ? selectedCategory.name : 'Выберите из списка...' }}
                <span class="arrow" :class="{ open: isDropdownOpen }">▼</span>
              </div>
              
              <ul v-if="isDropdownOpen" class="dropdown-menu">
                <li 
                  v-for="cat in categories" 
                  :key="cat.id" 
                  @click="selectCategory(cat)"
                  :class="{ active: selectedCategory?.id === cat.id }"
                >
                  {{ cat.name }}
                </li>
              </ul>
            </div>
          </div>

          <!-- 2. Тогл выбора формата (ul / ol) -->
          <div class="form-group">
            <label>Формат вывода списка</label>
            <div class="toggle-container">
              <span class="toggle-label" :class="{ active: !isOlFormat }">Ненумерованный (ul)</span>
              
              <label class="switch">
                <input type="checkbox" v-model="isOlFormat">
                <span class="slider"></span>
              </label>
              
              <span class="toggle-label" :class="{ active: isOlFormat }">Нумерованный (ol)</span>
            </div>
          </div>

          <!-- 3. Кнопка генерации -->
          <button class="btn btn-primary " @click="generateSources">
            Сгенерировать источники
          </button>
        </div>

        <!-- Правая колонка: Результат -->
        <div class="output-panel">
          <label>Сгенерированный HTML-код</label>
          <textarea 
            v-model="generatedOutput" 
            placeholder="Здесь появится готовый HTML-список источников..." 
            readonly
            rows="10"
            class="output-textarea"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>
.sources-page {
  max-width: 900px;
  width: 100%;
  justify-self: center;
}
.generator-grid {
  display: flex;
  gap: 32px;
  margin-top: 24px;
}
.control-panel{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  
}
.output-panel {
  display: flex;
  flex-direction: column;
  width: 100%;
  
}
.form-group {
  display: flex;
  flex-direction: column;
}

</style>