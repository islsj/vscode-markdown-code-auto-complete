import * as vscode_0 from "vscode";
import * as utils_0 from "./utils";
import { CHANNEL_MAP } from "./constant";

export type SnippetContentInfo = {
	snippet: string;
	lang: string;
	cursorLine: vscode_0.Range;
	snippetRange: vscode_0.Range;
	filePath: string;
	channelUrl: string;
	filecUri: vscode_0.Uri;
	isCursorInsideSnippetRegion: boolean;
};

export function getCursorLineSnippetContent(document: vscode_0.TextDocument): SnippetContentInfo | undefined {
	// 验证文件类型markdown
	if (document.languageId !== "markdown") return undefined;
	//	光标所在行
	const activeTextEditor = vscode_0.window.activeTextEditor;
	let cursorLine = -1;
	if (activeTextEditor && activeTextEditor.selection.isEmpty && activeTextEditor.selection.active.line > 0) {
		cursorLine = activeTextEditor.selection.active.line;
	} else {
		return undefined;
	}
	//	开始和结束
	const snippetStartRegExp = "```(" + utils_0.getConfigurationLanguages().join("|") + ")$";
	const snippetEndRegExp = "```$";

	//刷新
	let snippetStart = -1;
	let snippetEnd = -1;
	for (let i = cursorLine; i >= 0; i--) {
		const lineContent = document.lineAt(i).text;
		if (lineContent.match(new RegExp(snippetEndRegExp))) {
			return undefined;
		}
		if (lineContent.match(new RegExp(snippetStartRegExp))) {
			snippetStart = i;
			break;
		}
	}
	for (let i = cursorLine; i < document.lineCount; i++) {
		const lineContent = document.lineAt(i).text;
		if (lineContent.match(new RegExp(snippetStartRegExp))) {
			return undefined;
		}
		if (lineContent.match(new RegExp(snippetEndRegExp))) {
			snippetEnd = i;
			break;
		}
	}

	//	光标不在代码段内
	if (snippetStart === -1 || snippetEnd === -1) return undefined;

	//获取 语言名称,指令行,代码段范围
	const snippetRange = new vscode_0.Range(snippetStart + 1, 0, snippetEnd, 0);
	const snippet = new Array(snippetStart + 1).fill("\n").join("") + document.getText(snippetRange);
	const lang = document.lineAt(snippetStart).text.replace("```", "").trim();
	const filePath = "markdown-code-auto-complete/" + document.uri.toString(true);
	//	文件路径URL
	const channelUrl = `${CHANNEL_MAP.EMBEDDED_CONTENT}:///${encodeURIComponent(filePath)}${utils_0.getConfigurationLangeExt(lang)}`;
	//	文件路径URL转换成统一资源标识符
	const filecUri = vscode_0.Uri.parse(channelUrl);

	return {
		snippetRange,
		snippet,
		lang,
		filePath,
		channelUrl,
		filecUri,
		cursorLine: new vscode_0.Range(snippetEnd, 0, snippetEnd, 0),
		isCursorInsideSnippetRegion: true,
	};
}
