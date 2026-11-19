(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(pointer: fine)").matches;

  window.scan = root => {
    const items = $$(".wi, .card, .pr, .sk, .ti, .full, .cmt", root || document);
    if (reduced || !("IntersectionObserver" in window)) {
      items.forEach(item => item.classList.add("visible"));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: .12 });
    items.forEach((item, index) => {
      item.classList.add("reveal", `reveal-delay-${index % 3}`);
      observer.observe(item);
    });
  };

  const name = $("#nm");
  if (name) {
    name.setAttribute("aria-label", name.textContent.trim().replace(/\s+/g, " "));
    let index = 0;
    name.innerHTML = name.textContent.trim().split(/\s+/).map(word =>
      `<span class="r" aria-hidden="true">${[...word].map(char =>
        `<span class="c" style="--i:${index++}">${char}</span>`).join("")}</span>`).join("");
  }

  const navLinks = $$(".nl a");
  const sections = $$("main > section[id], header[id]");
  if (navLinks.length && sections.length && "IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => link.classList.toggle("on", link.getAttribute("href") === `#${entry.target.id}`));
      });
    }, { rootMargin: "-30% 0px -55% 0px" });
    sections.forEach(section => navObserver.observe(section));
  }

  if (finePointer && !reduced) {
    addEventListener("pointermove", event => {
      document.documentElement.style.setProperty("--cursor-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--cursor-y", `${event.clientY}px`);
    }, { passive: true });

    $$(".pr").forEach(project => project.addEventListener("pointermove", event => {
      const bounds = project.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - .5;
      const y = (event.clientY - bounds.top) / bounds.height - .5;
      const example = $(".ex", project);
      if (!example) return;
      example.style.setProperty("--tx", `${-x * 42}px`);
      example.style.setProperty("--ty", `${-y * 28}px`);
    }));

    $$(".sk").forEach(skill => {
      skill.addEventListener("pointermove", event => {
        const bounds = skill.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - .5;
        const y = (event.clientY - bounds.top) / bounds.height - .5;
        skill.style.setProperty("--skill-x", `${x * 5}px`);
        skill.style.setProperty("--skill-y", `${y * 4}px`);
        skill.style.transform = `translate(var(--skill-x), var(--skill-y)) rotate(${x * .6}deg)`;
      });
      skill.addEventListener("pointerleave", () => {
        skill.style.removeProperty("transform");
        skill.style.removeProperty("--skill-x");
        skill.style.removeProperty("--skill-y");
      });
    });

    $$(".bt, .cs a").forEach(link => link.addEventListener("pointermove", event => {
      const bounds = link.getBoundingClientRect();
      link.style.setProperty("--lift-x", `${(event.clientX - bounds.left - bounds.width / 2) * .06}px`);
      link.style.setProperty("--lift-y", `${(event.clientY - bounds.top - bounds.height / 2) * .06}px`);
      link.style.transform = `translate(var(--lift-x), var(--lift-y))`;
    }));
    $$(".bt, .cs a").forEach(link => link.addEventListener("pointerleave", () => {
      link.style.removeProperty("transform");
    }));
  }

  const updateScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    document.documentElement.style.setProperty("--scroll", `${max ? scrollY / max * 100 : 0}%`);
    const timeline = $(".tl");
    if (!timeline) return;
    const bounds = timeline.getBoundingClientRect();
    const marker = innerHeight * .65;
    timeline.style.setProperty("--p", Math.max(0, Math.min(1, (marker - bounds.top) / bounds.height)));
    $$(".ti").forEach(item => item.classList.toggle("on", item.getBoundingClientRect().top < marker));
  };
  addEventListener("scroll", updateScroll, { passive: true });
  addEventListener("resize", updateScroll);
  updateScroll();
  window.scan();
  $$("#yr, #year").forEach(item => item.textContent = new Date().getFullYear());
})();
