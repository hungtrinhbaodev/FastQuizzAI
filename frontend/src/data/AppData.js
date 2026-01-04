import AppConst from "../services/AppConst";

class AppData {

    constructor() {

        this._appState = AppConst.APP_STATE.NO_LOGIN;
        
    }

    setAppState(appState) {
        this._appState = appState;
    }

    getAppState() {
        return this._appState;
    }

}

export default AppData;