<script setup lang="ts">
import Matter from "matter-js";

import iconAngular from "~/assets/media/images/angular.svg";
import iconConfluence from "~/assets/media/images/confluence.svg";
import iconCss from "~/assets/media/images/css.svg";
import iconDocker from "~/assets/media/images/docker.svg";
import iconFigma from "~/assets/media/images/figma.svg";
import iconGit from "~/assets/media/images/git.svg";
import iconGithub from "~/assets/media/images/github.svg";
import iconHtml from "~/assets/media/images/html5.svg";
import iconJira from "~/assets/media/images/jira.svg";
import iconJs from "~/assets/media/images/javascript.svg";
import iconLinkedin from "~/assets/media/images/linkedin.svg";
import iconNode from "~/assets/media/images/nodejs.svg";
import iconNpm from "~/assets/media/images/npm.svg";
import iconNuxt from "~/assets/media/images/nuxt.svg";
import iconSass from "~/assets/media/images/sass.svg";
import iconTailwind from "~/assets/media/images/tailwindcss.svg";
import iconTelegram from "~/assets/media/images/telegram.svg";
import iconTs from "~/assets/media/images/typescript.svg";
import iconYarn from "~/assets/media/images/yarn.svg";

type StackItem = {
  id: string;
  label: string;
  src: string;
  href?: string;
};

