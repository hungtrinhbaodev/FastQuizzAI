import AppData from "../data/AppData";
import DocumentData from "../data/DocumentData";
import UserData from "../data/UserData";
import AppConst from "./AppConst";


class AppService {

    constructor() {
        this._userData = new UserData();
        this._appData = new AppData();
        this._docsData = null;
        this._listeners = [];
    }

    /**
     * @returns {AppData}
     */
    getAppData() {
        return this._appData;
    }

    /**
     * @returns {UserData}
     */
    getUserData() {
        return this._userData;
    }

    getUserDocs() {
        return this._docsData;
    }

    subscribe(listener) {
        this._listeners.push(listener);
    }

    unsubscribe(listener) {
        this._listeners = this._listeners.filter(l => l !== listener);
    }

    _notify(subscribeType) {
        this._listeners.forEach(listener => listener(subscribeType));
    }

    hasUser() {
        return this._appData.getAppState() !== AppConst.APP_STATE.NO_LOGIN && this._userData.getUserName() !== "";
    }

    /**
     * @param {*} router 
     * @param {*} typeSend 
     * @param {*} body 
     * @returns 
     */
    async _send(
        router = "",
        typeSend = AppConst.TYPE_SEND.GET,
        body = null
    ) {
        const isFormData = body instanceof FormData;

        const methodMap = {
            [AppConst.TYPE_SEND.GET]: 'GET',
            [AppConst.TYPE_SEND.POST]: 'POST',
            [AppConst.TYPE_SEND.PUT]: 'PUT',
            [AppConst.TYPE_SEND.DELETE]: 'DELETE'
        };

        const requestOptions = {
            method: methodMap[typeSend] || 'GET',
            headers: {} // Let the browser set Content-Type for FormData
        };

        if (!isFormData) {
            requestOptions.headers['Content-Type'] = 'application/json';
        }

        if (body) {
            if (isFormData) {
                requestOptions.body = body;
            } else if (requestOptions.method !== 'GET') {
                requestOptions.body = JSON.stringify(body);
            }
        }

        const response = await fetch(AppConst.SERVER_API_URL + router, requestOptions);
        
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const text = await response.text();
        try {
            return JSON.parse(text);
        } catch (e) {
            console.error("Server returned invalid JSON. Response body:", text);
            throw new Error("The server returned HTML instead of JSON. Check your API URL.");
        }
    }

    /**
     * @param {function()} excute 
     */
    async login(excute = () => {}) {
        const result = await this._send(
            AppConst.ROUTER.LOGIN,
            AppConst.TYPE_SEND.GET
        );

        if (!result) {
            // TODO: add dialog notify get fail
            return;
        }
        
        // Update data login is send
        const appData = result["app_data"];
        this._appData.setAppState(appData["app_state"]);

        switch (this._appData.getAppState()) {
            case AppConst.APP_STATE.NO_LOGIN: {
                break;
            }
            default: {
                const userData = result["current_user"];
                this._userData.setUserId(userData["id"]);
                this._userData.setUserName(userData["name"]);
                this._userData.setUserAvatar(userData["avatar"]);
                break;
            }
        }

        this._notify(AppConst.SUBSCRIBE_TYPE.RELOAD_USER_DATA);

        // Call excute login callback in App
        if (typeof excute === "function") {
            excute(this, result);
        }
    }

    async createAccount(userName, avatarFile, onSuccess = () => {}) {
        const formData = new FormData();
        formData.append('userName', userName);
        formData.append('avatar', avatarFile);

        try {
            const result = await this._send(
                AppConst.ROUTER.CREATE_ACCOUNT,
                AppConst.TYPE_SEND.POST,
                formData
            );

            // The backend returns the full app_data object on success
            this._appData.setAppState(result["app_state"]);
            const userData = result["current_user"];
            this._userData.setUserId(userData["id"]);
            this._userData.setUserName(userData["name"]);
            this._userData.setUserAvatar(userData["avatar"]);

            this._notify(AppConst.SUBSCRIBE_TYPE.RELOAD_USER_DATA);

            onSuccess();
        } catch (error) {
            console.error("Account creation failed:", error);
            // TODO: Show an error dialog to the user
        }
    }

    readDocDataFrom(dataResult) {
        return new DocumentData(
            dataResult['id'],
            dataResult['name'],
            dataResult['created_time'],
            dataResult['url'],
            dataResult['tag']
        );
    }

    async addDoc(docName, docTag, docFile) {
        const formData = new FormData();
        formData.append('user_id', this._userData.getUserId());
        formData.append('doc_name', docName);
        formData.append('doc_tag', docTag);
        formData.append('document', docFile);

        try {
            const result = await this._send(
                AppConst.ROUTER.ADD_DOCUMENT,
                AppConst.TYPE_SEND.POST,
                formData
            );

            const resultData = result['doc_data'];
            const docData = this.readDocDataFrom(resultData);

            if (!this._docsData) {
                this._docsData = [];
            }

            this._docsData.push(docData);

            this._notify(AppConst.SUBSCRIBE_TYPE.RELOAD_USER_DOCUMMENTS);

        } catch(error) {
            console.error("Add document fail", error);
        }

    }

    async requestUserDocs() {
        if (this._docsData === null) {

            const formData = new FormData();
            formData.append('user_id', this._userData.getUserId());

            try {
                
                const result = await this._send(
                    AppConst.ROUTER.GET_DOCUMENTS,
                    AppConst.TYPE_SEND.POST,
                    formData
                );

                this._docsData = [];
                const resultDocsData = result['docs_data'];
                for (const resultDocData of resultDocsData) {
                    const docData = this.readDocDataFrom(resultDocData);
                    this._docsData.push(docData);
                }

                return this._docsData;

            } catch (e) {
                console.error("Get user docs fail", e);
            }
        }
        return this._docsData;
    }

    async removeDoc(docId, excute) {

        const formData = new FormData();
        formData.append('user_id', this._userData.getUserId());
        formData.append('doc_id', docId);

        try {

            const result = await this._send(
                AppConst.ROUTER.REMOVE_DOCUMENT,
                AppConst.TYPE_SEND.POST,
                formData
            );

            this._docsData = this._docsData.filter(doc => doc.id !== docId);
            this._notify(AppConst.SUBSCRIBE_TYPE.RELOAD_USER_DOCUMMENTS);

            if (typeof excute == 'function') {
                excute(result);
            }

        } catch (e) {
            console.error("Remove doc fail", e);
        }
    } 
}

const appService = new AppService();
export default appService;
