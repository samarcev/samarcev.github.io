<script setup lang="ts">
withDefaults(
  defineProps<{
    src?: string;
    alt?: string;
    width?: number;
    height?: number;
  }>(),
  {
    src: "/profile.webp",
    alt: "Максим Самарцев",
    width: 52,
    height: 52,
  },
);
</script>

<template>
  <img
    class="avatar"
    :src="src"
    :alt="alt"
    :width="width"
    :height="height"
    decoding="async"
  />
</template>

<style scoped lang="scss">
.avatar {
  display: block;
  object-fit: cover;
  border-radius: 50%;
  border: 1px solid var(--primary);
  overflow: hidden;
}
</style>
