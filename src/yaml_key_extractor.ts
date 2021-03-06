import { TextDocument, Position } from 'vscode';
import * as vscode from 'vscode';

export class yamlKeyExtractor {
  private document: TextDocument;
  private position: Position;
  private extractedSymbols: Array<string>;

  constructor(document: TextDocument, position: Position) {
    this.document = document;
    this.position = position;
    this.extractedSymbols = [];
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
      .get('yamlPathExtractor.pathSeparator') as string
    return this.extractedSymbols.join(separator);
  }

  private cursorSimbols(symbols: vscode.DocumentSymbol[]) {
    for (const symbol of symbols) {
      if (!symbol.range.contains(this.position)) {
        continue;
      }

      if (this.shouldAddSymbol(symbol)) {
        this.extractedSymbols.push(symbol.name)
      }

      if (!symbol.children) {
        return;
      }

      this.cursorSimbols(symbol.children)
    }
    return;
  }

  private shouldAddSymbol(symbol: vscode.DocumentSymbol): boolean {
    if (vscode.workspace.getConfiguration()
      .get('yamlPathExtractor.ignoreFilenameRoot') !== true) {
      return true;
    }
    let fileName = this.document.fileName;
    fileName = fileName.substr(fileName.lastIndexOf('/') + 1)
    return this.extractedSymbols.length > 0 ||
      symbol.name !== fileName.substr(0, fileName.lastIndexOf('.'));
  }
}