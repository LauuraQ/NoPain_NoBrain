<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

// Пути к логотипам (замени на свои файлы в папке public или assets)

import logoNormal from '../assets/img/logo.webp'
import logoHover from '../assets/img/logo-hover.webp'

const isLogoHovered = ref(false)
</script>

<template>
  <header class="main-header">
    <div class="header-container">
      
      <!-- Логотип (при клике кидает на главную) -->
      <RouterLink to="/" class="logo-link">
        <img :src="logoNormal" alt="Logo" class="logo-img logo-normal" />
        <img :src="logoHover" alt="Logo Hover" class="logo-img logo-hover" />
      </RouterLink>

      <!-- Навигационное меню -->
      <nav class="header-nav">
        <ul class="nav-list">
          
          <!-- Дропдаун: Инструменты -->
          <li class="nav-item dropdown">
            <span class="nav-link dropdown-trigger">
              Инструменты <span class="arrow">▼</span>
            </span>
            <ul class="dropdown-menu">
              <li>
                <RouterLink to="/generator" class="dropdown-link">Сборщик промптов</RouterLink>
              </li>
              <li>
                <RouterLink to="/sources" class="dropdown-link">Генератор списков</RouterLink>
              </li>
              <li>
                <RouterLink to="/converter" class="dropdown-link">Конвертер картинок</RouterLink>
              </li>
            </ul>
          </li>

          <!-- Категория: Приложения -->
          <li class="nav-item">
            <RouterLink to="/apps" class="nav-link">Приложения</RouterLink>
          </li>

          <!-- Категория: Инструкции -->
          <li class="nav-item">
            <RouterLink to="/instructions" class="nav-link">Инструкции</RouterLink>
          </li>

          <!-- Категория: Контакты -->
          <li class="nav-item">
            <RouterLink to="/contacts" class="nav-link">Контакты</RouterLink>
          </li>

        </ul>
      </nav>

    </div>
  </header>
</template>

<style scoped>
.logo-hover {
  display: none; 
}

.logo-link:hover .logo-normal {
  display: none; 
}

.logo-link:hover .logo-hover {
  display: block; 
}

.main-header {
  background-color: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
  height: 70px;
  display: flex;
  align-items: center;
}

.header-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Логотип */
.logo-link {
  display: flex;
  align-items: center;
  height: 62px;
}

.logo-img {
  height: 100%;
  max-height: 62px;
  object-fit: contain;
  transition: opacity 0.2s ease;
}

/* Навигация */
.header-nav {
  display: flex;
}

.nav-list {
  display: flex;
  gap: 8px;
  list-style: none;
  margin: 0;
  padding: 0;
  align-items: center;
}

.nav-item {
  position: relative;
}

.nav-link {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  user-select: none;
}

.nav-link:hover {
  color: var(--text-main);
  background-color: var(--bg-input);
}

/* Стили для активных ссылок первого уровня (кроме триггера дропдауна) */
a.nav-link.router-link-active {
  color: #000000 !important;
  background-color: var(--accent) !important;
  font-weight: 600;
}

/* Дропдаун */
.dropdown-trigger {
  /* Триггеру не нужна подсветка активного роута напрямую */
}

.arrow {
  font-size: 9px;
  color: var(--text-muted);
  transition: transform 0.2s ease;
}

/* Хак для сохранения фокуса hover при переходе мышки на меню */
.dropdown {
  padding-bottom: 15px;
  margin-bottom: -15px;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% - 6px);
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 6px 0;
  min-width: 190px;
  list-style: none;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 101;
}

/* Анимация при наведении */
.dropdown:hover .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

.dropdown:hover .arrow {
  transform: rotate(180deg);
  color: var(--text-main);
}

.dropdown-link {
  display: block;
  padding: 10px 16px;
  font-size: 13px;
  color: var(--text-muted);
  text-decoration: none;
  transition: all 0.15s ease;
}

.dropdown-link:hover {
  color: var(--text-main);
  background-color: var(--bg-input);
}

/* Активный пункт внутри дропдауна */
.dropdown-link.router-link-active {
  color: #000000 !important;
  background-color: var(--accent) !important;
  font-weight: 600;
}
</style>