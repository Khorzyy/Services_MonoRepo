let timeout;

export function startIdleTimer(logoutCallback, delay = 30 * 60 * 1000) {
    const resetTimer = () => {
        clearTimeout(timeout);
        timeout = setTimeout(logoutCallback, delay);
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);
    window.addEventListener("scroll", resetTimer);

    resetTimer();
}

export function stopIdleTimer() {
    clearTimeout(timeout);
}