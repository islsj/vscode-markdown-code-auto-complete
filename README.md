# Markdown Code Auto Complete - Visual Studio Code Extension

### Features:

en:Visual Studio Code extension that provides code quick suggest for the Markdown snippets (js/css/html/vue).
<br/>
zh:Visual Studio Code 的插件，为 Markdown 代码片段提供代码自动补全提示（js/css/html/vue）。

[![preview.gif](https://i.postimg.cc/9QNkfR3P/preview.gif)](https://postimg.cc/G4GK7pm9)

#### Note:

en:Markdown by default disables quick suggests on code. Add the following configuration to the settings.
<br/>
zh:默认情况下，Markdown 会禁用代码快速提示。将以下配置添加到设置中。

settings.json

```json
	"[markdown]": {
		"editor.quickSuggestions": {
			"other": true,
			"comments": true,
			"strings": true
		}
	}
```

## Tools

- pnpm: monorepo support
- esbuild: bundle extension

## Running the Sample

- Run `pnpm install` in this folder. This installs all necessary npm modules in both the client and server folder

## Build .vsix

- Run `pnpm run pack` in this folder
- `packages/vscode/markdown-code-auto-complete-0.0.1.vsix` will be created, and you can manual install it to VSCode.
