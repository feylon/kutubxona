import { onMounted, onUnmounted } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * [data-reveal] elementlarni skroll paytida yumshoq ko'rsatadi.
 * data-reveal="stagger" bo'lsa, farzandlari ketma-ket chiqadi.
 */
export const useReveal = (rootRef) => {
  let ctx;
  onMounted(() => {
    ctx = gsap.context(() => {
      gsap.utils.toArray("[data-reveal]").forEach((el) => {
        const targets = el.dataset.reveal === "stagger" ? el.children : el;
        gsap.from(targets, {
          y: 28,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });
    }, rootRef?.value);
  });
  onUnmounted(() => ctx?.revert());
};

/** Raqamni 0 dan qiymatgacha "sanab" chiqaradi */
export const countUp = (el, value, { duration = 1.6 } = {}) => {
  const obj = { n: 0 };
  return gsap.to(obj, {
    n: value,
    duration,
    ease: "power2.out",
    onUpdate: () => (el.textContent = Math.round(obj.n).toLocaleString("uz-UZ")),
    scrollTrigger: { trigger: el, start: "top 90%", once: true },
  });
};

export { gsap, ScrollTrigger };