const items: StackItem[] = [
  { id: "html", label: "HTML5", src: iconHtml },
  { id: "css", label: "CSS", src: iconCss },
  { id: "sass", label: "Sass", src: iconSass },
  { id: "js", label: "JavaScript", src: iconJs },
  { id: "ts", label: "TypeScript", src: iconTs },
  { id: "angular", label: "Angular", src: iconAngular },
  { id: "nuxt", label: "Nuxt", src: iconNuxt },
  { id: "node", label: "Node.js", src: iconNode },
  { id: "npm", label: "npm", src: iconNpm },
  { id: "yarn", label: "Yarn", src: iconYarn },
  { id: "tailwind", label: "Tailwind CSS", src: iconTailwind },
  { id: "docker", label: "Docker", src: iconDocker },
  { id: "figma", label: "Figma", src: iconFigma },
  { id: "jira", label: "Jira", src: iconJira },
  { id: "confluence", label: "Confluence", src: iconConfluence },
  { id: "git", label: "Git", src: iconGit },
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

const ITEM_SIZE = 70;
const DROP_DELAY_MS = 250;
const DROP_STAGGER_MS = 10;
const DRAG_DELAY_MS = 180;
const DRAG_MOVE_THRESHOLD = 8;

const containerRef = ref<HTMLElement | null>(null);
const itemRefs = ref<HTMLElement[]>([]);

const setItemRef = (el: Element | null, index: number) => {
  if (el) itemRefs.value[index] = el as HTMLElement;
};

let engine: Matter.Engine | null = null;
let runner: Matter.Runner | null = null;
let grabConstraint: Matter.Constraint | null = null;
let ceiling: Matter.Body | null = null;
let bodies: Matter.Body[] = [];
let rafId = 0;
let dropTimers: ReturnType<typeof setTimeout>[] = [];
let wasDragged = false;
let disposed = false;
let activePointerId: number | null = null;
let dragDelayTimer: ReturnType<typeof setTimeout> | null = null;
let pendingPointer: {
  pointerId: number;
  index: number;
  start: { x: number; y: number };
} | null = null;

const getLocalPoint = (event: PointerEvent) => {
  const container = containerRef.value;
  if (!container) return { x: 0, y: 0 };
  const rect = container.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
};

const syncDom = () => {
  if (disposed) return;

  for (let i = 0; i < bodies.length; i++) {
    const body = bodies[i];
    const el = itemRefs.value[i];
    if (!body || !el) continue;

    const { x, y } = body.position;
    el.style.transform = `translate(${x - ITEM_SIZE / 2}px, ${y - ITEM_SIZE / 2}px) rotate(${body.angle}rad)`;
    el.style.visibility = "visible";
  }

  rafId = requestAnimationFrame(syncDom);
};

const buildWalls = (width: number, height: number) => {
  const thickness = 80;
  const opts: Matter.IChamferableBodyDefinition = {
    isStatic: true,
    render: { visible: false },
  };

  return [
    Matter.Bodies.rectangle(
      width / 2,
      height + thickness / 2,
      width + thickness * 2,
      thickness,
      opts,
    ),
    Matter.Bodies.rectangle(
      -thickness / 2,
      height / 2,
      thickness,
      height * 2,
      opts,
    ),
    Matter.Bodies.rectangle(
      width + thickness / 2,
      height / 2,
      thickness,
      height * 2,
      opts,
    ),
  ];
};

const addCeiling = (width: number) => {
  if (!engine || ceiling) return;

  ceiling = Matter.Bodies.rectangle(width / 2, -40, width + 160, 80, {
    isStatic: true,
    render: { visible: false },
  });
  Matter.Composite.add(engine.world, ceiling);
};

const clearPendingDrag = () => {
  if (dragDelayTimer !== null) {
    clearTimeout(dragDelayTimer);
    dragDelayTimer = null;
  }
  pendingPointer = null;
};

const releaseGrab = () => {
  if (engine && grabConstraint) {
    Matter.World.remove(engine.world, grabConstraint);
  }
  grabConstraint = null;
  activePointerId = null;
  clearPendingDrag();
};

const beginGrab = (
  pointerId: number,
  index: number,
  point: { x: number; y: number },
) => {
  if (!engine || grabConstraint) return;

  const body = bodies[index];
  if (!body) return;

  clearPendingDrag();
  activePointerId = pointerId;
  wasDragged = true;
  containerRef.value?.setPointerCapture(pointerId);

  Matter.Sleeping.set(body, false);

  const worldOffset = {
    x: point.x - body.position.x,
    y: point.y - body.position.y,
  };

  grabConstraint = Matter.Constraint.create({
    pointA: { ...point },
    bodyB: body,
    pointB: Matter.Vector.rotate(worldOffset, -body.angle),
    stiffness: 0.35,
    damping: 0.1,
    length: 0,
  });

  Matter.World.add(engine.world, grabConstraint);
};

const onPointerDown = (event: PointerEvent) => {
  if (!engine || event.button !== 0) return;

  const target = event.target as HTMLElement | null;
  const itemEl = target?.closest?.(".stack__item") as HTMLElement | null;
  if (!itemEl) return;

  const index = Number(itemEl.dataset.index);
  if (!bodies[index]) return;

  // Не preventDefault — короткий клик по ссылке должен пройти
  const point = getLocalPoint(event);
  wasDragged = false;
  pendingPointer = {
    pointerId: event.pointerId,
    index,
    start: point,
  };

  dragDelayTimer = setTimeout(() => {
    if (!pendingPointer || pendingPointer.pointerId !== event.pointerId) return;
    beginGrab(
      pendingPointer.pointerId,
      pendingPointer.index,
      pendingPointer.start,
    );
  }, DRAG_DELAY_MS);
};

const onPointerMove = (event: PointerEvent) => {
  const point = getLocalPoint(event);

  if (
    pendingPointer &&
    event.pointerId === pendingPointer.pointerId &&
    !grabConstraint
  ) {
    const dx = point.x - pendingPointer.start.x;
    const dy = point.y - pendingPointer.start.y;
    if (Math.hypot(dx, dy) > DRAG_MOVE_THRESHOLD) {
      beginGrab(pendingPointer.pointerId, pendingPointer.index, point);
    }
    return;
  }

  if (!grabConstraint || event.pointerId !== activePointerId) return;

  grabConstraint.pointA.x = point.x;
  grabConstraint.pointA.y = point.y;
};

const onPointerUp = (event: PointerEvent) => {
  if (
    pendingPointer &&
    event.pointerId === pendingPointer.pointerId &&
    !grabConstraint
  ) {
    clearPendingDrag();
    return;
  }

  if (event.pointerId !== activePointerId) return;
  releaseGrab();
};

const onLinkClick = (event: MouseEvent) => {
  if (wasDragged) {
    event.preventDefault();
    event.stopPropagation();
  }
  wasDragged = false;
};

const initPhysics = () => {
  const container = containerRef.value;
  if (!container || disposed) return;

  const { width, height } = container.getBoundingClientRect();
  if (width < 40 || height < 40) return;

  const { Engine, World, Bodies, Runner } = Matter;

  engine = Engine.create({
    gravity: { x: 0, y: 1.1, scale: 0.001 },
  });

  World.add(engine.world, buildWalls(width, height));

  container.addEventListener("pointerdown", onPointerDown);
  container.addEventListener("pointermove", onPointerMove);
  container.addEventListener("pointerup", onPointerUp);
  container.addEventListener("pointercancel", onPointerUp);

  runner = Runner.create();
  Runner.run(runner, engine);
  syncDom();

  items.forEach((_, index) => {
    const timer = setTimeout(
      () => {
        if (!engine || disposed) return;

        const el = itemRefs.value[index];
        if (!el) return;

        const x = 40 + Math.random() * Math.max(width - 80, 40);
        const y = -ITEM_SIZE - Math.random() * 120;

        const body = Bodies.rectangle(x, y, ITEM_SIZE, ITEM_SIZE, {
          restitution: 0.45,
          friction: 0.4,
          frictionAir: 0.02,
          density: 0.004,
          render: { visible: false },
        });

        World.add(engine.world, body);
        bodies[index] = body;
      },
      DROP_DELAY_MS + index * DROP_STAGGER_MS,
    );

    dropTimers.push(timer);
  });

  dropTimers.push(
    setTimeout(
      () => addCeiling(width),
      DROP_DELAY_MS + items.length * DROP_STAGGER_MS + 1200,
    ),
  );
};

const destroyPhysics = () => {
  disposed = true;
  dropTimers.forEach(clearTimeout);
  dropTimers = [];
  cancelAnimationFrame(rafId);
  releaseGrab();

  const container = containerRef.value;
  if (container) {
    container.removeEventListener("pointerdown", onPointerDown);
    container.removeEventListener("pointermove", onPointerMove);
    container.removeEventListener("pointerup", onPointerUp);
    container.removeEventListener("pointercancel", onPointerUp);
  }

  if (runner) Matter.Runner.stop(runner);
  if (engine) {
    Matter.World.clear(engine.world, false);
    Matter.Engine.clear(engine);
  }

  engine = null;
  runner = null;
  ceiling = null;
  bodies = [];
};

onMounted(() => {
  disposed = false;
  requestAnimationFrame(() => initPhysics());
});

onBeforeUnmount(() => {
  destroyPhysics();
});
</script>

<template>
  <div ref="containerRef" class="stack-container">
    <ul class="stack">
      <li
        v-for="(item, index) in items"
        :key="item.id"
        :ref="(el) => setItemRef(el as Element | null, index)"
        class="stack__item"
        :data-index="index"
      >
        <span class="stack__tip">{{ item.label }}</span>
        <a
          v-if="item.href"
          class="stack__link"
          :href="item.href"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="item.label"
          @click="onLinkClick"
        >
          <img
            :src="item.src"
            :alt="item.label"
            width="56"
            height="56"
            draggable="false"
          />
        </a>
        <img
          v-else
          :src="item.src"
          :alt="item.label"
          width="56"
          height="56"
          draggable="false"
        />
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.stack-container {
  position: relative;
  width: 100%;
  min-height: 320px;
  height: min(52dvh, 480px);
  margin-top: 2rem;
  overflow: hidden;
  touch-action: none;
  user-select: none;
}

.stack {
  position: absolute;
  inset: 0;
}

.stack__item {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 70px;
  visibility: hidden;
  will-change: transform;
  cursor: grab;

  &:hover {
    z-index: 2;

    .stack__tip {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }

    img {
      filter: drop-shadow(0 4px 10px rgb(0 0 0 / 25%));
    }
  }

  &:active {
    cursor: grabbing;
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
    pointer-events: none;
    filter: sepia(1) saturate(2.2) hue-rotate(-15deg) brightness(0.6)
      drop-shadow(0 4px 10px rgb(0 0 0 / 25%));
    transition: filter 0.25s ease;
  }
}

.stack__tip {
  position: absolute;
  left: 50%;
  bottom: calc(100% + 8px);
  z-index: 3;
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--popover);
  color: var(--popover-foreground);
  font-size: var(--text-xs);
  font-weight: 500;
  line-height: 1.2;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transform: translateX(-50%) translateY(4px);
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.stack__link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
</style>
