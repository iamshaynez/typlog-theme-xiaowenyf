/**
 * 玄墨 · xiaowenyf
 * 全站点击涟漪 · 导航 · 滚动 · 阅读进度 · 入场显现
 */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 工具 ---------- */
  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }
  function qsa(sel, root) {
    return Array.from((root || document).querySelectorAll(sel));
  }

  /* ---------- 页面已加载标记 ---------- */
  function markLoaded() {
    document.body.classList.add("is-loaded");
  }

  /* ---------- 涟漪：所有可点击元素 ---------- */
  const RIPPLE_SELECTOR = [
    "a",
    "button",
    "[role='button']",
    "[data-clickable]",
    "input[type='submit']",
    "input[type='button']",
    "summary",
    ".btn",
    ".tag",
    ".post-card",
    ".nav-card",
    ".pagination__link",
    ".pagination__num",
    ".site-nav__link",
    ".site-brand",
    ".back-top",
    ".nav-toggle",
  ].join(",");

  function isDarkSurface(el) {
    let node = el;
    while (node && node !== document.body) {
      const bg = getComputedStyle(node).backgroundColor;
      if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
        const m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (m) {
          const [, r, g, b] = m.map(Number);
          const luma = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
          return luma < 0.35;
        }
      }
      node = node.parentElement;
    }
    return false;
  }

  function ensureRippleHost(el) {
    const style = getComputedStyle(el);
    if (style.position === "static") {
      el.style.position = "relative";
    }
    if (style.overflow === "visible") {
      // 允许涟漪裁剪，但不破坏需要 visible 的下拉等
      if (!el.dataset.keepOverflow) {
        el.style.overflow = "hidden";
      }
    }
    el.classList.add("ripple-host");
  }

  function spawnRipple(e, el) {
    if (reduceMotion) return;
    if (e.button !== undefined && e.button !== 0) return;

    ensureRippleHost(el);

    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2.2;
    const x = (e.clientX !== undefined ? e.clientX : rect.left + rect.width / 2) - rect.left - size / 2;
    const y = (e.clientY !== undefined ? e.clientY : rect.top + rect.height / 2) - rect.top - size / 2;

    const ink = document.createElement("span");
    ink.className = "ripple-ink";
    ink.classList.add(isDarkSurface(el) ? "ripple-ink--light" : "ripple-ink--dark");
    ink.style.width = size + "px";
    ink.style.height = size + "px";
    ink.style.left = x + "px";
    ink.style.top = y + "px";

    el.appendChild(ink);
    ink.addEventListener("animationend", () => ink.remove(), { once: true });
    // 兜底清理
    setTimeout(() => ink.remove(), 700);
  }

  function bindRipples(root) {
    qsa(RIPPLE_SELECTOR, root).forEach((el) => {
      if (el.dataset.rippleBound) return;
      el.dataset.rippleBound = "1";
      el.addEventListener(
        "pointerdown",
        (e) => {
          if (e.target.closest("a, button, [data-clickable]") && e.currentTarget !== e.target.closest(RIPPLE_SELECTOR)) {
            // 让更内层元素处理
          }
          spawnRipple(e, el);
        },
        { passive: true }
      );
    });
  }

  /* ---------- 粘性页头 ---------- */
  function bindHeader() {
    const header = qs(".site-header");
    if (!header) return;

    let last = 0;
    const onScroll = () => {
      const y = window.scrollY || 0;
      header.classList.toggle("is-scrolled", y > 8);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- 移动导航 ---------- */
  function bindNav() {
    const toggle = qs(".nav-toggle");
    const nav = qs(".site-nav");
    if (!toggle || !nav) return;

    let backdrop = qs(".nav-backdrop");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.className = "nav-backdrop";
      document.body.appendChild(backdrop);
    }

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      nav.classList.toggle("is-open", open);
      backdrop.classList.toggle("is-open", open);
      document.body.style.overflow = open ? "hidden" : "";
    }

    toggle.addEventListener("click", (e) => {
      spawnRipple(e, toggle);
      const open = toggle.getAttribute("aria-expanded") !== "true";
      setOpen(open);
    });

    backdrop.addEventListener("click", () => setOpen(false));

    qsa("a", nav).forEach((a) => {
      a.addEventListener("click", () => setOpen(false));
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setOpen(false);
    });
  }

  /* ---------- 阅读进度 ---------- */
  function bindReadingProgress() {
    const bar = qs(".reading-progress");
    const article = qs(".article__body");
    if (!bar || !article) return;

    const onScroll = () => {
      const rect = article.getBoundingClientRect();
      const total = article.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      const pct = total > 0 ? (scrolled / total) * 100 : 0;
      bar.style.width = pct + "%";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 返回顶部 ---------- */
  function bindBackTop() {
    const btn = qs(".back-top");
    if (!btn) return;

    const onScroll = () => {
      btn.classList.toggle("is-visible", (window.scrollY || 0) > 480);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    btn.addEventListener("click", (e) => {
      spawnRipple(e, btn);
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ---------- 滚动显现 ---------- */
  function bindReveal() {
    const nodes = qsa(".reveal");
    if (!nodes.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      nodes.forEach((n) => n.classList.add("is-inview"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-inview");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    nodes.forEach((n) => io.observe(n));
  }

  /* ---------- 外部链接安全 ---------- */
  function bindExternalLinks() {
    qsa('a[href^="http"]').forEach((a) => {
      try {
        const url = new URL(a.href);
        if (url.origin !== window.location.origin) {
          a.setAttribute("rel", "noopener noreferrer");
          if (!a.target) a.target = "_blank";
        }
      } catch (_) {
        /* ignore */
      }
    });
  }

  /* ---------- 键盘激活涟漪 ---------- */
  function bindKeyboardRipple() {
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const el = document.activeElement;
      if (!el || !el.matches) return;
      if (el.matches(RIPPLE_SELECTOR)) {
        const rect = el.getBoundingClientRect();
        spawnRipple(
          { clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2, button: 0 },
          el
        );
      }
    });
  }

  /* ---------- 初始化 ---------- */
  function init() {
    markLoaded();
    bindRipples(document);
    bindHeader();
    bindNav();
    bindReadingProgress();
    bindBackTop();
    bindReveal();
    bindExternalLinks();
    bindKeyboardRipple();

    // 动态内容兜底
    if ("MutationObserver" in window) {
      const mo = new MutationObserver((mutations) => {
        mutations.forEach((m) => {
          m.addedNodes.forEach((node) => {
            if (node.nodeType === 1) bindRipples(node);
          });
        });
      });
      mo.observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
