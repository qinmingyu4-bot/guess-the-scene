# Changelog

所有重要变更都会记录在这里。

## v1.0.2 - 2026-05-08

### Changed

- Add local server runtime

## Unreleased

### Added

- 新增本地静态服务器 `scripts/server.mjs`。
- 新增 `start` / `serve` 脚本，支持通过 `http://127.0.0.1:4173` 访问游戏。
- README 新增本地服务器运行说明。

## v1.0.1 - 2026-05-08

### Changed

- Enable automated release workflow

## v1.0.0 - 2026-05-08

### Added

- 新增自动版本管理和发布命令 `node scripts/ship.mjs "更新说明"`。
- 自动发布流程会更新 README、更新 CHANGELOG、创建提交、创建版本 tag 并 push 到 GitHub。

## 2026-05-08

### Added

- 新增海龟汤游戏初版。
- 新增 5 个内置谜题。
- 新增提问记录、快速回答、提示、谜底揭晓功能。
- 新增主持人模式。
- 新增关键线索勾选和破案进度。
- 新增案卷插画素材。
- 新增悬疑风格视觉：暗色背景、灯光、扫描纹理、警戒带、案卷编号、证物条和调查板。
- 新增项目文档 `README.md`。
- 新增变更记录 `CHANGELOG.md`。
