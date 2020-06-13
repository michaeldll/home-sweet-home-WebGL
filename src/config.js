const config = {
    allowDesktop: true,
    orCam: eval(localStorage.getItem("camType") || true),
    testScene: false,
    devMode: true,
    devModeScene: 5,
    devModeSkipIntro: true,
    devModeLocalSocketServer: false,
    devModeShowGUI: false
}


export default config