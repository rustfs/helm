try {
  const savedTheme = localStorage.getItem("rustfs-theme");
  document.documentElement.dataset.theme =
    savedTheme ||
    (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
} catch {
  document.documentElement.dataset.theme = "light";
}

function initializeSite() {
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const themeIcon = themeToggle?.querySelector("span");

  function updateThemeToggle() {
    const isDark = document.documentElement.dataset.theme === "dark";
    if (themeIcon) {
      themeIcon.textContent = isDark ? "☀" : "☾";
    }
    themeToggle?.setAttribute(
      "aria-label",
      isDark ? "Switch to light theme" : "Switch to dark theme",
    );
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      "content",
      isDark ? "#050506" : "#ffffff",
    );
  }

  themeToggle?.addEventListener("click", () => {
    const nextTheme =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    try {
      localStorage.setItem("rustfs-theme", nextTheme);
    } catch {
      // The selected theme still applies for the current page.
    }
    updateThemeToggle();
  });

  const announcement = document.querySelector("[data-announcement]");
  try {
    if (sessionStorage.getItem("rustfs-announcement-dismissed") === "true") {
      announcement?.setAttribute("hidden", "");
    }
  } catch {
    // Keep the announcement visible when storage is unavailable.
  }

  document
    .querySelector("[data-dismiss-announcement]")
    ?.addEventListener("click", () => {
      announcement?.setAttribute("hidden", "");
      try {
        sessionStorage.setItem("rustfs-announcement-dismissed", "true");
      } catch {
        // Dismissing the announcement still works for the current page.
      }
    });

  document.querySelectorAll("details").forEach((details) => {
    details.addEventListener("toggle", () => {
      if (!details.open) {
        return;
      }
      document.querySelectorAll("details[open]").forEach((other) => {
        if (other !== details) {
          other.removeAttribute("open");
        }
      });
    });
  });

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Node)) {
      return;
    }
    document.querySelectorAll("details[open]").forEach((details) => {
      if (!details.contains(event.target)) {
        details.removeAttribute("open");
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      document.querySelectorAll("details[open]").forEach((details) => {
        details.removeAttribute("open");
      });
    }
  });

  updateThemeToggle();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeSite, { once: true });
} else {
  initializeSite();
}
