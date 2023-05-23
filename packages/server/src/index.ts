import { getLanguageService } from "vscode-html-languageservice";
import { createConnection, InitializeParams, ProposedFeatures, TextDocuments, TextDocumentSyncKind } from "vscode-languageserver/node";
import { TextDocument } from "vscode-languageserver-textdocument";

//为服务器创建连接。该连接使用节点的IPC作为传输。
//还包括所有预览/提议的LSP功能。
//	创建连接	--	建议所有功能
const connection = createConnection(ProposedFeatures.all);

//创建一个简单的文本文档管理器。文本文档管理器
//仅支持完整文档同步
//创建一个新的文本文档管理器。
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);
//	获取语言服务
const htmlLanguageService = getLanguageService();

connection.onInitialize((_params: InitializeParams) => {
	return {
		capabilities: {
			textDocumentSync: TextDocumentSyncKind.Full,
			//告诉客户端服务器支持代码完成
			//服务器提供完成支持。
			completionProvider: {
				//服务器提供解析完成项目的附加信息的支持。
				resolveProvider: false,
				triggerCharacters: ["."],
			},
			signatureHelpProvider: {
				triggerCharacters: ["("],
			},
			hoverProvider: true,
			definitionProvider: true,

			//codeActionProvider: true,
			//completionProvider: true,
			//referencesProvider: true,
			//documentHighlightProvider: true,
		},
	};
});

//	安装完成请求的处理程序。
connection.onCompletion(async (textDocumentPosition) => {
	const document = documents.get(textDocumentPosition.textDocument.uri);
	if (!document) {
		return null;
	}
	return htmlLanguageService.doComplete(document, textDocumentPosition.position, htmlLanguageService.parseHTMLDocument(document));
});

documents.listen(connection);

connection.listen();
