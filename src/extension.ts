import * as fs      from "fs";
import * as pathlib from "path";
import * as vscode  from "vscode";
import path = require( "path" );
const ignoredFiles: string[] = [
	// Node.js / JavaScript
	"node_modules",
	".npm",

	// Python
	"__pycache__",
	".venv",
	"venv",
	".virtualenv",

	// Java
	"target",

	// Editor/IDE-specific
	".vscode",
	".idea",
	".vs",

	// Build and Output Artifacts
	"build",
	"dist",
	"out",

	// Compiled Files
	"*.class",
	"*.dll",
	"*.exe",
	"*.o",
	"*.pyc",
	"*.jar",
	"*.war",
	"*.so",
	"*.a",
	"*.lib",

	// Logs and Temporary Files
	"*.log",
	"*.tmp",
	"*.swp",

	// Configuration and Environment Files
	".env",
	".env.local",
	".env.*",

	// Dependency Management
	"yarn.lock",
	"package-lock.json",
	"pipfile.lock",
	"Gemfile.lock",

	// User-specific and Sensitive Data
	".DS_Store",
	".gitignore",
	".git",
	".gitattributes",
	".editorconfig",
	".env.local",
	".env.*.local",
	".history",
	".bash_history",
	".zsh_history",
	".config",
	".ssh"
];

const excludedFiles      = [ "node_modules", ".git", ".next", ".env" ];
const GENERIC_ERROR      = "Oops! Something went wrong. We're on it!";
const INVALID_PATH_ERROR =  "Invalid input. Curly Braces only, please.";

function showQuickPick ( items: vscode.QuickPickItem[], onSelect: ( v: readonly vscode.QuickPickItem[] ) => void ): void {
	const quickPick = vscode.window.createQuickPick ();

	quickPick.items = items;

	quickPick.onDidChangeSelection ( c => {
		onSelect ( c );
		quickPick.hide ();
	} );

	quickPick.onDidHide ( () => {
		quickPick.dispose ();
	} );

	quickPick.show ();
}

async function getAllFilesAndFoldersRecursively ( folderPath: string | undefined, files: string[], folders: string[] ): Promise<string[] | undefined> {
	if ( folderPath !== undefined ) {
		const entries         = fs.readdirSync ( folderPath );
		const filteredEntries = entries.filter ( v => !ignoredFiles.includes ( v ) );

		filteredEntries.forEach ( ( entry, index ) => {
			const fullPath     = `${ folderPath }/${ entry }`;
			const stats        = fs.statSync ( fullPath );
			const relativePath = vscode.workspace.asRelativePath ( fullPath );

			if ( stats.isDirectory () ) {
				folders.push ( relativePath );
				void getAllFilesAndFoldersRecursively ( fullPath, files, folders );
			}
		} );

		return folders;
	} else {
		await vscode.window.showErrorMessage ( "No workspace folder is open." );
	}
}

