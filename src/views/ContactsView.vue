<script setup>

</script>

<template>
  <div class="container contacts-page">
     <div class="title">
        <h1>Контакты</h1>
        <p class="subtitle">Свяpm со мной и полезные ссылки.</p>
    </div>
    <div class="card card-contact">
        <div class="contact-info-block">
          <div class="info-cards-list">
            <a href="https://t.me/mephistonew" target="_blank" class="info-card">
              <div class="info-card-icon telegram">✈</div>
              <div class="info-card-content">
                <span class="info-label">Telegram</span>
                <span class="info-value">@mephistonew</span>
              </div>
            </a>
            <a href="https://github.com/LauuraQ" target="_blank" class="info-card">
              <div class="info-card-icon github">🐙</div>
              <div class="info-card-content">
                <span class="info-label">GitHub</span>
                <span class="info-value">github.com/your-profile</span>
              </div>
            </a>
            <a href="mailto:mephistonew@gmail.com" class="info-card">
              <div class="info-card-icon email">✉</div>
              <div class="info-card-content">
                <span class="info-label">Электронная почта</span>
                <span class="info-value">mephistonew@gmail.com</span>
              </div>
            </a>
          </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contacts-page {
  max-width: 1100px;
}
.card-contact{
    max-width: 500px;
    justify-self: center;
}
.info-cards-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 400px;
  justify-self: center;
}
.info-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background-color: var(--bg-input);
  border: 1px solid var(--border-color);
  padding: 16px;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.2s ease-in-out;
}
a.info-card:hover {
  border-color: var(--text-muted);
  background-color: #1e1e21;
  transform: translateY(-2px);
}
.info-card.static {
  cursor: default;
}
.info-card-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}
.info-card-icon.telegram { color: #ffffff; }
.info-card-icon.github { color: #ffffff; }
.info-card-icon.email { color: #ffffff; }
.info-card-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.info-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-muted);
  font-weight: 600;
}
.info-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
}
</style>