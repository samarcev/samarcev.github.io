<template>
  <AppHeader />
  <main class="layout__main">
    <slot />
  </main>
</template>

<style lang="scss">
.layout__main {
  position: relative;
  overflow: hidden;
}
</style>
