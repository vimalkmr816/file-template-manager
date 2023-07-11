import * as fs from "fs"
import * as pathlib from "path"
import * as vscode from "vscode"

const excludedFiles = ["node_modules", ".git", ".next", ".env"]

function showQuickPick (items: vscode.QuickPickItem[], onSelect: (v: readonly vscode.QuickPickItem[]) => void): void {
	const quickPick = vscode.window.createQuickPick()
	quickPick.items = items

	quickPick.onDidChangeSelection((c) => {
		onSelect(c)
		quickPick.hide()
	})

	quickPick.onDidHide(() => { quickPick.dispose() })

	quickPick.show()
}

async function getAllFilesAndFoldersRecursively (folderPath: string | undefined, files: string[], folders: string[]): Promise<{ files: string[], folders: string[] } | undefined> {
	if (folderPath !== undefined) {
		const entries = fs.readdirSync(folderPath)
		const filteredEntries = entries.filter((v) => !excludedFiles.includes(v))

		filteredEntries.forEach((entry) => {
			const fullPath = `${folderPath}/${entry}`
			const stats = fs.statSync(fullPath)
			const relativePath = vscode.workspace.asRelativePath(fullPath)

			if (stats.isDirectory()) {
				folders.push(relativePath)
				void getAllFilesAndFoldersRecursively(fullPath, files, folders)
			} else {
				files.push(entry)
			}
		})
		return { files, folders }
	} else {
		await vscode.window.showErrorMessage("No workspace folder is open.")
	}
}



function createFile(filePath: string) {
	const isDirectory = filePath.endsWith("/")
	const currentFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath // Get the current workspace folder path
	const isNested = /(?!^)\/(?!$)/.test(filePath)


	if(currentFolder){
		const directoryPath = pathlib.dirname(filePath)
		const currentDirectoryPath =pathlib.join(currentFolder,directoryPath) 
		const currentFilePath = pathlib.join(currentFolder,filePath )
		
		if(isNested) { 
			// nested directory 
			// /pages/auth/
			if (isDirectory) {
				const currentDirectoryPath =pathlib.join(currentFolder,filePath) 
				if(!fs.existsSync(directoryPath)) { 
					fs.mkdirSync(currentDirectoryPath, { recursive: true })
					console.log(`'${filePath}' created successfully!`)
				}else {
					console.log(`'${filePath}' already exists`)
				}
			} else {
			// nested file 
			// /pages/auth/index.js
				if(!fs.existsSync(directoryPath)) { 
					fs.mkdirSync(currentDirectoryPath, { recursive: true })
					fs.writeFileSync(currentFilePath, "")
					try {
						vscode.workspace.openTextDocument(currentFilePath)
							.then((doc) => {
								vscode.window.showTextDocument(doc)
							})
							.then( ()=> {
								console.log(`File '${filePath}' created successfully!`)
							})
					} catch (error) {
						console.log("========  error:", error)
					}
				}else {
					console.log(`'${filePath}' already exists`)
				}
			} 
		}
		else if (isDirectory) {

			// root directory 
			// /pages/
			const currentDirectoryPath =pathlib.join(currentFolder,filePath) 
			if(!fs.existsSync(filePath)) { 
				console.log("========  filePath:", filePath)
				fs.mkdirSync(currentDirectoryPath, { recursive: true })
				console.log(`'${filePath}' created successfully!`)
			}else {
				console.log(`'${filePath}' already exists`)
			}
		}
		else { 
			// root file 
			// /index.ts
			console.log("========  currentFilePath:", currentFilePath)
			try {
				fs.writeFileSync(currentFilePath, "")
				vscode.workspace.openTextDocument(currentFilePath)
					.then((doc) => {
						vscode.window.showTextDocument(doc)
					})
					.then( ()=> {
						console.log(`File '${filePath}' created successfully!`)
					})
			} catch (error) {
				console.log("========  error:", error)
			}
		}
	}
}

export function activate (context: vscode.ExtensionContext): void {
	const disposable = vscode.commands.registerCommand("file-template-manager.helloWorld", async () => {
		const currentFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath // Get the current workspace folder path

		const files: string[] = []
		const folders: string[] = []
		const data = await getAllFilesAndFoldersRecursively(currentFolder, files, folders)

		const a = data?.folders.map((v) => {
			return {
				label: `/${ v }`
			}
		})

		a?.unshift({ label: "/"  })

		if (a != null) {
			showQuickPick(a, selection => {
				const inputPrompt = {
					prompt: "Enter the file name",
					placeHolder: "newfile.txt"
				}
				vscode.window.showInputBox(inputPrompt)
					.then((inputVal) => {
						if(inputVal)
							createFile(pathlib.join( selection[0].label ,  inputVal ))
					})
			})
		}
	})

	context.subscriptions.push(disposable)
}

// This method is called when your extension is deactivated
// export function deactivate () { }
