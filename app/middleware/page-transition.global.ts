const pageOrder = ["/", "/about", "/works", "/contacts"] as const;

export default defineNuxtRouteMiddleware((to, from) => {
  const toIndex = pageOrder.indexOf(to.path as (typeof pageOrder)[number]);
  const fromIndex = pageOrder.indexOf(from.path as (typeof pageOrder)[number]);

  const name =
    toIndex === -1 || fromIndex === -1
      ? "slide-left"
      : toIndex > fromIndex
        ? "slide-left"
        : "slide-right";

  const transition = { name, css: true };

  // leave берёт meta у from, enter — у to; имена должны совпадать
  to.meta.pageTransition = transition;
  from.meta.pageTransition = transition;
});
