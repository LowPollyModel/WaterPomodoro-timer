import * as vscode from 'vscode';

let statusBarItem: vscode.StatusBarItem;
let pomodoroCount = 0;
let waterCount = 0;
let timerInterval: NodeJS.Timeout | undefined;
let remainingSeconds = 0;
let currentTask = '';
let isRunning = false;

export function activate(context: vscode.ExtensionContext) {
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    context.subscriptions.push(statusBarItem);
    const startCommand = vscode.commands.registerCommand('pomodoro.start_pomodoro', async () => {
        if (isRunning) {
            const answer = await vscode.window.showWarningMessage(
                `Остановить текущий спринт ("${currentTask}")?`,
                'Да, остановить',
                'Продолжить'
            );
            if (answer === 'Да, остановить') {
                stopTimer();
                vscode.window.showInformationMessage('Спринт прерван');
            }
            return;
        }

        const task = await vscode.window.showInputBox({
            prompt: 'Над какой задачей будешь работать в этот спринт?',
            placeHolder: 'Например: Написать функцию авторизации'
        });
        if (task === undefined) {
            return;
        }
        currentTask = task.trim() !== '' ? task : 'Фокус-работа';
        const config = vscode.workspace.getConfiguration('pomodoro');
        const durationMinutes = config.get<number>('pomodoro_duration') || 25;
        remainingSeconds = durationMinutes * 60;
        isRunning = true;
        updateStatusBar();
        timerInterval = setInterval(() => {
            remainingSeconds--;
            
            if (remainingSeconds <= 0) {
                completePomodoro();
            } else {
                updateStatusBar();
            }
        }, 1000);
    });

    const waterCommand = vscode.commands.registerCommand('pomodoro.add_water', () => {
        waterCount++;
        vscode.window.showInformationMessage('Водный баланс пополнен 💧');
        updateStatusBar();
    });
    context.subscriptions.push(startCommand, waterCommand);

    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('pomodoro')) {
                updateStatusBar();
            }
        })
    );
    statusBarItem.command = 'pomodoro.start_pomodoro';
    updateStatusBar();
    statusBarItem.show();
}

async function completePomodoro() {
    stopTimer();
    pomodoroCount++;
    updateStatusBar();

    const action = await vscode.window.showInformationMessage(
        `🍅 Спринт по задаче "${currentTask}" завершен! Время размяться и выпить воды.`,
        '💧 Выпил воду',
        'Пропустить'
    );
    if (action === '💧 Выпил воду') {
        waterCount++;
        updateStatusBar();
        vscode.window.showInformationMessage('Отлично! +1 к водному балансу 💧');
    }
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = undefined;
    }
    isRunning = false;
    currentTask = '';
    updateStatusBar();
}
function formatTime(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const minStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const secStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minStr}:${secStr}`;
}

function updateStatusBar() {
    const config = vscode.workspace.getConfiguration('pomodoro');
    const pomodoroGoal = config.get<number>('daily_pomodoro_goal') || 8;
    const waterGoal = config.get<number>('daily_water_goal') || 5;

    if (isRunning) {
        const timeStr = formatTime(remainingSeconds);
        statusBarItem.text = `$(debug-stop) [${currentTask}] ${timeStr} | 🍅 ${pomodoroCount}/${pomodoroGoal} | 💧 ${waterCount}/${waterGoal}`;
        statusBarItem.tooltip = 'Нажми, чтобы прервать спринт';
    } else {
        statusBarItem.text = `$(play) Pomodoro | 🍅 ${pomodoroCount}/${pomodoroGoal} | 💧 ${waterCount}/${waterGoal}`;
        statusBarItem.tooltip = 'Нажми, чтобы запустить таймер Помодоро';
    }
}
export function deactivate() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
}