async function createFile ( filePath: string ) {
	const isDirectory   = filePath.endsWith ( "/" );
	const currentFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath; // Get the current workspace folder path
	const isNested      = /(?!^)\/(?!$)/.test ( filePath );

	if ( currentFolder ) {
		const directoryPath        = pathlib.dirname ( filePath );
		const currentDirectoryPath = pathlib.join ( currentFolder, directoryPath );
		const currentFilePath      = pathlib.join ( currentFolder, filePath );

		if ( isNested ) {
			// nested directory
			// /pages/auth/
			if ( isDirectory ) {
				const currentDirectoryPath = pathlib.join ( currentFolder, filePath );

				if ( !fs.existsSync ( directoryPath ) ) {
					fs.mkdirSync ( currentDirectoryPath, { recursive : true } );
					await vscode.window.showInformationMessage ( `'${ filePath }' created successfully!` );
				} else {
					await vscode.window.showInformationMessage ( `'${ filePath }' already exists` );
				}
			} else {
			// nested file
			// /pages/auth/index.js
				if ( !fs.existsSync ( directoryPath ) ) {
					fs.mkdirSync ( currentDirectoryPath, { recursive : true } );
					fs.writeFileSync ( currentFilePath, "" );
					try {
						vscode.workspace.openTextDocument ( currentFilePath )
							.then ( doc => {
								vscode.window.showTextDocument ( doc );
							} )
							.then ( async () => {
								await vscode.window.showInformationMessage ( `'${ filePath }' created successfully!` );
							} );
					} catch ( error ) {
						await vscode.window.showErrorMessage ( GENERIC_ERROR );
					}
				} else {
					await vscode.window.showErrorMessage ( GENERIC_ERROR );
				}
			}
		} else if ( isDirectory ) {

			// root directory
			// /pages/
			const currentDirectoryPath = pathlib.join ( currentFolder, filePath );

			if ( !fs.existsSync ( filePath ) ) {
				fs.mkdirSync ( currentDirectoryPath, { recursive : true } );
				await vscode.window.showInformationMessage ( `'${ filePath }' created successfully!` );
			} else {
				await vscode.window.showErrorMessage ( `'${ filePath }' already exists` );
			}
		} else {
			// root file
			// /index.ts
			try {
				fs.writeFileSync ( currentFilePath, "" );
				vscode.workspace.openTextDocument ( currentFilePath )
					.then ( doc => {
						vscode.window.showTextDocument ( doc );
					} )
					.then ( async () => {
						await vscode.window.showErrorMessage ( GENERIC_ERROR );
					} );
			} catch ( error ) {
				await vscode.window.showErrorMessage ( GENERIC_ERROR );
			}
		}
	}
}
const splitInput = ( str: string ) => {
	const input         = str.split ( "/" )?.at ( -1 )?.split ( "}" );
	const cleanedString = input?.[0].replace ( /{|}|\[|\]/g, "" );
	const filesArr      = cleanedString?.split ( "," ).map ( v => v.trim () );

	const b = filesArr?.map ( a => {
		if ( a.split ( "." ).length <= 1 )
			return a + input?.[1];

		return a;
	} );

	return { folder : str.split ( "/" ).slice ( 0, -1 ).join ( "/" ), filesArr : b };
};

export function activate ( context: vscode.ExtensionContext ): void {
	const disposable = vscode.commands.registerCommand ( "quick-file.createNewFile", async () => {
		const currentFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath; // Get the current workspace folder path

		const files: string[]   = [];
		const folders: string[] = [];
		const data              = await getAllFilesAndFoldersRecursively ( currentFolder, files, folders );

		const quickPickOptions = data?.map ( ( v, index ) => {
			if ( index === 0 ) {
				return {
					label : "/"
				};
			}

			return {
				label : `/${ v }`
			};
		} );

		if ( quickPickOptions != null ) {
			showQuickPick ( quickPickOptions, selection => {
				const inputPrompt = {
					prompt      : "Enter the file name",
					placeHolder : "newfile.txt"
				};

				vscode.window.showInputBox ( inputPrompt )
					.then ( generateFile ( selection ) );
			} );
		}
	} );

	context.subscriptions.push ( disposable );
}

function generateFile ( selection: readonly vscode.QuickPickItem[] ): ( ( value: string | undefined ) => void | Thenable<void> ) | undefined {
	return async inputVal => {
		if ( inputVal ) {
			if ( inputVal.includes ( "{" ) ) {
				if ( !inputVal.includes ( "}" ) ) {
					await vscode.window.showErrorMessage ( INVALID_PATH_ERROR );

					return;
				} else {
					const split = splitInput ( inputVal );

					split.filesArr?.forEach ( val => {
						createFile ( pathlib.join ( selection[0].label, split.folder, val ) );
					} );
				}
			} else {
				createFile ( pathlib.join ( selection[0].label, inputVal ) );
			}
		}
	};
}
// This method is called when your extension is deactivated
export function deactivate () { }
