<template>
  <footer class="site-footer">
    <div class="footer-container">
      <span class="footer-copy">© {{ new Date().getFullYear() }} Yatvig</span>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  width: 100%;
  margin-top: 80px; 
  border-top: 1px solid var(--border-color); 
}

.footer-container {
  max-width: 1100px; 
  margin: 0 auto;
  padding: 24px 0 40px; 
  justify-self: center;

}

.footer-copy {
  font-size: 13px;
  color: var(--text-muted);
  letter-spacing: 0.5px;
}
</style>