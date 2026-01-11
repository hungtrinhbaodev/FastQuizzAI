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

AppUtils.convertUTF8ToNormal = function(str) {
    return str.normalize("NFD")           // Step 1
            .replace(/[\u0300-\u036f]/g, "") // Step 2
            .replace(/đ/g, "d")              // Step 3 (Special case)
            .replace(/Đ/g, "D");
}

AppUtils.convertMiliInToMinutes = function(milisecond) {
    return Math.floor(milisecond / 60 / 1000);
}

AppUtils.getValuenInRangeWith = function(min, max, percent, step) {
    const currentValue = min + percent * (max - min);
    let value = step * (Math.round(currentValue / step));
    if (value < min) value = min;
    if (value > max) value = max;
    return value;
}

AppUtils.clipText = function(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + "...";
    }
    return text;
}

export default AppUtils;