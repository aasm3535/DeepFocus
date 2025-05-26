document.addEventListener('DOMContentLoaded', () => {
    const introScreen = document.getElementById('intro-screen');
    const timerScreen = document.getElementById('timer-screen');
    const nextButton = document.getElementById('next-button');
    const startButton = document.getElementById('start-button');
    const timerDisplay = document.getElementById('timer');

    // New elements for settings screen
    const settingsScreen = document.getElementById('settings-screen');
    const settingsButton = document.getElementById('settings-button');
    const saveButton = document.getElementById('save-button');
    const workTimeOptions = document.getElementById('work-time-options');
    const shortBreakTimeOptions = document.getElementById('short-break-time-options');

    console.log('nextButton element:', nextButton);

    let timerInterval;
    
    // Pomodoro Timers (in seconds)
    let workTime = 25 * 60;
    let shortBreakTime = 5 * 60;
    let longBreakTime = 15 * 60;
    const totalWorkCyclesForLongBreak = 4;

    let timeLeft = workTime;
    let currentPhase = 'work';
    let workCyclesCompleted = 0;

    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        timerDisplay.textContent = formattedTime;
    }

    function updateButtonText() {
        switch (currentPhase) {
            case 'work':
                startButton.textContent = timerInterval ? 'Stop Work' : 'Start Work';
                break;
            case 'shortBreak':
            case 'longBreak':
                startButton.textContent = timerInterval ? 'Stop Break' : 'Start Break';
                break;
        }
    }

    function nextPhase() {
        if (currentPhase === 'work') {
            workCyclesCompleted++;
            if (workCyclesCompleted >= totalWorkCyclesForLongBreak) {
                currentPhase = 'longBreak';
                timeLeft = longBreakTime;
                workCyclesCompleted = 0;
            } else {
                currentPhase = 'shortBreak';
                timeLeft = shortBreakTime;
            }
        } else {
            currentPhase = 'work';
            timeLeft = workTime;
        }
        updateTimerDisplay();
        updateButtonText();
    }

    function toggleTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
            startButton.classList.remove('orange-button');
            timerDisplay.classList.remove('timer-active');
        } else {
            startButton.classList.add('orange-button');
            timerDisplay.classList.add('timer-active');
            timerInterval = setInterval(() => {
                timeLeft--;
                updateTimerDisplay();

                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    timerInterval = null;
                    startButton.classList.remove('orange-button');
                    timerDisplay.classList.remove('timer-active');
                    timerCompleteSound.play();
                    nextPhase();
                    phaseChangeSound.play();
                    console.log(`${currentPhase} finished!`);
                }
            }, 1000);
        }
        updateButtonText();
    }

    function selectTime(optionsContainer, selectedTime) {
        const buttons = optionsContainer.querySelectorAll('button');
        buttons.forEach(button => {
            button.classList.remove('selected');
            if (parseInt(button.dataset.time) === selectedTime / 60) {
                button.classList.add('selected');
            }
        });
    }

    function loadSettingsIntoButtons() {
        selectTime(workTimeOptions, workTime);
        selectTime(shortBreakTimeOptions, shortBreakTime);
    }

    // Event listeners for time option buttons
    workTimeOptions.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            workTime = parseInt(event.target.dataset.time) * 60;
            selectTime(workTimeOptions, workTime);
        }
    });

    shortBreakTimeOptions.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            shortBreakTime = parseInt(event.target.dataset.time) * 60;
            selectTime(shortBreakTimeOptions, shortBreakTime);
        }
    });

    // Event listener for the Next button
    nextButton.addEventListener('click', () => {
        console.log('Next button clicked');
        introScreen.classList.add('hidden');
        
        setTimeout(() => {
            introScreen.style.display = 'none';
            timerScreen.style.display = 'flex';
            requestAnimationFrame(() => {
                timerScreen.classList.add('visible');
            });
        }, 1000);
    });

    // Event listener for the Start/Stop button
    startButton.addEventListener('click', toggleTimer);

    // Event listener for Settings button
    settingsButton.addEventListener('click', () => {
        if (timerInterval) {
            toggleTimer();
        }
        timerScreen.classList.add('hidden');
        setTimeout(() => {
            timerScreen.style.display = 'none';
            settingsScreen.style.display = 'flex';
            loadSettingsIntoButtons();
            requestAnimationFrame(() => {
                settingsScreen.classList.add('visible');
            });
        }, 1000);
    });

    // Event listener for Save button in settings
    saveButton.addEventListener('click', () => {
        settingsScreen.classList.add('hidden');
        setTimeout(() => {
            settingsScreen.style.display = 'none';
            timerScreen.style.display = 'flex';
            if (currentPhase === 'work') timeLeft = workTime;
            else if (currentPhase === 'shortBreak') timeLeft = shortBreakTime;
            else timeLeft = longBreakTime;
            updateTimerDisplay();
            updateButtonText();
            requestAnimationFrame(() => {
                timerScreen.classList.add('visible');
            });
        }, 1000);
    });

    // Add audio elements
    const timerCompleteSound = document.getElementById('timer-complete-sound');
    const phaseChangeSound = document.getElementById('phase-change-sound');

    // Add keyboard shortcuts
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            event.preventDefault();
            if (timerScreen.classList.contains('visible')) {
                toggleTimer();
            }
        }
        if (event.code === 'KeyS') {
            event.preventDefault();
            if (timerScreen.classList.contains('visible')) {
                settingsButton.click();
            }
        }
        if (event.code === 'Escape') {
            event.preventDefault();
            if (settingsScreen.classList.contains('visible')) {
                saveButton.click();
            }
        }
    });

    // Initial setup
    updateTimerDisplay();
    updateButtonText();
    settingsScreen.addEventListener('transitionend', () => {
        if(settingsScreen.classList.contains('visible')){
            loadSettingsIntoButtons();
        }
    });
}); 
