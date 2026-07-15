<script setup>

import { RouterLink } from 'vue-router'

// Импортируем иконки приложений для превью на главной
import noSheetsImg from '../assets/img/desktop-app.webp' 
import meowkaImg from '../assets/img/desktop-app.webp'


</script>

<template>
  <div class="container home-page">
    
    <!-- 1. HERO SECTION (Приветственный баннер) -->
    <section class="hero-section">
      <div class="hero-badge">Разработка & Автоматизация</div>
      <h1 class="hero-title">Инструменты и Софт </h1>
      <p class="hero-subtitle">
        Веб-инструменты и Локальный десктопный софт, созданные для автоматизации рутины, 
        работы с текстом, изображениями и повышения личной эффективности.
      </p>
      <div class="hero-actions">
        <a href="#tools" class="btn btn-primary">Инструменты</a>
        <RouterLink to="/apps" class="btn btn-secondary"> Приложения </RouterLink>
      </div>
    </section>

    <!-- 2. СЕТКА БЫСТРЫХ ИНСТРУМЕНТОВ -->
    <section id="tools" class="section-block">
      <div class="section-header">
        <h2 class="section-title">Веб-инструменты</h2>
        <p class="section-subtitle-text">Быстрые утилиты, работающие прямо в вашем браузере без серверов</p>
      </div>

      <div class="tools-grid">
        <!-- Карточка 1: SEO Генератор -->
        <RouterLink to="/generator" class="tool-card">
          <div class="tool-icon"></div>
          <h3 class="tool-name">Генератор промптов</h3>
          <p class="tool-desc">Заполнение структурированных промптов для нейросетей по исходной таблице.</p>
          <span class="tool-link-text">Открыть инструмент →</span>
        </RouterLink>

        <!-- Карточка 2: Списки источников -->
        <RouterLink to="/sources" class="tool-card">
          <div class="tool-icon"></div>
          <h3 class="tool-name">Генератор источников</h3>
          <p class="tool-desc">Случайная генерация и форматирование списков литературы из JSON-баз.</p>
          <span class="tool-link-text">Открыть инструмент →</span>
        </RouterLink>

        <!-- Карточка 3: Конвертер картинок -->
        <RouterLink to="/converter" class="tool-card">
          <div class="tool-icon"></div>
          <h3 class="tool-name">Конвертер картинок</h3>
          <p class="tool-desc">Быстрое локальное сжатие и конвертация в WebP, PNG, JPG.</p>
          <span class="tool-link-text">Открыть инструмент →</span>
        </RouterLink>
      </div>
    </section>

    <!-- 3. БЛОК ГЛАВНЫХ ПРИЛОЖЕНИЙ -->
    <section class="section-block apps-showcase">
      <div class="section-header">
        <h2 class="section-title">Десктопный софт</h2>
        <p class="section-subtitle-text">Полноценные приложения для ПК, оптимизирующие рабочие процессы</p>
      </div>

      <div class="showcase-list">
        <!-- Превью NoSheets -->
        <div class="showcase-item">
          <div class="showcase-img-wrap">
            <img :src="noSheetsImg" alt="NoSheets" />
          </div>
          <div class="showcase-info">
            <span class="showcase-tag">Связка Google API</span>
            <h3 class="showcase-name">NoSheets NoDocks</h3>
            <p class="showcase-desc">
              Парсинг документов и автоматическое редактирование текстов по правилам закупа ссылок. 
              Забудьте про бесконечное ручное перекладывание данных из таблиц.
            </p>
          </div>
        </div>

        <!-- Превью Meowka -->
        <div class="showcase-item reverse">
          <div class="showcase-info">
            <span class="showcase-tag">Автоматизация задач</span>
            <h3 class="showcase-name">Meowka</h3>
            <p class="showcase-desc">
              Ваш персональный ассистент для автоматического копирования, вставки и взаимодействия с веб-страницами. 
              Экономит часы монотонной работы с контентом.
            </p>
          </div>
          <div class="showcase-img-wrap">
            <img :src="meowkaImg" alt="Meowka" />
          </div>
        </div>

        <RouterLink to="/apps" class="btn btn-secondary ">Все разработки</RouterLink>
      </div>
    </section>

  </div>
</template>

<style scoped>
.home-page {
  max-width: 1100px;
}

/* Стили Hero секции */
.hero-section {
  text-align: center;
  padding: 60px 0 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-badge {
  background-color: var(--bg-input);
  border: 1px solid var(--border-color);
  color: var(--accent);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  padding: 6px 16px;
  border-radius: 30px;
  margin-bottom: 24px;
}

.hero-title {
  font-size: 42px;
  font-weight: 700;
  color: var(--text-main);
  line-height: 1.2;
  margin: 0;
  max-width: 800px;
}

.hero-subtitle {
  font-size: 16px;
  color: var(--text-muted);
  line-height: 1.6;
  max-width: 650px;
  margin: 16px 0 32px;
}

.hero-actions {
  display: flex;
  gap: 16px;
}



/* Общие стили блоков */
.section-block {
  padding: 50px 0;
  border-top: 1px solid var(--border-color);
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 8px;
}

.section-subtitle-text {
  font-size: 14px;
  color: var(--text-muted);
  margin: 0;
}

/* Сетка веб-инструментов */
.tools-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.tool-card {
  background-color: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 24px;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease-in-out;
}

.tool-card:hover {
  border-color: var(--text-muted);
  background-color: #1e1e21;
  transform: translateY(-4px);
}

.tool-icon {
  font-size: 28px;
  margin-bottom: 16px;
}

.tool-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-main);
  margin: 0 0 8px 0;
}

.tool-desc {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.5;
  margin: 0 0 20px 0;
  flex-grow: 1;
}

.tool-link-text {
  font-size: 12px;
  font-weight: 600;
  color: var(--accent);
}

/* Showcase десктопного софта */
.showcase-list {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.showcase-item {
  display: flex;
  align-items: center;
  gap: 48px;
  background-color: var(--bg-input);
  border: 1px solid var(--border-color);
  padding: 32px;
  border-radius: 16px;
}

.showcase-img-wrap {
  width: 140px;
  height: 140px;
  flex-shrink: 0;
  background-color: #0b0b0c;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-color);
  padding: 16px;
}

.showcase-img-wrap img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.showcase-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-grow: 1;
}

.showcase-tag {
  font-size: 10px;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
  margin-bottom: 8px;
}

.showcase-name {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-main);
  margin: 0 0 8px 0;
}

.showcase-desc {
  font-size: 14px;
  color: var(--text-muted);
  line-height: 1.6;
  margin: 0 0 20px 0;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 12px;
  background-color: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-main);
}

.btn-sm:hover {
  background-color: var(--bg-card);
  border-color: var(--text-muted);
}

/* Зеркальный вид для второго элемента */
.showcase-item.reverse {
  /* Мы меняем блоки местами для десктопной эстетики */
}
</style>