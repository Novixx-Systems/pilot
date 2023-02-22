"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
// NovixxPilot is a VSCode extension that is a worse version of Co Pilot, but it's free and not AI.
const vscode = require("vscode");
/* eslint-disable no-mixed-spaces-and-tabs */
function activate(context) {
    const provider1 = vscode.languages.registerCompletionItemProvider('javascript', {
        provideCompletionItems(document, position) {
            // get all text until the `position` and check if it reads `//`
            // then it is a comment line and we want to read the comment
            const linePrefix = document.lineAt(position).text.substr(0, position.character);
            if (!linePrefix.startsWith('//')) {
                return undefined;
            }
            // Read the comment
            let comment = linePrefix.substr(linePrefix.lastIndexOf('//') + 2).trim();
            if (comment.toLowerCase() === 'log' || comment.toLowerCase() === 'print') {
                return [
                    new vscode.CompletionItem('\nconsole.log', vscode.CompletionItemKind.Method),
                ];
            }
            else if (comment.toLowerCase() === 'stolen from ') { // This is a joke
                return [
                    new vscode.CompletionItem('StackOverflow', vscode.CompletionItemKind.Method),
                ];
            }
            else if (comment.toLowerCase().startsWith('log ') || comment.toLowerCase().startsWith('print ')) {
                if (comment.substring(comment.toLowerCase().startsWith('log ') ? 4 : 6) === "\"") {
                    // Remove the " from the end of the string
                    comment = comment.substring(0, comment.length - 1);
                    // Remove the " from the start of the string
                    comment = comment.substring(comment.indexOf("\"") + 1);
                }
                return [
                    new vscode.CompletionItem('\nconsole.log("' + comment.substring(comment.toLowerCase().startsWith('log ') ? 4 : 6), vscode.CompletionItemKind.Method),
                ];
            }
            else if (comment.toLowerCase().startsWith("if ")) {
                let variable1;
                let variable2;
                let type;
                if (comment.includes("==")) {
                    type = "equal";
                    variable1 = comment.substring(3, comment.indexOf("==") - 1);
                    variable2 = comment.substring(comment.indexOf("==") + 3);
                }
                else if (comment.includes(" is the same as ")) {
                    type = "equal";
                    variable1 = comment.substring(3, comment.indexOf(" is the same as ") - 1);
                    variable2 = comment.substring(comment.indexOf(" is the same as ") + 17);
                }
                else if (comment.includes(" is equal to ")) {
                    type = "equal";
                    variable1 = comment.substring(3, comment.indexOf(" is equal to ") - 1);
                    variable2 = comment.substring(comment.indexOf(" is equal to ") + 14);
                }
                else if (comment.includes(" is ")) {
                    type = "equal";
                    variable1 = comment.substring(3, comment.indexOf(" is ") - 1);
                    variable2 = comment.substring(comment.indexOf(" is ") + 4);
                }
                else if (comment.includes(" != ")) {
                    type = "not equal";
                    variable1 = comment.substring(3, comment.indexOf(" != ") - 1);
                    variable2 = comment.substring(comment.indexOf(" != ") + 4);
                }
                else if (comment.includes(" is not the same as ")) {
                    type = "not equal";
                    variable1 = comment.substring(3, comment.indexOf(" is not the same as ") - 1);
                    variable2 = comment.substring(comment.indexOf(" is not the same as ") + 21);
                }
                else if (comment.includes(" is not ")) {
                    type = "not equal";
                    variable1 = comment.substring(3, comment.indexOf(" is not ") - 1);
                    variable2 = comment.substring(comment.indexOf(" is not ") + 8);
                }
                if (variable1?.includes(" length of ")) {
                    variable1 = variable1.substring(variable1.indexOf(" length of ") + 11) + ".length";
                }
                if (!comment.includes(" then")) {
                    return [
                        new vscode.CompletionItem('\nif (' + variable1 + (type === "equal" ? " === " : " !== ") + variable2 + ')', vscode.CompletionItemKind.Method),
                    ];
                }
                else {
                    let then;
                    then = comment.substring(comment.indexOf(" then") + 6);
                    if (variable2 != undefined)
                        variable2 = variable2.substring(0, variable2.indexOf(" then"));
                    if (then.startsWith("print ")) {
                        then = then.substring(6);
                    }
                    else if (then.startsWith("log ")) {
                        then = then.substring(4);
                    }
                    return [
                        new vscode.CompletionItem('\nif (' + variable1 + (type === "equal" ? " === " : " !== ") + variable2 + ') {\n\tconsole.log(' + then + ');\n}', vscode.CompletionItemKind.Method),
                    ];
                }
            }
        }
    }, ' ' // triggered whenever a ' ' is being typed
    );
    context.subscriptions.push(provider1);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map