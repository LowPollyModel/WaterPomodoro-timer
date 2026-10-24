import * as vscode from 'vscode';

let statusBarItem: vscode.StatusBarItem;
let pomodoroCount = 0;
let waterCount = 0;

export function activate(context: vscode.ExtensionContext) {
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    context.subscriptions.push(statusBarItem);
    let startCommand = vscode.commands.registerCommand('pomodoro.start_pomodoro', () => {
        pomodoroCount++;
        updateStatusBar();
    });

    let waterCommand = vscode.commands.registerCommand('pomodoro.add_water', () => {
        waterCount++;
        vscode.window.showInformationMessage('Водный баланс пополнен 💧');
        updateStatusBar();
    });
    context.subscriptions.push(startCommand, waterCommand);
    statusBarItem.command = 'pomodoro.start_pomodoro';
    updateStatusBar();
    statusBarItem.show();
}

function updateStatusBar() {
    const config = vscode.workspace.getConfiguration('pomodoro');
    const pomodoroGoal = config.get<number>('daily_pomodoro_goal') || 8;
    const waterGoal = config.get<number>('daily_water_goal') || 5;
    statusBarItem.text = `$(play) Pomodoro | 🍅 ${pomodoroCount}/${pomodoroGoal} | 💧 ${waterCount}/${waterGoal}`;
}
export function deactivate() {}