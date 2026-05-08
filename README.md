# Guess the Scene

一个可以直接在浏览器里玩的海龟汤小游戏。玩家只能通过“是 / 否 / 无关 / 接近”的问答逼近真相，主持人可以查看谜底、释放提示并勾选关键线索。

**当前版本：** v1.0.2

## 功能

- 5 个内置海龟汤谜题
- 玩家提问记录
- 快速回答按钮：是、否、无关、接近
- 逐步提示
- 谜底揭晓
- 主持人模式
- 关键线索勾选和破案进度
- 悬疑风格界面：暗场、案卷编号、证物条、调查板

## 运行

这是一个纯静态项目，不需要安装依赖。

推荐用本地服务器运行：

```sh
node scripts/server.mjs
```

然后在浏览器访问：

```text
http://127.0.0.1:4173
```

需要换端口时：

```sh
PORT=5173 node scripts/server.mjs
```

也可以直接打开：

```text
index.html
```

当前本地路径：

```text
~/ai-lab/guess-the-scene/index.html
```

## 玩法

1. 主持人打开“主持人模式”，阅读谜底和关键点。
2. 玩家只能提出可以用“是 / 否 / 无关 / 接近”回答的问题。
3. 主持人记录问题并选择快速回答。
4. 卡住时可以发放提示。
5. 玩家猜中关键真相后，主持人勾选关键点。
6. 全部关键点完成后，可以揭晓谜底。

## 修改题库

谜题数据在 `script.js` 的 `soups` 数组里。新增一题时，按下面结构添加即可：

```js
{
  title: "标题",
  difficulty: "中等",
  theme: "主题",
  scene: "玩家看到的汤面。",
  answer: "主持人看到的完整真相。",
  hints: [
    "提示一。",
    "提示二。",
    "提示三。"
  ],
  keys: ["关键点一", "关键点二", "关键点三"]
}
```

## 自动发布

以后修改完项目后，运行下面命令即可自动完成版本管理、文档更新、提交和推送：

```sh
node scripts/ship.mjs "本次更新说明"
```

默认会升级补丁版本，例如 `v1.0.0` 到 `v1.0.1`。需要升级小版本或大版本时：

```sh
node scripts/ship.mjs --minor "新增一组谜题"
node scripts/ship.mjs --major "重做游戏结构"
```

如果本机安装了 `npm`，也可以使用 `npm run ship -- "本次更新说明"`。

这个命令会自动：

- 更新 `package.json` 版本号
- 更新 README 当前版本
- 在 CHANGELOG 顶部加入新版本记录
- 创建 Git commit
- 创建版本 tag
- push 到 GitHub `origin/main`
- push 对应版本 tag

## 文件结构

```text
guess-the-scene/
  index.html
  styles.css
  script.js
  package.json
  scripts/
    server.mjs
    ship.mjs
  assets/
    case-desk.svg
```
