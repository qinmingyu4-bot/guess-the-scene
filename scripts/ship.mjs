#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const args = process.argv.slice(2);
const bumpType = args.includes("--major") ? "major" : args.includes("--minor") ? "minor" : "patch";
const message = args.filter((arg) => !arg.startsWith("--")).join(" ").trim() || "Update project";

function git(args, options = {}) {
  const output = execFileSync("git", args, {
    cwd: root,
    encoding: "utf8",
    stdio: options.stdio || "pipe"
  });

  return typeof output === "string" ? output.trim() : "";
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function bump(version, type) {
  const parts = version.split(".").map(Number);
  if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) {
    throw new Error(`Invalid version: ${version}`);
  }

  if (type === "major") {
    return `${parts[0] + 1}.0.0`;
  }
  if (type === "minor") {
    return `${parts[0]}.${parts[1] + 1}.0`;
  }
  return `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function updateReadme(version) {
  const path = join(root, "README.md");
  let text = readFileSync(path, "utf8");
  const versionLine = `**当前版本：** v${version}`;

  if (text.includes("**当前版本：**")) {
    text = text.replace(/\*\*当前版本：\*\* v?\d+\.\d+\.\d+/, versionLine);
  } else {
    text = text.replace(
      "一个可以直接在浏览器里玩的海龟汤小游戏。玩家只能通过“是 / 否 / 无关 / 接近”的问答逼近真相，主持人可以查看谜底、释放提示并勾选关键线索。\n",
      `一个可以直接在浏览器里玩的海龟汤小游戏。玩家只能通过“是 / 否 / 无关 / 接近”的问答逼近真相，主持人可以查看谜底、释放提示并勾选关键线索。\n\n${versionLine}\n`
    );
  }

  writeFileSync(path, text);
}

function updateChangelog(version, summary) {
  const path = join(root, "CHANGELOG.md");
  const text = readFileSync(path, "utf8");
  const entry = `## v${version} - ${today()}\n\n### Changed\n\n- ${summary}\n\n`;
  const marker = "所有重要变更都会记录在这里。\n\n";
  const next = text.includes(marker)
    ? text.replace(marker, `${marker}${entry}`)
    : `${text.trim()}\n\n${entry}`;

  writeFileSync(path, next);
}

function hasChanges() {
  return git(["status", "--porcelain"]).length > 0;
}

const branch = git(["branch", "--show-current"]) || "main";
const pkgPath = join(root, "package.json");
const pkg = readJson(pkgPath);
const nextVersion = bump(pkg.version, bumpType);
const tag = `v${nextVersion}`;

git(["fetch", "origin", branch], { stdio: "inherit" });
git(["pull", "--rebase", "--autostash", "origin", branch], { stdio: "inherit" });

pkg.version = nextVersion;
writeJson(pkgPath, pkg);
updateReadme(nextVersion);
updateChangelog(nextVersion, message);

if (!hasChanges()) {
  console.log("No changes to commit.");
  process.exit(0);
}

git(["add", "-A"], { stdio: "inherit" });
git(["commit", "-m", `chore(release): ${tag} - ${message}`], { stdio: "inherit" });
git(["tag", "-a", tag, "-m", tag], { stdio: "inherit" });
git(["push", "-u", "origin", branch], { stdio: "inherit" });
git(["push", "origin", tag], { stdio: "inherit" });

console.log(`Published ${tag}.`);
