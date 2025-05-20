# DeepFocus

A lightweight Pomodoro-style timer application built in C using the Windows API. DeepFocus helps users manage work and rest cycles by allowing custom focus and rest durations.

---

## Features

* **Customizable Timers:** Set your preferred durations for both focus and rest periods.
* **Time String Parsing:** Input times in a flexible format (e.g., "1h 30m" or "3600s") or simply in seconds.
* **Windows Notifications:** Get alerted when a focus or rest session is complete via a native Windows message box.
* **Session Management:**
    * Extend focus time by 15 minutes when prompted.
    * Option to continue with another work/rest cycle or exit the application after a rest period.
* **Minimalist Design:** A console-based application focused on core functionality.

---

## How to Compile and Run

### Prerequisites

* A C compiler (e.g., MinGW for Windows)

### Compilation

1.  Save the provided code as `deepfocus.c`.
2.  Open your command prompt or terminal.
3.  Navigate to the directory where you saved the file.
4.  Compile the code using a C compiler (like `gcc` from MinGW):

    ```bash
    gcc deepfocus.c -o deepfocus.exe -luser32 -lgdi32
    ```

    * `-o deepfocus.exe`: Specifies the output executable file name.
    * `-luser32 -lgdi32`: Links the necessary Windows API libraries for `MessageBox` and other UI functions.

### Running the Application

1.  After successful compilation, run the executable:

    ```bash
    ./deepfocus.exe
    ```

2.  Follow the on-screen prompts to input your desired focus and rest times.

---

## Usage

1.  **Input Focus Time:** When prompted, enter the duration for your work/focus session. You can use formats like "1h 30m 15s", "90m", or simply "5415" (for seconds).
2.  **Input Rest Time:** Similarly, enter the duration for your rest session.
3.  **Focus Session:** The timer will start counting down. Once the focus time is complete, a Windows message box will appear.
    * If you choose "Yes", the focus timer will restart.
    * If you choose "No", 15 minutes will be added to your current focus time, and the timer will restart with the new duration.
4.  **Rest Session:** After the focus session (or if you ended it), the rest timer will begin.
    * Once rest is complete, another message box will appear.
    * If you choose "Yes", a new work/rest cycle will begin.
    * If you choose "No", the application will close.

---

## Code Structure

* **`_df` struct:** Holds the focus and rest durations.
* **`_t_to_sec(const char* s)`:** Converts a time string (e.g., "1h 30m") into total seconds.
* **`_fmt_t(int sec, char* buf, size_t sz)`:** Formats a given number of seconds back into a human-readable "Xh Ym Zs" string.
* **`_msg_box(const char* msg, int is_focus)`:** Displays a Windows message box for notifications and handles user interaction based on whether it's a focus or rest prompt.
* **`main()`:** The main program loop that handles user input, timer logic, and calls to the notification function.
