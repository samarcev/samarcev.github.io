<script setup lang="ts">
const isOpen = ref(false);
const route = useRoute();

const close = () => {
  isOpen.value = false;
};

const toggle = () => {
  isOpen.value = !isOpen.value;
};

watch(
  () => route.fullPath,
  () => close(),
);
</script>

<template>
  <nav class="nav" aria-label="Основная навигация" :class="{ 'nav--open': isOpen }">
    <NuxtLink to="/" class="nav__link nav__avatar" aria-label="Главная" @click="close">
      <AppLogo />
    </NuxtLink>

    <button
      type="button"
      class="nav__burger"
      :aria-expanded="isOpen"
      aria-controls="nav-menu"
      :aria-label="isOpen ? 'Закрыть меню' : 'Открыть меню'"
      @click="toggle"
    >
      <span class="nav__burger-line" />
      <span class="nav__burger-line" />
      <span class="nav__burger-line" />
    </button>

    <div id="nav-menu" class="nav__menu">
      <NuxtLink class="nav__link" to="/about" @click="close">Обо мне</NuxtLink>
      <NuxtLink class="nav__link" to="/works" @click="close">Работы</NuxtLink>
      <NuxtLink class="nav__link" to="/contacts" @click="close">Контакты</NuxtLink>
    </div>
  </nav>
</template>

<style lang="scss">
.nav {
  display: flex;
  align-items: center;
  gap: 52px;
  position: relative;

  &__avatar {
    flex: 0 0 auto;
    z-index: 2;
  }

  &__burger {
    display: none;
    position: relative;
    z-index: 2;
    margin-left: auto;
    width: 40px;
    height: 40px;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--foreground);
    cursor: pointer;
  }

  &__burger-line {
    display: block;
    width: 22px;
    height: 2px;
    margin: 5px auto;
    background: currentColor;
    transition:
      transform 0.25s ease,
      opacity 0.25s ease;
  }

  &--open &__burger-line {
    &:nth-child(1) {
      transform: translateY(7px) rotate(45deg);
    }

    &:nth-child(2) {
      opacity: 0;
    }

    &:nth-child(3) {
      transform: translateY(-7px) rotate(-45deg);
    }
  }

  &__menu {
    display: flex;
    align-items: center;
    gap: 52px;
  }

  &__link:not(.nav__avatar) {
    font-weight: 500;
    overflow: hidden;
    position: relative;

    &:after {
      content: "";
      display: block;
      height: 4px;
      width: 100%;
      position: absolute;
      bottom: -2px;
      background: currentColor;
      transition:
        transform 0.25s,
        color 0.25s;
      transform: translateX(-102%);
    }

    &:hover,
    &.router-link-exact-active {
      color: var(--primary);

      &:after {
        transform: translateX(0);
      }
    }
  }
}

@media (max-width: 768px) {
  .nav {
    gap: 0;

    &__burger {
      display: block;
    }

    &__menu {
      position: absolute;
      top: calc(100% + 12px);
      right: 0;
      left: 0;
      z-index: 10;
      flex-direction: column;
      align-items: stretch;
      gap: 0;
      padding: 8px 0;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      background: var(--card);
      box-shadow: 0 12px 32px rgb(0 0 0 / 25%);
      opacity: 0;
      visibility: hidden;
      transform: translateY(-8px);
      pointer-events: none;
      transition:
        opacity 0.2s ease,
        transform 0.2s ease,
        visibility 0.2s;
    }

    &--open &__menu {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
      pointer-events: auto;
    }

    &__link:not(.nav__avatar) {
      padding: 14px 20px;

      &:after {
        display: none;
      }

      &.router-link-exact-active {
        color: var(--primary);
        background: var(--muted);
      }
    }
  }
}
</style>
