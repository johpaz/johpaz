import { writeFileSync } from "node:fs";

const OWNER = "johpaz";
const TOKEN = process.env.GITHUB_TOKEN;

const REPOS = [
  { id: "hive", label: "Hive", icon: "🐝" },
  { id: "HiveLearn", label: "HiveLearn", icon: "📚" },
  { id: "hiveCode", label: "HiveCode", icon: "🛠️" },
  { id: "hive-sdk", label: "Hive SDK", icon: "🧰" },
  { id: "hive-cli", label: "Hive-CLI", icon: "⚡" },
];

function timeAgo(dateStr) {
  if (!dateStr) return "—";
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (days <= 0) return "hoy";
  if (days === 1) return "ayer";
  if (days < 30) return `hace ${days}d`;
  const months = Math.floor(days / 30);
  if (months < 12) return `hace ${months}m`;
  return `hace ${Math.floor(months / 12)}a`;
}

function esc(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;");
}

async function fetchRepo(repo) {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "hive-stats-generator",
  };
  if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;

  const res = await fetch(`https://api.github.com/repos/${OWNER}/${repo.id}`, { headers });
  if (!res.ok) {
    console.error(`No se pudo obtener ${repo.id}: HTTP ${res.status}`);
    return { ...repo, stars: 0, forks: 0, pushedAt: null, language: "—" };
  }
  const data = await res.json();
  return {
    ...repo,
    stars: data.stargazers_count,
    forks: data.forks_count,
    pushedAt: data.pushed_at,
    language: data.language || "—",
  };
}

const results = await Promise.all(REPOS.map(fetchRepo));

const WIDTH = 760;
const HEADER_HEIGHT = 56;
const ROW_HEIGHT = 54;
const HEIGHT = HEADER_HEIGHT + results.length * ROW_HEIGHT + 16;

const rows = results
  .map((r, i) => {
    const y = HEADER_HEIGHT + i * ROW_HEIGHT + ROW_HEIGHT / 2;
    return `
    <g transform="translate(0, ${y})">
      <text x="32" y="5" class="repo-name">${r.icon} ${esc(r.label)}</text>
      <text x="420" y="5" class="stat">⭐ ${r.stars}</text>
      <text x="500" y="5" class="stat">🍴 ${r.forks}</text>
      <text x="580" y="5" class="stat-dim">${esc(r.language)}</text>
      <text x="728" y="5" class="stat-dim" text-anchor="end">${esc(timeAgo(r.pushedAt))}</text>
    </g>`;
  })
  .join("\n");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-label="Hive Ecosystem stats">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0d1117"/>
      <stop offset="100%" stop-color="#161b22"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#58a6ff"/>
      <stop offset="100%" stop-color="#bc8cff"/>
    </linearGradient>
  </defs>
  <style>
    .title { font: 700 16px -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; fill: url(#accent); }
    .repo-name { font: 600 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; fill: #f0f6fc; }
    .stat { font: 13px 'SFMono-Regular', Consolas, Menlo, monospace; fill: #c9d1d9; }
    .stat-dim { font: 13px 'SFMono-Regular', Consolas, Menlo, monospace; fill: #8b949e; }
    .sep { stroke: #30363d; stroke-width: 1; }
  </style>
  <rect width="${WIDTH}" height="${HEIGHT}" rx="12" fill="url(#bg)" stroke="#30363d"/>
  <text x="24" y="34" class="title">🐝 Hive Ecosystem — Stats en vivo</text>
  <line x1="0" y1="${HEADER_HEIGHT}" x2="${WIDTH}" y2="${HEADER_HEIGHT}" class="sep"/>
  ${rows}
</svg>
`;

writeFileSync("hive-ecosystem-stats.svg", svg);
console.log("Generado hive-ecosystem-stats.svg");
