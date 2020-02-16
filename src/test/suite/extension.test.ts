import * as assert from 'assert';
import { yamlKeyExtractor } from '../../yaml_key_extractor';
import { Selection, Position } from 'vscode';
import * as vscode from 'vscode';

suite('Extension Test Suite', async () => {
	vscode.window.showInformationMessage('Start all tests.');
	test('Simple test', async () => {
		const testCoverage = await vscode.workspace.findFiles("**/test1.yml");
		let document = await vscode.workspace.openTextDocument(testCoverage[0]);
		let position = new Position(2, 15)
		let extractor = new yamlKeyExtractor(document, position)
		await extractor.extractYamlKey();
		let fullPath = extractor.fullPath();
		assert.equal(fullPath, 'key1.key12.key121');
	});
	test('Ignore root test', async () => {
		const testCoverage = await vscode.workspace.findFiles("**/test2.yml");
		let document = await vscode.workspace.openTextDocument(testCoverage[0]);
		let position = new Position(2, 15)
		let extractor = new yamlKeyExtractor(document, position)
		await extractor.extractYamlKey();
		let fullPath = extractor.fullPath();
		assert.equal(fullPath, 'key12.key121');
	});
});
