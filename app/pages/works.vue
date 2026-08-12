<script setup lang="ts">
import type { WorkCardData } from "~/components/WorkCard.vue";

interface WorkItem {
  url: string;
  data: WorkCardData | null;
  loading: boolean;
}

const myWorksUrls: string[] = ["https://skarlatova.online/"];

async function getSiteInfo(url: string): Promise<WorkCardData> {
  const res = await fetch(
    `https://api.ogfetch.com/preview?url=${encodeURIComponent(url)}`,
  );
  return await res.json();
}

const myWorks = ref<WorkItem[]>(
  myWorksUrls.map((url) => ({ url, data: null, loading: true })),
);

myWorks.value.forEach(async (item) => {
  try {
    item.data = await getSiteInfo(item.url);
  } finally {
    item.loading = false;
  }
});
</script>

<template>
  <section class="page">
    <div class="container">
      <h1>Работы</h1>

      <div class="works-list">
        <WorkCard
          v-for="work in myWorks"
          :key="work.url"
          :url="work.url"
          :loading="work.loading"
          :data="work.data"
          class="work-item"
        />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.works-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  margin-top: 1.5rem;
  .work-item {
    width: 100%;
    max-width: 300px;
  }
}
</style>
