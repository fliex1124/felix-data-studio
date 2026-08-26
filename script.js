document.documentElement.classList.add("js");

const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");

function setMenu(open) {
  if (!menuButton || !nav) return;
  nav.classList.toggle("is-open", open);
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "关闭导航菜单" : "打开导航菜单");
}

menuButton?.addEventListener("click", () => {
  setMenu(!nav.classList.contains("is-open"));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});

document.addEventListener("click", (event) => {
  if (!nav?.classList.contains("is-open")) return;
  if (!nav.contains(event.target) && !menuButton.contains(event.target)) setMenu(false);
});

const serviceField = document.querySelector("#service");
const problemField = document.querySelector("#problem");
const sourceField = document.querySelector("#source");

const sourceLabels = new Map([
  ["xianyu", "闲鱼"],
  ["taobao", "淘宝"],
  ["pinduoduo", "拼多多"],
  ["xiaohongshu", "小红书"]
]);

const serviceCodes = new Map([
  ["FDS-S01", "Excel 报表自动化"],
  ["FDS-S02", "数据分析与看板"],
  ["FDS-S03", "企业网页与活动页"],
  ["FDS-S04", "内部工作台"],
  ["FDS-S05", "微信小程序"],
  ["FDS-S06", "PPT 与商业报告"],
  ["FDS-S07", "商品文案与卖点梳理"],
  ["FDS-S08", "电商与社媒视觉"],
  ["FDS-P01", "店铺视觉套装"]
]);

const entryParams = new URLSearchParams(window.location.search);
const sourceLabel = sourceLabels.get(entryParams.get("source")) || "官网直接访问";
const requestedService = serviceCodes.get(entryParams.get("service")) || entryParams.get("service");

if (sourceField) sourceField.value = sourceLabel;

if (serviceField && requestedService) {
  const hasRequestedService = Array.from(serviceField.options).some((option) => option.value === requestedService);
  if (hasRequestedService) serviceField.value = requestedService;
}

document.querySelectorAll("[data-service]").forEach((button) => {
  button.addEventListener("click", () => {
    if (serviceField) serviceField.value = button.dataset.service;
    document.querySelector("#brief")?.scrollIntoView({ behavior: "smooth" });
    window.setTimeout(() => problemField?.focus(), 500);
  });
});

const caseTabs = Array.from(document.querySelectorAll("[data-case-tab]"));
const casePanels = Array.from(document.querySelectorAll(".case-panel[role='tabpanel']"));

function activateCaseTab(activeTab, moveFocus = false) {
  if (!activeTab) return;

  caseTabs.forEach((tab) => {
    const selected = tab === activeTab;
    tab.classList.toggle("is-active", selected);
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });

  casePanels.forEach((panel) => {
    panel.hidden = panel.id !== activeTab.getAttribute("aria-controls");
  });

  if (moveFocus) activeTab.focus();
}

caseTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activateCaseTab(tab));
  tab.addEventListener("keydown", (event) => {
    let targetIndex;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      targetIndex = (index + 1) % caseTabs.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      targetIndex = (index - 1 + caseTabs.length) % caseTabs.length;
    } else if (event.key === "Home") {
      targetIndex = 0;
    } else if (event.key === "End") {
      targetIndex = caseTabs.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    activateCaseTab(caseTabs[targetIndex], true);
  });
});

if (caseTabs.length) {
  const selectedTab = caseTabs.find((tab) => tab.getAttribute("aria-selected") === "true") || caseTabs[0];
  activateCaseTab(selectedTab);
}

const briefForm = document.querySelector("#brief-form");
const briefText = document.querySelector("#brief-text");
const outputEmpty = document.querySelector("#output-empty");
const outputResult = document.querySelector("#output-result");
const copyButton = document.querySelector("#copy-brief");
const copyStatus = document.querySelector("#copy-status");

briefForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!briefForm.reportValidity()) return;

  const formData = new FormData(briefForm);
  const summary = [
    "Felix 项目需求摘要",
    "",
    `咨询来源：${formData.get("source") || "官网直接访问"}`,
    `服务类型：${formData.get("service")}`,
    `当前问题：${formData.get("problem")}`,
    `期望结果：${formData.get("result")}`,
    `期望时间：${formData.get("timeline")}`,
    `预算范围：${formData.get("budget")}`,
    `脱敏样例或合法素材：${formData.get("sample") ? "可以提供" : "暂时没有"}`,
    "",
    "说明：以上为初步需求，具体范围、周期、修改次数和报价需要在沟通后确认。"
  ].join("\n");

  briefText.value = summary;
  outputEmpty.hidden = true;
  outputResult.hidden = false;
  copyStatus.textContent = "";
  briefText.focus();
});

copyButton?.addEventListener("click", async () => {
  const value = briefText?.value;
  if (!value) return;

  try {
    await navigator.clipboard.writeText(value);
    copyStatus.textContent = "已复制，可以粘贴到平台对话中。";
  } catch {
    briefText.select();
    const copied = document.execCommand("copy");
    copyStatus.textContent = copied ? "已复制，可以粘贴到平台对话中。" : "复制失败，请手动选择文字复制。";
  }
});

document.querySelector("#current-year")?.replaceChildren(String(new Date().getFullYear()));

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

window.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) window.lucide.createIcons();
});
