const state = {
  snapshot: null,
  activeTab: "overview",
};

async function fetchJSON(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

function formatMetric(metric) {
  return `${Number(metric.value).toFixed(metric.decimals)} ${metric.unit}`;
}

function renderMetrics(metrics) {
  const root = document.getElementById("metrics-grid");
  root.innerHTML = metrics
    .map(
      (metric) => `
        <article class="metric-card">
          <div class="metric-label">${metric.label}</div>
          <strong>${Number(metric.value).toFixed(metric.decimals)}</strong>
          <span class="metric-unit">${metric.unit}</span>
        </article>
      `
    )
    .join("");

  const margin = metrics.find((metric) => metric.key === "margin");
  document.getElementById("hero-kpi").textContent = margin ? formatMetric(margin) : "--";
}

function renderAgents(agents) {
  const root = document.getElementById("agent-mesh");
  root.innerHTML = agents
    .map(
      (agent) => `
        <article class="agent-card ${agent.status}">
          <p class="panel-kicker">${agent.persona}</p>
          <h3>${agent.name}</h3>
          <p>${agent.focus}</p>
          <span class="agent-status">${agent.status === "active" ? "处理中" : agent.status === "engaged" ? "已参与" : "待命"}</span>
        </article>
      `
    )
    .join("");
}

function renderSemanticFeed(items) {
  const root = document.getElementById("semantic-feed");
  root.innerHTML = items
    .map(
      (item) => `
        <article class="feed-item">
          <div class="feed-path">${item.path}</div>
          <strong>${item.value} ${item.unit}</strong>
          <small>${item.time} · 可信度 ${item.confidence}</small>
          <small>${item.summary}</small>
        </article>
      `
    )
    .join("");
}

function renderTimeline(items) {
  const root = document.getElementById("timeline");
  root.innerHTML = items
    .map(
      (item) => `
        <article class="timeline-item">
          <strong>${item.title}</strong>
          <small>${item.time}</small>
          <small>${item.detail}</small>
        </article>
      `
    )
    .join("");
}

function renderReasoningBoard(session) {
  const root = document.getElementById("reasoning-board");
  if (!session) {
    root.innerHTML = '<div class="reasoning-step queued">等待新任务进入编排器。</div>';
    document.getElementById("active-title").textContent = "当前无激活任务";
    return;
  }

  document.getElementById("active-title").textContent = session.title;
  root.innerHTML = session.steps
    .map(
      (step) => `
        <article class="reasoning-step ${step.status}">
          <div class="reasoning-tag">${step.agent}</div>
          <strong>${step.title}</strong>
          <p>${step.summary}</p>
          <ul>
            ${step.semantic_subgraph.map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </article>
      `
    )
    .join("");
}

function renderRecommendation(session) {
  const root = document.getElementById("recommendation-card");
  if (!session) {
    root.className = "recommendation-card empty";
    root.textContent = "暂无决策建议。请先触发一个演示场景。";
    return;
  }

  root.className = "recommendation-card";
  root.innerHTML = `
    <div class="reasoning-tag">${session.recommendation.owner}</div>
    <h3>${session.recommendation.headline}</h3>
    <p>${session.recommendation.summary}</p>
    <ul>${session.tradeoffs.map((item) => `<li>${item}</li>`).join("")}</ul>
  `;
}

function renderCausalChain(session) {
  const root = document.getElementById("causal-chain");
  if (!session) {
    root.className = "causal-chain empty";
    root.textContent = "等待智能体生成动态因果链。";
    return;
  }

  root.className = "causal-chain";
  root.innerHTML = session.causal_chain
    .map(
      (item, index) => `
        <article class="chain-item">
          <div class="feed-path">Step ${index + 1}</div>
          <strong>${item.title}</strong>
          <small>${item.detail}</small>
        </article>
      `
    )
    .join("");
}

function renderEvidence(session) {
  const root = document.getElementById("evidence-list");
  if (!session) {
    root.className = "evidence-list empty";
    root.textContent = "触发场景后，这里会显示工业知识库检索结果。";
    return;
  }

  root.className = "evidence-list";
  root.innerHTML = session.evidence
    .map(
      (item) => `
        <article class="evidence-item">
          <strong>${item.title}</strong>
          <small>${item.source}</small>
          <small>${item.detail}</small>
        </article>
      `
    )
    .join("");
}

function applySnapshot(snapshot) {
  state.snapshot = snapshot;
  renderMetrics(snapshot.metrics);
  renderAgents(snapshot.agents);
  renderSemanticFeed(snapshot.semantic_events);
  renderTimeline(snapshot.feed);
  renderReasoningBoard(snapshot.active_session);
  renderRecommendation(snapshot.active_session);
  renderCausalChain(snapshot.active_session);
  renderEvidence(snapshot.active_session);
}

function setActiveTab(target) {
  state.activeTab = target;

  document.querySelectorAll("[data-tab-target]").forEach((button) => {
    const isActive = button.getAttribute("data-tab-target") === target;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  document.querySelectorAll("[data-tab-panel]").forEach((panel) => {
    panel.classList.toggle("active", panel.getAttribute("data-tab-panel") === target);
  });
}

async function loadSnapshot() {
  const snapshot = await fetchJSON("/api/state");
  applySnapshot(snapshot);
}

async function runScenario(key) {
  const snapshot = await fetchJSON(`/api/scenarios/${key}/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  });
  applySnapshot(snapshot);
}

async function submitChat(message) {
  const result = await fetchJSON("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  document.getElementById("chat-response").textContent = `${result.summary} ${result.insight}`;
  if (result.state) {
    applySnapshot(result.state);
  }
}

function bindEvents() {
  document.querySelectorAll("[data-tab-target]").forEach((button) => {
    button.addEventListener("click", () => {
      setActiveTab(button.getAttribute("data-tab-target"));
    });
  });

  document.querySelectorAll("[data-scenario]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.getAttribute("data-scenario");
      runScenario(key).catch((error) => {
        document.getElementById("chat-response").textContent = error.message;
      });
    });
  });

  document.getElementById("chat-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.getElementById("chat-input");
    const message = input.value.trim();
    if (!message) {
      return;
    }
    submitChat(message).catch((error) => {
      document.getElementById("chat-response").textContent = error.message;
    });
    input.value = "";
  });
}

async function bootstrap() {
  bindEvents();
  setActiveTab(state.activeTab);
  const snapshot = await fetchJSON("/api/bootstrap");
  applySnapshot(snapshot);
  setInterval(() => {
    loadSnapshot().catch(() => {});
  }, 1200);
}

bootstrap().catch((error) => {
  document.getElementById("chat-response").textContent = error.message;
});
