async function setColorTheme() {
    const theme = await window.api.getcolortheme();
    const color = document.createElement('link');
    color.rel = "stylesheet"
    color.href = theme;
    document.head.appendChild(color)
    document.documentElement.style.visibility = 'visible';
}
setColorTheme()
