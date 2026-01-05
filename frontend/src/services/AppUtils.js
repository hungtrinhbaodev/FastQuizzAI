import AppConst from "./AppConst";

const AppUtils = {};

AppUtils.getDocumentTagNameBy = function(tag) {
    switch (parseInt(tag)) {
        case AppConst.DOCUMENT_TAG.OTHER: {
            return "Other";
        }
        case AppConst.DOCUMENT_TAG.LAW: {
            return "Law";
        }
        case AppConst.DOCUMENT_TAG.ENGLISH: {
            return "English";
        }
    } 
}

AppUtils.getDateFrom = function(timestamp) {
    const vnFull = new Date(timestamp).toLocaleString('vi-VN', {
        hour12: false,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    return vnFull;
}


AppUtils.getDifficultNameBy = function(difficultType) {
    switch (parseInt(difficultType)) {
        case AppConst.EXAM_DIFFICULT.EASY: {
            return "Easy";
        }
        case AppConst.EXAM_DIFFICULT.MEDIUM: {
            return "Medium";
        }
        case AppConst.EXAM_DIFFICULT.HARD: {
            return "Hard";
        }
    }
}

export default AppUtils;