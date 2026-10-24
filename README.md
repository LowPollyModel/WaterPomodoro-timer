# Pomodoro & Water Tracker
>The project helps the developer work more efficiently by maintaining focus with a Pomodoro timer and tracking daily water balance directly in VS Code.

## extension.ts:
>The file contains commands and logic that perform calculations and UI updates related to the timer and status bar.
### Command's description:
- **pomodoro.start_pomodoro()** command takes the user's task input, starts the countdown timer, and returns UI updates in the Status Bar.
<br>
> **Execution example**:
<br>
>> input: "Fix login bug"
<br>
output: Status bar changes to `$(debug-stop) [Fix login bug] 24:59 | 🍅 0/8 | 💧 0/5`
<br>
<br>
>> input: Timer reaches 00:00
<br>
output: Notification `🍅 Спринт по задаче "Fix login bug" завершен! Время размяться и выпить воды.`
<br>
<br>
>> input: User clicks while timer is running
<br>
output: Notification `Остановить текущий спринт ("Fix login bug")?`
<br>

- **pomodoro.add_water()** command takes a trigger (click or command palette) and returns an incremented water counter.
<br>
> **Execution example**:
<br>
>> input: Trigger command
<br>
output: Status bar changes to `💧 1/5` and shows `Молодец! Водный баланс пополнен 💧`
<br>

## package.json:
>The file contains the configuration settings that allow the user to customize the tracker's behavior.
### Configuration's description:
- **pomodoro.pomodoro_duration** setting takes a number (minutes) and returns the configured duration for the next sprint.
<br>
> **Execution example**:
<br>
>> input: 25
<br>
output: Timer duration set to 25 minutes
<br>
<br>
>> input: 0.1
<br>
output: Timer duration set to 6 seconds (for testing)
<br>

- **pomodoro.daily_water_goal** setting takes a number and returns the maximum value for the water progress indicator.
<br>
> **Execution example**:
<br>
>> input: 5
<br>
output: Status bar displays `💧 0/5`
<br>
<br>
>> input: 10
<br>
output: Status bar displays `💧 0/10`


