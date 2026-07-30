import { defineNuxtConfig } from "nuxt/config";

const site = {
  name: "Максим Самарцев",
  title: "Максим Самарцев — Frontend-разработчик",
  description:
    "Портфолио frontend-разработчика: HTML, CSS, JavaScript, TypeScript, Angular, Vue, Nuxt и современные веб-технологии.",
  url: "https://samarcev.github.io",
  locale: "ru_RU",
  lang: "ru",
  twitter: "@samarcev",
  image: "/profile.jpg",
  imageAlt: "Максим Самарцев — Frontend-разработчик",
};

const ogImage = `${site.url}${site.image}`;

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  jobTitle: "Frontend Developer",
  description: site.description,
  image: ogImage,
  sameAs: [
    "https://github.com/samarcev",
    "https://t.me/IsRealMax",
    "https://www.linkedin.com/in/samarcev",
  ],
  knowsAbout: [
    "HTML",
    "CSS",
    "JavaScript",
    "TypeScript",
    "Vue.js",
    "Nuxt",
    "Frontend Development",
  ],
};

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint"],
  css: ["~/assets/styles/main.scss"],
  app: {
    head: {
      htmlAttrs: {
        lang: site.lang,
      },
      bodyAttrs: {
        class: "dark",
      },
      title: site.title,
      titleTemplate: `%s · ${site.name}`,
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "description", content: site.description },
        { name: "author", content: site.name },
        { name: "robots", content: "index, follow" },
        { name: "theme-color", content: "#1a1f2e" },

        // Open Graph
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: site.name },
        { property: "og:locale", content: site.locale },
        { property: "og:url", content: site.url },
        { property: "og:title", content: site.title },
        { property: "og:description", content: site.description },
        { property: "og:image", content: ogImage },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { property: "og:image:alt", content: site.imageAlt },

        // Twitter
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: site.twitter },
        { name: "twitter:creator", content: site.twitter },
        { name: "twitter:title", content: site.title },
        { name: "twitter:description", content: site.description },
        { name: "twitter:image", content: ogImage },
        { name: "twitter:image:alt", content: site.imageAlt },
      ],
      link: [
        { rel: "canonical", href: site.url },
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
        },
      ],
      script: [
        {
          type: "application/ld+json",
          innerHTML: JSON.stringify(personSchema),
        },
      ],
    },
  },
});
