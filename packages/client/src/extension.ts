import * as vscode_0 from "vscode";
import * as utils_0 from "./utils";
import { commands, workspace } from "vscode";
import * as lsp from "vscode-languageclient/node";
import { getCursorLineSnippetContent } from "./embeddedSupport";
import { CHANNEL_MAP } from "./constant";
//
let client: lsp.BaseLanguageClient;
export function activate(context: vscode_0.ExtensionContext) {
	const serverModule = vscode_0.Uri.joinPath(context.extensionUri, "dist", "server.js");
	const serverOptions: lsp.ServerOptions = {
		run: {
			module: serverModule.fsPath,
			transport: lsp.TransportKind.ipc,
		},
		debug: {
			module: serverModule.fsPath,
			transport: lsp.TransportKind.ipc,
		},
	};

	const snippetMap = new Map<string, string>();

	workspace.registerTextDocumentContentProvider(CHANNEL_MAP.EMBEDDED_CONTENT, {
		provideTextDocumentContent: (uri) => {
			const extNameWithDots = utils_0.getPathFileNameExt(uri.fsPath);
			const originalUri = uri.fsPath.slice(1).slice(0, -extNameWithDots.length);
			const decodedUri = decodeURIComponent(originalUri);
			return snippetMap.get(decodedUri);
		},
	});

	const clientOptions: lsp.LanguageClientOptions = {
		documentSelector: [{ scheme: "file", language: "markdown" }],
		middleware: {
			provideSignatureHelp: async (document, range) => {
				const snippetContent = getCursorLineSnippetContent(document);
				// 光标在代码块内
				if (snippetContent) {
					//	添加代码块映射
					snippetMap.set(snippetContent.filePath, snippetContent.snippet);
					//	发送信号
					return await commands.executeCommand<vscode_0.SignatureHelp>("vscode.executeSignatureHelpProvider", snippetContent.filecUri, range);
				} else {
					return undefined;
				}
			},
			//provideDefinition: async (document, range) => {
			//	const snippetContent = getCursorLineSnippetContent(document);
			//	// 光标在代码块内
			//	if (snippetContent) {
			//		//	添加代码块映射
			//		snippetMap.set(snippetContent.filePath, snippetContent.snippet);
			//		//	发送信号
			//		return await commands.executeCommand<vscode_0.DefinitionLink[]>("vscode.executeDefinitionProvider", snippetContent.filecUri, range);
			//	} else {
			//		return undefined;
			//	}
			//},
			provideHover: async (document: vscode_0.TextDocument, range) => {
				const snippetContent = getCursorLineSnippetContent(document);
				// 光标在代码块内
				if (snippetContent) {
					//	添加代码块映射
					snippetMap.set(snippetContent.filePath, snippetContent.snippet);
					//	发送信号
					return (await commands.executeCommand<vscode_0.Hover[]>("vscode.executeHoverProvider", snippetContent.filecUri, range))[0];
				} else {
					return undefined;
				}
			},
			provideCompletionItem: async (document, range, context, token, next) => {
				const snippetContent = getCursorLineSnippetContent(document);
				// 光标在代码块内
				if (snippetContent) {
					//	添加代码块映射
					snippetMap.set(snippetContent.filePath, snippetContent.snippet);
					//	发送信号
					return await commands.executeCommand<vscode_0.CompletionList>("vscode.executeCompletionItemProvider", snippetContent.filecUri, range);
				} else {
					return next(document, range, context, token);
				}
			},
		},
	};

	//创建语言客户端并启动客户端。
	client = new lsp.LanguageClient("markdown-code-auto-complete-server", "markdown-code-auto-complete-server", serverOptions, clientOptions);

	//启动客户端。这也将启动服务器
	client.start();
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}
