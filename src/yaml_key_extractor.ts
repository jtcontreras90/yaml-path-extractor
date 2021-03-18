import { TextDocument, Position } from 'vscode';
import * as vscode from 'vscode';

export class YamlKeyExtractor {
  private document: TextDocument;
  private position: Position;
  private extractedSymbols: Array<string>;
  private fileName: string;

  constructor(document: TextDocument, position: Position) {
    this.document = document;
    this.position = position;
    this.extractedSymbols = [];
    this.fileName = this.getFilename();
  }

  private getFilename() {
    let fileName = this.document.fileName;
    fileName = fileName.substr(fileName.lastIndexOf('/') + 1);
    return fileName.substr(0, fileName.lastIndexOf('.'));
  }

  async extractYamlKey(){
    let symbols = await vscode.commands
      .executeCommand<vscode.DocumentSymbol[]>(
        'vscode.executeDocumentSymbolProvider', this.document.uri);
    if (symbols === undefined) {
      return;
    }

    this.cursorSimbols(symbols);
    return;
  }

  fullPath(): string {
    const separator = vscode.workspace.getConfiguration()
      .get('yamlPathExtractor.pathSeparator') as string;
    if (vscode.workspace.getConfiguration()
      .get('yamlPathExtractor.includeFilename')) {
      this.extractedSymbols.unshift(this.fileName);
    }
    return this.extractedSymbols.join(separator);
  }

  private cursorSimbols(symbols: vscode.DocumentSymbol[]) {
    for (const symbol of symbols) {
      if (!symbol.range.contains(this.position)) {
        continue;
      }

      if (this.shouldAddSymbol(symbol)) {
        this.extractedSymbols.push(symbol.name);
      }

      if (!symbol.children) {
        return;
      }

      this.cursorSimbols(symbol.children);
    }
    return;
  }

  private shouldAddSymbol(symbol: vscode.DocumentSymbol): boolean {
    if (vscode.workspace.getConfiguration()
      .get('yamlPathExtractor.ignoreFilenameRoot') !== true) {
      return true;
    }
    return this.extractedSymbols.length > 0 ||
      symbol.name !== this.fileName;
  }
}