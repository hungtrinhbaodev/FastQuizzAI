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

        TEST: -2,

        NONE: -1,

        CREATE_ACCOUNT: 0,

        CREATE_EXAM: 1,

        ADD_DOCUMENT: 2,

        VIEW_DOCUMENT: 3,

        CONFIRM_NOTIFY: 4,

        ADD_EXAM: 5,

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

    },

    SLIDER_STATE: {

        IDLE: 0,

        SLIDING: 1,

        MOVE_BACK: 2
    },

    EXAM_DIFFICULT: {

        EASY: 0,

        MEDIUM: 1,

        HARD: 2
    },

    EXAM_TIME: {

        START: (30 * 60 * 1000), // 30 minutes in milisecond

        END: (120 * 60 * 1000), // 120 minutes in milisecond

        STEP: (5 * 60 * 1000) // step per slide is 5 minutes
    },

    EXAM_NUMBER_QUESTION: {

        START: 30,

        END: 120,

        STEP: 10,

    }

}

export default AppConst;