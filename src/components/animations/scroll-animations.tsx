"use client";

import { useEffect } from "react";
import { animationTiming, counterValueAt, formatCounter, staggerDelay } from "@/lib/animations";

type CounterRun = { frame: number; finish: () => void };

export function ScrollAnimations() {
  useEffect(() => {
    const root = document.querySelector("main");
    if (!root || !("IntersectionObserver" in window)) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observed = new Set<HTMLElement>();
    const registered = new WeakSet<HTMLElement>();
    const counters = new Map<HTMLElement, CounterRun>();
    let disposed = false;

    const show = (element: HTMLElement) => {
      observer.unobserve(element);
      observed.delete(element);
      element.dataset.motionState = "shown";
      element.style.removeProperty("--motion-delay");
    };

    const finishCounter = (element: HTMLElement) => {
      const active = counters.get(element);
      if (active) cancelAnimationFrame(active.frame);
      counters.delete(element);
      const display = element.querySelector<HTMLElement>("[data-counter-display]");
      const value = Number(element.dataset.counter);
      const decimals = Number(element.dataset.counterDecimals ?? 0);
      if (display && Number.isFinite(value)) {
        try {
          display.textContent = element.dataset.counterPrefix + formatCounter(value, decimals);
        } catch {
          display.textContent = element.querySelector("[data-final-number]")?.getAttribute("data-final-number") ?? "";
        }
      }
      element.dataset.counterState = "done";
      observer.unobserve(element);
      observed.delete(element);
    };

    const observer = new IntersectionObserver((entries) => {
      try {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((first, second) => first.boundingClientRect.top - second.boundingClientRect.top || first.boundingClientRect.left - second.boundingClientRect.left);
        const rowOrder = new Map<Element, number>();
        for (const entry of visible) {
          const element = entry.target as HTMLElement;
          if (element.hasAttribute("data-counter")) {
            if (entry.intersectionRatio < 0.4 || element.dataset.counterState !== "waiting") continue;
            element.dataset.counterState = "running";
            const value = Number(element.dataset.counter);
            const decimals = Number(element.dataset.counterDecimals ?? 0);
            const duration = Number(element.dataset.counterDuration ?? animationTiming.counter / 1000) * 1000;
            if (!Number.isFinite(value) || !Number.isFinite(duration) || duration <= 0) {
              finishCounter(element);
              continue;
            }
            const display = element.querySelector<HTMLElement>("[data-counter-display]");
            if (!display) {
              finishCounter(element);
              continue;
            }
            const start = performance.now();
            const run: CounterRun = { frame: 0, finish: () => finishCounter(element) };
            const update = (now: number) => {
              if (disposed || reducedMotion.matches || !element.isConnected) {
                run.finish();
                return;
              }
              const elapsed = now - start;
              try {
                display.textContent = element.dataset.counterPrefix + formatCounter(counterValueAt(value, elapsed, duration), decimals);
              } catch {
                run.finish();
                return;
              }
              if (elapsed >= duration) run.finish();
              else run.frame = requestAnimationFrame(update);
            };
            counters.set(element, run);
            run.frame = requestAnimationFrame(update);
            observer.unobserve(element);
            observed.delete(element);
            continue;
          }
          if (entry.intersectionRatio < 0.2 || element.dataset.motionState !== "pending") continue;
          const group = element.closest("[data-reveal-group]");
          let order = 0;
          if (group) {
            const row = [...group.children].filter((child) => {
              const bounds = child.getBoundingClientRect();
              return Math.abs(bounds.top - entry.boundingClientRect.top) < 2 && bounds.bottom > 0 && bounds.top < innerHeight;
            });
            order = row.indexOf(element);
            if (order >= 0) rowOrder.set(group, Math.max(rowOrder.get(group) ?? 0, order + 1));
            else order = rowOrder.get(group) ?? 0;
          }
          const requestedDelay = Number(element.dataset.revealDelay) || 0;
          element.style.setProperty("--motion-delay", `${Math.max(requestedDelay, staggerDelay(order))}ms`);
          element.dataset.motionState = "revealing";
          observer.unobserve(element);
          observed.delete(element);
        }
      } catch {
        for (const element of observed) {
          if (element.hasAttribute("data-counter")) finishCounter(element);
          else show(element);
        }
      }
    }, { threshold: [0, 0.2, 0.4], rootMargin: "0px 0px -60px 0px" });

    const register = (element: HTMLElement) => {
      if (registered.has(element) || element.closest(".hero")) return;
      registered.add(element);
      const isReveal = element.hasAttribute("data-reveal");
      const isCounter = element.hasAttribute("data-counter");
      if (reducedMotion.matches) {
        if (isReveal) show(element);
        if (isCounter) finishCounter(element);
      } else if ((isReveal && element.dataset.reveal !== "fade" && !["up", "left", "right", "image"].includes(element.dataset.reveal ?? "")) || (!isReveal && !isCounter)) {
        show(element);
      } else {
        if (isCounter) element.dataset.counterState = "waiting";
        else element.dataset.motionState = "pending";
        observed.add(element);
        observer.observe(element);
      }
    };

    const autoReveal = ".page-intro, .company-photo, .values-photo, .service-rows article, .rental-rows article, .contact-offices article, .contact-form, .article-readable > .eyebrow, .article-readable > h1, .article-readable > .article-lead, .article-readable > .article-cover, .article-readable > section, .article-advice, .product-summary, .product-description, .product-support span, .vision-section .container > div, .values-grid > div, .catalog-filters, .catalog-toolbar, .pagination, .warranty-note";
    const scan = (node: Node) => {
      if (!(node instanceof HTMLElement)) return;
      const candidates = [
        ...(node.matches(autoReveal) ? [node] : []),
        ...node.querySelectorAll<HTMLElement>(autoReveal),
      ];
      candidates.forEach((element) => {
        if (!element.hasAttribute("data-reveal") && !element.closest("[data-reveal]")) element.dataset.reveal = "up";
      });
      if (node.matches("[data-reveal], [data-counter]")) register(node);
      node.querySelectorAll<HTMLElement>("[data-reveal], [data-counter]").forEach(register);
    };

    const showAll = () => {
      for (const element of observed) {
        if (element.hasAttribute("data-counter")) finishCounter(element);
        else show(element);
      }
      for (const run of counters.values()) {
        cancelAnimationFrame(run.frame);
        run.finish();
      }
      root.querySelectorAll<HTMLElement>('[data-motion-state="pending"]').forEach(show);
      root.querySelectorAll<HTMLElement>('[data-motion-state="revealing"]').forEach(show);
    };

    const cleanupRemoved = (node: Node) => {
      if (!(node instanceof HTMLElement)) return;
      for (const element of observed) {
        if (element === node || node.contains(element)) {
          observer.unobserve(element);
          observed.delete(element);
          if (element.hasAttribute("data-counter")) finishCounter(element);
          else show(element);
        }
      }
      for (const [element, run] of counters) {
        if (element === node || node.contains(element)) run.finish();
      }
    };

    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        record.removedNodes.forEach(cleanupRemoved);
        record.addedNodes.forEach(scan);
      }
    });
    const onFocus = (event: FocusEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const pending = target.closest<HTMLElement>('[data-motion-state="pending"]');
      if (pending) show(pending);
    };
    const onAnimationEnd = (event: AnimationEvent) => {
      const element = event.target;
      if (element instanceof HTMLElement && element.dataset.motionState === "revealing") show(element);
    };
    const onMotionPreference = () => { if (reducedMotion.matches) showAll(); };

    try {
      root.querySelectorAll<HTMLElement>("[data-reveal], [data-counter]").forEach(register);
      mutations.observe(root, { childList: true, subtree: true });
      root.addEventListener("focusin", onFocus);
      root.addEventListener("animationend", onAnimationEnd);
      root.addEventListener("animationcancel", onAnimationEnd);
      reducedMotion.addEventListener("change", onMotionPreference);
    } catch {
      showAll();
    }

    return () => {
      disposed = true;
      mutations.disconnect();
      observer.disconnect();
      root.removeEventListener("focusin", onFocus);
      root.removeEventListener("animationend", onAnimationEnd);
      root.removeEventListener("animationcancel", onAnimationEnd);
      reducedMotion.removeEventListener("change", onMotionPreference);
      for (const run of counters.values()) cancelAnimationFrame(run.frame);
      root.querySelectorAll<HTMLElement>("[data-motion-state]").forEach((element) => {
        delete element.dataset.motionState;
        element.style.removeProperty("--motion-delay");
      });
      root.querySelectorAll<HTMLElement>("[data-counter-state]").forEach((element) => {
        if (element.dataset.counterState === "running" || element.dataset.counterState === "waiting") {
          const display = element.querySelector<HTMLElement>("[data-counter-display]");
          const finalNumber = element.querySelector("[data-final-number]")?.getAttribute("data-final-number");
          if (display && finalNumber !== null && finalNumber !== undefined) display.textContent = finalNumber;
          element.dataset.counterState = "done";
        }
      });
    };
  }, []);

  return null;
}
