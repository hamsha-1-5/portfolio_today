(() => {
  const root = document.documentElement;
  root.classList.replace('no-js', 'js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Split headline into words for the load-in
  const h1 = document.querySelector('.hero h1');
  h1.innerHTML = h1.textContent.trim().split(' ')
    .map((w, i) => `<span class="w" style="--i:${i}">${w}</span>`).join(' ');

  // Rotating focus word
  const rot = document.getElementById('rot');
  const words = ['valuation', 'forecasting', 'risk analysis', 'financial reporting'];
  let n = 0;
  if (!reduce) setInterval(() => {
    rot.classList.add('out');
    setTimeout(() => { rot.textContent = words[++n % words.length]; rot.classList.remove('out'); }, 300);
  }, 2600);

  // Scroll reveal
  const targets = document.querySelectorAll('.section h2, .lead, .project, .skills > div, .timeline li, .contact > *, .stats > div');
  targets.forEach((el, i) => { el.classList.add('reveal'); el.style.setProperty('--d', (i % 3) * 100 + 'ms'); });
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in'); io.unobserve(e.target);
    if (e.target.matches('.stats > div')) countUp(e.target.querySelector('strong'));
  }), { threshold: .2 });
  targets.forEach(el => io.observe(el));

  // Count-up for numeric stats
  function countUp(el) {
    const m = el.textContent.match(/^(\$?)(\d+)(.*)$/);
    if (!m || reduce) return;
    const [, pre, num, suf] = m, end = +num, t0 = performance.now();
    (function tick(t) {
      const p = Math.min((t - t0) / 1400, 1), v = Math.round(end * (1 - Math.pow(1 - p, 3)));
      el.textContent = pre + v + suf;
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }

  // Scroll progress bar and timeline draw
  const bar = document.querySelector('.progress'), tl = document.querySelector('.timeline');
  const onScroll = () => {
    bar.style.transform = `scaleX(${scrollY / (root.scrollHeight - innerHeight || 1)})`;
    const r = tl.getBoundingClientRect();
    tl.style.setProperty('--tl', Math.min(Math.max((innerHeight * .75 - r.top) / r.height, 0), 1));
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
})();
