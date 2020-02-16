import * as vscode from 'vscode';
import * as clipboardy from 'clipboardy';
import { yamlKeyExtractor } from './yaml_key_extractor';
export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('extension.extractKey', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}
		const document = editor.document;
		const position = editor.selection.active;
		const extractor = new yamlKeyExtractor(document, position);
		await extractor.extractYamlKey();
		let fullPath = extractor.fullPath();
		clipboardy.writeSync(fullPath);
		vscode.window.showInformationMessage(`'${fullPath}' copied to your clipboard`);
	});

	context.subscriptions.push(disposable);
}
export function deactivate() { }
