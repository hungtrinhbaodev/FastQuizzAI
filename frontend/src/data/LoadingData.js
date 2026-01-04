import AppConst from "../services/AppConst";

class LoadingData {

    constructor(loadingUsage = AppConst.LOADING_USAGE.NONE, loadingMessage = "") {
        this._loadingUsage = loadingUsage;
        this._loadingMessage = loadingMessage;
    }

    getLoadingUsage() {
        return this._loadingUsage;
    }

    getLoadingMessage() {
        return this._loadingMessage;
    }

    setLoadingUsage(loadingUsage) {
        this._loadingUsage = loadingUsage;
    }

    setLoadingMessage(loadingMessage) {
        this._loadingMessage = loadingMessage;
    }

    static makeLoading(message = "Loading...") {
        return new LoadingData(AppConst.LOADING_USAGE.LOADING, message);
    }

    static makeNone(lastData = null) {
        return new LoadingData(AppConst.LOADING_USAGE.NONE, lastData ? lastData.getLoadingMessage() : "");
    }

}

export default LoadingData;