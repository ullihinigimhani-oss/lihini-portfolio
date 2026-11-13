import React, { useEffect, useRef } from 'react';

// Content starts visible. Unsupported animation/observer APIs simply skip effects.
export default function Reveal({ as: Element = 'div', delay = 0, immediate = false, children, ...props }) {
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!node?.animate || preference.matches) return;
    let animation;
    let observer;
    const show = () => {
      if (preference.matches || node.contains(document.activeElement)) return;
      animation = node.animate([
        { opacity: 0, transform: 'translateY(14px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ], { duration: 550, delay: Math.min(delay, 240), easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'backwards' });
    };
    if (immediate) show();
    else if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) { show(); observer.disconnect(); }
      }, { threshold: 0.08 });
      observer.observe(node);
    }
    // Never leave a keyboard-focused control waiting for a reveal animation.
    const finish = () => { observer?.disconnect(); animation?.cancel(); };
    node.addEventListener('focusin', finish);
    const onPreference = () => { if (preference.matches) { observer?.disconnect(); finish(); } };
    preference.addEventListener('change', onPreference);
    return () => { observer?.disconnect(); animation?.cancel(); node.removeEventListener('focusin', finish); preference.removeEventListener('change', onPreference); };
  }, [delay, immediate]);
  return <Element ref={ref} {...props}>{children}</Element>;
}
