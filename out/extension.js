"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
// NovixxPilot is a VSCode extension that is a worse (and probably less efficient) version of Co Pilot, but it's free and not AI.
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
            else if (comment.toLowerCase() === 'stolen from') { // This is a joke
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
                const equals = ["==", " is the same as ", " is equal to ", " is "];
                const notEquals = ["!=", " is not the same as ", " is not equal to ", " is not "];
                // Check if the comment contains any of the equals or not equals strings/symbols
                for (let i = 0; i < equals.length; i++) {
                    if (comment.includes(equals[i])) {
                        variable1 = comment.substring(comment.indexOf("if ") + 3, comment.indexOf(equals[i]));
                        variable2 = comment.substring(comment.indexOf(equals[i]) + equals[i].length);
                        type = "equal";
                        break;
                    }
                }
                for (let i = 0; i < notEquals.length; i++) {
                    if (comment.includes(notEquals[i])) {
                        variable1 = comment.substring(comment.indexOf("if ") + 3, comment.indexOf(notEquals[i]));
                        variable2 = comment.substring(comment.indexOf(notEquals[i]) + notEquals[i].length);
                        type = "not equal";
                        break;
                    }
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
            // variable generation
            else if (comment.toLowerCase().startsWith("variable:") || comment.toLowerCase().startsWith("var:")) {
                let variable;
                if (comment.toLowerCase().startsWith("variable:")) {
                    variable = comment.substring(9);
                }
                else {
                    variable = comment.substring(4);
                }
                return [
                    new vscode.CompletionItem('\nlet ' + variable + ';', vscode.CompletionItemKind.Method),
                ];
            }
        }
    }, ' ' // triggered whenever a ' ' is being typed
    );
    context.subscriptions.push(provider1);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map