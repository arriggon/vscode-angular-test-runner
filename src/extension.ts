// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as cp from 'child_process';

let channel: vscode.OutputChannel;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "angulartestrunner" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let runTestFile = vscode.commands.registerCommand('angulartestrunner.runTestFile', () => {
		// The code you place here will be executed every time your command is executed
		if (channel) {
			channel.dispose();
		}

		channel = vscode.window.createOutputChannel("Angular Karma Tests");
		channel.show();

		const file = getFileName();
		const path = getFilePath();

		if (file && path) {
			if (isTestFile(file)) {
				cp.exec(`cd ${path} && npm run test -- --watch="false" --include="**\\${file}"`, (err, stdout, stderr) => {
					channel.appendLine(stdout);
					channel.appendLine(stderr);
					if (err) {
						channel.appendLine(err.message);
					}

					channel.appendLine(`Tests run for ${file}!`);
				});
			} else {
				channel.appendLine("Open file is not a recognized test-file!");
			}
		} else {
			channel.appendLine("No file open or in focus!");
		}
	});

	context.subscriptions.push(runTestFile);
}

// this method is called when your extension is deactivated
export function deactivate() {}

function getFileName(): string | undefined {
	return vscode.window.activeTextEditor?.document.fileName.split(/[\s/\s\\]+/).reverse()[0];
}

function getFilePath(): string | undefined {
	const path = vscode.window.activeTextEditor?.document.fileName;
	const file = getFileName();
	
	if (file) {
		return path?.replace(file, "");
	}

}

function isTestFile(fileName: string): boolean {
	return fileName.endsWith(".spec.ts");
}