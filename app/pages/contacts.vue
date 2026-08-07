<script setup lang="ts">
import iconGithub from "~/assets/media/images/github.svg";
import iconLinkedin from "~/assets/media/images/linkedin.svg";
import iconTelegram from "~/assets/media/images/telegram.svg";

const contactsList = [
  {
    id: "github",
    label: "GitHub",
    src: iconGithub,
    href: "https://github.com/samarcev",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    src: iconLinkedin,
    href: "https://www.linkedin.com/in/samarcev/",
  },
  {
    id: "telegram",
    label: "Telegram",
    src: iconTelegram,
    href: "https://t.me/IsRealMax",
  },
];
</script>
<template>
  <section class="page">
    <div class="container">
      <h1>Контакты</h1>
      <ul class="contacts-list">
        <li v-for="(item, index) in contactsList" :key="index" :class="item.id">
          <a :href="item.href" :aria-label="item.label">
            <img :src="item.src" :alt="item.label" />
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.contacts-list {
  display: flex;
  gap: 10px;
  align-items: center;
  li {
    width: 52px;
    height: 52px;
    border-radius: 4px;
    padding: 5px;
    background: var(--accent-foreground);
  }
}
</style>