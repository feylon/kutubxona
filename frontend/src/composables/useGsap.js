import { onMounted, onUnmounted } from "vue";
import gsap from "gsap";

/**
 * [data-reveal] elementlarni ko'rinish maydoniga kirganda yumshoq ko'rsatadi.
 * data-reveal="stagger" bo'lsa, farzandlari ketma-ket chiqadi.
 * Ma'lumotlar yuklangandan so'ng `refresh()` chaqirilsa, yangi elementlar ham qo'shiladi.
 */
export const useReveal = (rootRef) => {
  let observer;

  const targetsOf = (el) => (el.dataset.reveal === "stagger" ? [...el.children] : [el]);

  const scan = () => {
    const root = rootRef?.value ?? document;
    root.querySelectorAll("[data-reveal]").forEach((el) => {
      if (el.dataset.revealed) return;
      const targets = targetsOf(el);
      if (!targets.length) return;
      el.dataset.revealed = "1";
      gsap.set(targets, { y: 28, opacity: 0 });
      observer.observe(el);
    });
  };

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          gsap.to(targetsOf(entry.target), { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.08, overwrite: true });
        });
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    scan();
  });
  onUnmounted(() => observer?.disconnect());

  return { refresh: scan };
};

/** Raqamni 0 dan qiymatgacha "sanab" chiqaradi */
export const countUp = (el, value, { duration = 1.6, delay = 0 } = {}) => {
  const obj = { n: 0 };
  return gsap.to(obj, {
    n: value,
    duration,
    delay,
    ease: "power2.out",
    onUpdate: () => (el.textContent = Math.round(obj.n).toLocaleString("ru-RU").replace(/ /g, " ")),
  });
};

export { gsap };
