import * as fs from 'fs';
import * as vscode from 'vscode';

const excludedFiles = ['node_modules', '.git', '.next', '.env'];

function showQuickPick(items: vscode.QuickPickItem[]) {

	const quickPick = vscode.window.createQuickPick();
	quickPick.items = items;

	quickPick.onDidChangeSelection(selection => {
		if (selection[0]) {
			vscode.window.showInformationMessage(`Selected: ${selection[0].label}`);
		}
	});

	quickPick.onDidHide(() => quickPick.dispose());

	quickPick.show();
}

function getAllFilesAndFoldersRecursively(folderPath: string | undefined, files: string[], folders: string[]) {
	if (folderPath) {
		const entries = fs.readdirSync(folderPath);
		const filteredEntries = entries.filter((v) => !excludedFiles.includes(v));

		filteredEntries.forEach((entry, index) => {
			const fullPath = `${folderPath}/${entry}`;
			const stats = fs.statSync(fullPath);
			const relativePath = vscode.workspace.asRelativePath(fullPath);

			if (stats.isDirectory()) {
				folders.push(relativePath);
				getAllFilesAndFoldersRecursively(fullPath, files, folders);
			} else {
				files.push(entry);
			}
		});

		return { files, folders };
	} else {
		vscode.window.showErrorMessage('No workspace folder is open.');
	}
}

function getAllFilesAndFoldersInCurrentFolder(currentFolder: string | undefined) {
	if (currentFolder) {
		fs.readdir(currentFolder, (err, entries) => {
			if (err) {
				vscode.window.showErrorMessage('Failed to read folder contents.');
				return;
			}

			const files: string[] = [];
			const folders: string[] = [];

			entries.forEach(entry => {
				const fullPath = `${currentFolder}/${entry}`;
				const isDirectory = fs.statSync(fullPath).isDirectory();

				if (isDirectory) {
					// getAllFilesAndFoldersInCurrentFolder()
					folders.push(entry);
				} else {
					files.push(entry);
				}
			});

			vscode.window.showInformationMessage(`Files in current folder: ${files.join(', ')}`);
			vscode.window.showInformationMessage(`Folders in current folder: ${folders.join(', ')}`);
		});
	} else {
		vscode.window.showErrorMessage('No workspace folder is open.');
	}
}
function createNewFile() {
	vscode.window.showInputBox({
		prompt: 'Enter the file name',
		placeHolder: 'myFile.txt',
	}).then((fileName) => {
		if (fileName) {
			const filePath = vscode.workspace.rootPath + '/' + fileName;
			fs.writeFileSync(filePath, ''); // Create an empty file

			vscode.workspace.openTextDocument(filePath).then((doc) => {
				vscode.window.showTextDocument(doc);
			});
		}
	});
}

export function activate(context: vscode.ExtensionContext) {


	let disposable = vscode.commands.registerCommand('file-template-manager.helloWorld', () => {
		// createNewFile();

		const currentFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath; // Get the current workspace folder path


		const files: string[] = [];
		const folders: string[] = [];
		const data = getAllFilesAndFoldersRecursively(currentFolder, files, folders);

		const items: vscode.QuickPickItem[] = [
			{ label: 'Option 1', description: 'First option' },
			{ label: 'Option 2', description: 'Second option' },
			{ label: 'Option 3', description: 'Third option' }
		];
		const a = data?.folders.map((v) => {
			return {
				label: v
			};
		});
		if (a) { showQuickPick(a); }
		// vscode.window.showInformationMessage('Hello World from file-template-manager!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
