export function normalizePortalIconName(name = "") {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function preparePortalIcons(root = document) {
  root.querySelectorAll("[data-lucide]").forEach((icon) => {
    const iconName = icon.getAttribute("data-lucide");
    const normalizedName = normalizePortalIconName(iconName);
    icon.classList.add("por-icon");

    if (normalizedName) {
      icon.classList.add(`por-icon-${normalizePortalIconName(iconName)}`);
    }
  });
}

export function refreshLucideIcons() {
  preparePortalIcons();

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

export function isExternalUrl(href) {
  return /^https?:\/\//i.test(href);
}
