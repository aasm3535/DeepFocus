#include <stdio.h>
#include <windows.h>
#include <time.h>
#include <string.h>

struct _df {
    int _t_focus;
    int _t_rest;
};

int _t_to_sec(const char* s) {
    int h = 0, m = 0, sec = 0;
    int val;

    while (*s) {
        if (sscanf(s, "%d", &val) != 1) break;
        s += strspn(s, "0123456789");
        s += strspn(s, " ");

        if (*s == 'h' || *s == 'H') {
            h = val;
            s++;
        } else if (*s == 'm' || *s == 'M') {
            m = val;
            s++;
        } else if (*s == 's' || *s == 'S') {
            sec = val;
            s++;
        }
        s += strspn(s, " ");
    }
    return h * 3600 + m * 60 + sec;
}

void _fmt_t(int sec, char* buf, size_t sz) {
    int h = sec / 3600;
    sec %= 3600;
    int m = sec / 60;
    sec %= 60;
    snprintf(buf, sz, "%dh %dm %ds", h, m, sec);
}

int _msg_box(const char* msg, int is_focus) {
    int res = MessageBox(NULL, TEXT(msg), TEXT("DeepFocus"), MB_YESNO | MB_ICONQUESTION);
    if (is_focus) {
        if (res == IDYES) {
            return 1;
        } else {
            return 2;
        }
    } else {
        if (res == IDYES) {
            return 1;
        } else {
            return 0;
        }
    }
}

int main() {
    struct _df _s;
    char in[50];
    char t_str[20];

    printf("Work time (e.g., 4h 13m 23s or seconds): ");
    fgets(in, sizeof(in), stdin);
    in[strcspn(in, "\n")] = 0;
    if (strpbrk(in, "hmsHMS")) {
        _s._t_focus = _t_to_sec(in);
    } else {
        _s._t_focus = atoi(in);
    }

    printf("Rest time (e.g., 4h 13m 23s or seconds): ");
    fgets(in, sizeof(in), stdin);
    in[strcspn(in, "\n")] = 0;
    if (strpbrk(in, "hmsHMS")) {
        _s._t_rest = _t_to_sec(in);
    } else {
        _s._t_rest = atoi(in);
    }

    while (1) {
        printf("Focus for %d sec...\n", _s._t_focus);
        time_t start = time(NULL);
        while (difftime(time(NULL), start) < _s._t_focus) {
            Sleep(1000);
        }

        _fmt_t(_s._t_focus, t_str, sizeof(t_str));
        char msg[100];
        snprintf(msg, sizeof(msg), "Focus done (%s)! Keep working?", t_str);
        int focus_choice = _msg_box(msg, 1);
        if (focus_choice == 1) {
            continue;
        } else if (focus_choice == 2) {
            _s._t_focus += 900;
            printf("Added 15 min. New focus time: %d sec\n", _s._t_focus);
            continue;
        }

        printf("Rest for %d sec...\n", _s._t_rest);
        start = time(NULL);
        while (difftime(time(NULL), start) < _s._t_rest) {
            Sleep(1000);
        }

        _fmt_t(_s._t_rest, t_str, sizeof(t_str));
        snprintf(msg, sizeof(msg), "Rest done (%s)! New cycle?", t_str);
        int rest_choice = _msg_box(msg, 0);
        if (rest_choice == 0) {
            break;
        }
    }

    printf("DeepFocus ended.\n");
    return 0;
}
