(function () {
  const config = window.SiteConfig || {};

  function setText(node, value) {
    node.textContent = `${node.dataset.configPrefix || ""}${value || ""}${node.dataset.configSuffix || ""}`;
  }

  function setAsset(node, value) {
    if (!value) return;
    if (node.tagName === "IMG") {
      node.src = value;
      node.alt = config.companyName || "";
      return;
    }
    node.href = value;
  }

  function applyValue(node, key) {
    const value = config[key];

    if (key === "browserTitle") {
      if (value) document.title = value;
      if (node.tagName === "TITLE") setText(node, value);
      return;
    }

    if (key === "favicon" || key === "logo") {
      setAsset(node, value);
      return;
    }

    if (key === "email") {
      setText(node, value);
      if (node.tagName === "A") node.href = value ? "mailto:" + value : "";
      return;
    }

    setText(node, value);
  }

  function applySiteConfig() {
    document.querySelectorAll("[data-config]").forEach((node) => {
      applyValue(node, node.dataset.config);
    });
  }

  window.applySiteConfig = applySiteConfig;
  document.addEventListener("DOMContentLoaded", applySiteConfig);
})();
