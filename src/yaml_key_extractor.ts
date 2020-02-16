import { TextDocument, Selection } from 'vscode';
import * as vscode from 'vscode';

export class yamlKeyExtractor {
  private document: TextDocument;
  private selection: Selection;
  private extractedSymbols: Array<string>;

  constructor(document: TextDocument, selection: Selection) {
    this.document = document;
    this.selection = selection;
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
      if (!symbol.range.contains(this.selection.active)) {
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
    if (vscode.workspace.getConfiguration('yaml-path-extractor')
      .get<boolean>('yamlPathExtractor.ignoreFilenameRoot') !== true) {
      return true;
    }

    let fileName = this.document.fileName;
    return this.extractedSymbols.length > 0 &&
      symbol.name !== fileName.substr(0, fileName.lastIndexOf('.'));
  }
}