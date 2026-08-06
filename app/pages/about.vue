<script setup lang="ts">
const workPlaces = [
  {
    url: "https://web-str.ru/",
    title: "Web Строитель",
  },
  {
    url: "https://ru.qform.io/",
    title: "QForm",
  },
];
</script>
<template>
  <div class="page">
    <div class="container">
      <h1>Обо мне</h1>
      <div>
        <p>Привет 🖐</p>
        <p>
          Меня зовут <b>Максим</b> и я Frontend-разработчик с опытом
          коммерческой разработки более 5 лет. Специализируюсь на продуктовых
          интерфейсах и модернизации legacy-кода.
        </p>
        <p>Сейчас я пишу код в:</p>
        <ul class="workplace-list">
          <li v-for="(item, index) in workPlaces" :key="index">
            <a :href="item.url" target="_blank">{{ item.title }}</a>
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              v-if="index !== workPlaces.length - 1"
            >
              <path
                d="M4 12H20M20 12L14 6M20 12L14 18"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.workplace-list {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 10px;
  li {
    &:not(:last-child) {
      color: var(--accent-foreground);
      display: inline-flex;
      align-items: center;
      gap: 10px;
      a {
        text-decoration: line-through;
      }
      svg {
        width: 1em;
      }
    }
    &:last-child {
      text-decoration: underline;
    }
  }
}
</style>