import * as vscode_0 from "vscode";
/**
 * 获取工作空间配置
 */
export function getPluginConfiguration(): vscode_0.WorkspaceConfiguration {
	return vscode_0.workspace.getConfiguration("markdown-code-auto-complete");
}
/**
 * 获取代码片段的语言
 */
export function getConfigurationLanguages(): any[] {
	return Array.from(new Map(getPluginConfiguration().get("languages") as any[]).keys());
}

/**
 * 获取代码片段的文件名后缀
 *  @param { string } lang
 */
export function getConfigurationLangeExt(lang: string): string {
	const languages = getPluginConfiguration().get("languages") as any[];
	return languages.find((item: any[]) => item[0].split("|").includes(lang))[1].langExt;
}
/**
 * 获取路径不带点的文件名后缀
 *  @param { string } lang
 */
export function getPathFileNameExtWithOutDots(fileFullPath: string) {
	const regexMatch = fileFullPath.match(/.*[\/\\].*\.(.*)/);
	return regexMatch ? regexMatch[1] : fileFullPath;
}
/**
 * 获取路径的文件名后缀
 *  @param { string } lang
 */
export function getPathFileNameExt(fileFullPath: string) {
	const regexMatch = fileFullPath.match(/.*[\/\\].*(\..*)/);
	return regexMatch ? regexMatch[1] : fileFullPath;
}
