# yaml-path-extractor README

Extension for copying the path to a key in a yaml file. This is specially usefull for I18n files.

## Features

![Demo](https://github.com/jtcontreras90/yaml-path-extractor/blob/master/images/simple_demo.gif?raw=true)

## Requirements

This extension relies in the vscode API, so it needs another extension to define a Language Server Provider. For example, you could install [this extension](https://github.com/redhat-developer/vscode-yaml).

## Extension Settings

This extension contributes the following settings:

* `yamlPathExtractor.pathSeparator`: String used to separate the path parts. For example, 'path **.** to **.** your **.** key' Default is '.' (dot)
* `yamlPathExtractor.ignoreFilenameRoot`: Ignore the root key if it matches the file name. This is usefull for I18n on Ruby on Rails. Default is `true`

## Release Notes

### 1.0.0

Initial release of Yaml Path Extractor
