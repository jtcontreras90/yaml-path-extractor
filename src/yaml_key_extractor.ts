import { Position, Range, TextDocument, Selection } from 'vscode';
import * as vscode from 'vscode';

export default function yamlKeyExtraction(document: TextDocument, selection: Selection) {
  vscode.commands
    .executeCommand<vscode.DocumentSymbol[]>(
      'vscode.executeDocumentSymbolProvider', document.uri)
    .then(symbols => {
      if (symbols === undefined) {
        return;
      }

      for (const variable of symbols) {
        if (variable.range.contains(selection.active)) {
          console.log('Yes:');
          console.log(variable.name);
        }
        console.log(variable.name);
      }
    });
}