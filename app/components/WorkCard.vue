<script setup lang="ts">
export interface WorkCardData {
  title: string;
  description: string;
  image: string | { url?: string };
  url: string;
  favicon: string;
}

const props = defineProps<{
  url: string;
  loading?: boolean;
  data?: WorkCardData | null;
}>();

const siteUrl = computed(() => props.data?.url || props.url);

const hostname = computed(() => {
  try {
    return new URL(siteUrl.value).hostname.replace(/^www\./, "").toUpperCase();
  } catch {
    return props.url;
  }
});

function resolveAssetUrl(value: string | { url?: string } | undefined): string {
  const raw = typeof value === "string" ? value : value?.url;
  if (!raw) return "";

  try {
    return new URL(raw, siteUrl.value).href;
  } catch {
    return raw;
  }
}

const imageSrc = computed(() => resolveAssetUrl(props.data?.image));
const faviconSrc = computed(() => resolveAssetUrl(props.data?.favicon));
</script>

<template>
  <div v-if="loading" class="work-card work-card--skeleton" aria-hidden="true">
    <div class="work-card__media work-card__shimmer" />
    <div class="work-card__body">
      <div class="work-card__meta">
        <div class="work-card__favicon work-card__shimmer" />
        <div class="work-card__host work-card__shimmer" />
      </div>
      <div class="work-card__title work-card__shimmer" />
    </div>
  </div>

  <a
    v-else-if="data"
    class="work-card"
    :href="data.url || url"
    target="_blank"
    rel="noopener noreferrer"
  >
    <div class="work-card__media">
      <img v-if="imageSrc" :src="imageSrc" :alt="data.title" loading="lazy" />
    </div>
    <div class="work-card__body">
      <div class="work-card__meta">
        <img
          v-if="faviconSrc"
          class="work-card__favicon"
          :src="faviconSrc"
          alt=""
          width="16"
          height="16"
        />
        <span class="work-card__host">{{ hostname }}</span>
      </div>
      <h2 class="work-card__title">{{ data.title }}</h2>
      <p v-if="data.description" class="work-card__desc">
        {{ data.description }}
      </p>
    </div>
  </a>
</template>

<style scoped lang="scss">
.work-card {
  display: block;
  overflow: hidden;
  border-radius: var(--radius-lg);
  background: var(--card);
  color: var(--card-foreground);
  text-decoration: none;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:not(.work-card--skeleton):hover {
    box-shadow: 0 8px 24px color-mix(in oklab, black 25%, transparent);
    .work-card__media {
      img {
        transform: scale(1.075);
      }
    }
  }
}

.work-card__media {
  aspect-ratio: 1.91 / 1;
  background: var(--muted);
  overflow: hidden;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
  }
}

.work-card__body {
  display: grid;
  gap: 0.5rem;
  padding: 1rem 1.1rem 1.15rem;
}

.work-card__meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
}

.work-card__favicon {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  object-fit: cover;
}

.work-card__host {
  overflow: hidden;
  color: var(--muted-foreground);
  font-size: var(--text-xs);
  font-weight: 500;
  letter-spacing: 0.04em;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.work-card__title {
  margin: 0;
  color: var(--card-foreground);
  font-size: var(--text-base);
  font-weight: 700;
  line-height: var(--leading-snug);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.work-card__desc {
  margin: 0;
  color: var(--muted-foreground);
  font-size: var(--text-sm);
  line-height: var(--leading-normal);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.work-card--skeleton {
  height: 310px;
  .work-card__favicon {
    width: 16px;
    height: 16px;
  }

  .work-card__host {
    width: 9rem;
    height: 0.75rem;
    border-radius: var(--radius-sm);
  }

  .work-card__title {
    width: 85%;
    height: 1.1rem;
    border-radius: var(--radius-sm);
  }

  .work-card__desc {
    display: grid;
    gap: 0.45rem;
  }

  .work-card__line {
    height: 0.8rem;
    width: 100%;
    border-radius: var(--radius-sm);
  }

  .work-card__line--short {
    width: 70%;
  }
}

.work-card__shimmer {
  background: linear-gradient(
    90deg,
    var(--muted) 25%,
    var(--border) 50%,
    var(--muted) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.2s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}
</style>
