const AppConst = {

    TYPE_SEND: {

        GET: 0,

        POST: 1,

        PUT: 2,

        DELETE: 3,
    },

    // The base URL for the backend server, for accessing static files like images
    SERVER_BASE_URL: "http://127.0.0.1:8000",

    // The full URL for the API endpoints
    SERVER_API_URL: "http://127.0.0.1:8000/api",

    ROUTER: {

        LOGIN: "/login-api",

        CREATE_ACCOUNT: "/create-account-api",

        GET_DOCUMENTS: "/get-documents-api",

        ADD_DOCUMENT: "/add-document-api",

        REMOVE_DOCUMENT: "/remove-document-api"

    },

    APP_STATE: {

        NO_LOGIN: 0, 

        IDLE: 1,

        EXEMING: 2

    },

    DIALOG_USAGE: {

        NONE: -1,

        CREATE_ACCOUNT: 0,

        CREATE_EXAM: 1,

        ADD_DOCUMENT: 2,

        VIEW_DOCUMENT: 3,

        CONFIRM_NOTIFY: 4,

    },

    LOADING_USAGE: {

        NONE: -1,
        
        LOADING: 0

    },

    CREATE_ACCOUNT_STEP: {
        
        INPUT_NAME: 1,

        INPUT_AVATAR: 2,

    },

    TABLE_CONTENT_TYPE: {

        TEXT: 0,

        ICON: 1

    },

    TABLE_ICON_TYPE: {
        
        WATCH: 0,

        MAKE_EXAM: 1,

        ADD: 2,

        DELETE: 3

    },

    DEV_MODE: true,

    DOCUMENT_TAG: {

        LAW: 0,

        ENGLISH: 1,

        OTHER: 2
    },

    SUBSCRIBE_TYPE: {
        
        RELOAD_USER_DATA: 0,

        RELOAD_USER_DOCUMMENTS: 1

    }

}

export default AppConst;