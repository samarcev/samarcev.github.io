<script setup lang="ts"></script>

<template>
  <section class="page home">
    <div class="container">
      <h1>
        Максим Самарцев
        <img
          style="width: 1em; display: inline; vertical-align: baseline"
          src="/favicon.svg"
          aria-hidden="true"
          alt=""
        />
      </h1>
      <h2 class="home__role">Frontend-разработчик</h2>
      <ClientOnly>
        <HomeStack />
      </ClientOnly>
    </div>
  </section>
</template>