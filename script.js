
/* =========================================
   NAVBAR
========================================= */

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 150;
    const sectionHeight = section.offsetHeight;

    if (
      pageYOffset >= sectionTop &&
      pageYOffset < sectionTop + sectionHeight
    ) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");

    if (link.getAttribute("href").includes(current)) {
      link.classList.add("active");
    }
  });
});


/* =========================================
   ANIMATE ELEMENTS ON SCROLL
========================================= */

const animatedElements = document.querySelectorAll(
  ".animate-fade-slide"
);

function animateOnScroll() {
  animatedElements.forEach(el => {
    const rect = el.getBoundingClientRect();

    if (rect.top < window.innerHeight - 100) {
      el.classList.add("visible");
    }
  });
}

window.addEventListener("scroll", animateOnScroll);
window.addEventListener("load", animateOnScroll);


/* =========================================
   SKILLS ANIMATION
   HORIZONTAL + CIRCULAR
   MOBILE + DESKTOP
========================================= */

const skillBars = document.querySelectorAll(
  ".progress-bar, .radial-bar"
);

// Prepare each bar at zero
function prepareSkillBar(bar) {

  // Horizontal progress bars
  if (bar.classList.contains("progress-bar")) {
    let fill = bar.querySelector(".fill");

    if (!fill) {
      fill = document.createElement("div");
      fill.className = "fill";
      bar.appendChild(fill);
    }

    fill.style.width = "0%";
  }

  // Circular progress bars
  else {
    const circle = bar.querySelector(
      "circle:nth-child(2)"
    );

    if (!circle) return;

    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;

    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = circumference;
  }
}


// Animate each bar to its percentage
function animateSkillBar(bar) {

  // Horizontal progress bars
  if (bar.classList.contains("progress-bar")) {
    const fill = bar.querySelector(".fill");

    const percent = bar.style
      .getPropertyValue("--progress")
      .trim();

    if (!fill) return;

    fill.style.width = percent;
  }

  // Circular progress bars
  else {
    const circle = bar.querySelector(
      "circle:nth-child(2)"
    );

    const label = bar.querySelector(".percentage");

    if (!circle || !label) return;

    const percent = parseFloat(label.textContent) || 0;

    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;

    const offset =
      circumference * (1 - percent / 100);

    circle.style.strokeDashoffset = offset;
  }
}


// Start every skill bar empty
skillBars.forEach(prepareSkillBar);


// Observe bars individually
if ("IntersectionObserver" in window) {

  const skillObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        const bar = entry.target;

        if (entry.isIntersecting) {

          // Start animation
          bar.classList.add("skill-animate");

          animateSkillBar(bar);

        } else {

          // Reset animation when leaving screen
          bar.classList.remove("skill-animate");

          prepareSkillBar(bar);
        }
      });
    },
    {
      threshold: 0,
      rootMargin: "0px 0px -10% 0px"
    }
  );

  skillBars.forEach(bar => {
    skillObserver.observe(bar);
  });

} else {

  // Fallback for older browsers
  skillBars.forEach(bar => {
    bar.classList.add("skill-animate");
    animateSkillBar(bar);
  });

}


/* =========================================
   REVEAL PROJECT CARDS
========================================= */

(() => {
  const cards = document.querySelectorAll(
    ".projects-grid .project-card"
  );

  if (
    !("IntersectionObserver" in window) ||
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
  ) {
    cards.forEach(card => {
      card.classList.add("in-view");
    });
    return;
  }

  cards.forEach(card => {
    card.classList.add("project-reveal");
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.08
    }
  );

  cards.forEach(card => {
    observer.observe(card);
  });
})();


/* =========================================
   ACCESSIBLE MOBILE NAVIGATION
========================================= */

(() => {
  const button = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#site-navigation");

  if (!button || !nav) return;

  const close = () => {
    nav.classList.remove("is-open");

    button.setAttribute(
      "aria-expanded",
      "false"
    );

    button.setAttribute(
      "aria-label",
      "Open navigation menu"
    );
  };

  button.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");

    button.setAttribute(
      "aria-expanded",
      String(open)
    );

    button.setAttribute(
      "aria-label",
      open
        ? "Close navigation menu"
        : "Open navigation menu"
    );
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", close);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      close();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 780) {
      close();
    }
  });
})();
