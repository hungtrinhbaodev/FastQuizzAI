import AppConst from "../services/AppConst";
import DocumentData from "./DocumentData";

class DialogData {

    constructor(
        usage = AppConst.DIALOG_USAGE.NONE,
        title = "",
        canClose = true,
        
        // style data
        width = '800px',
        height = '600px',

        // custom data that child of dialog.jsx can access
        extraData = null,

        // last type of dialog using incase want to close
        // with last data
        lastUsage = null
    ) {

        this.usage = usage;
        
        this.title = title;

        this.canClose = canClose;

        this.width = width;

        this.height = height;

        this.extraData = extraData;

        this.lastUsage = lastUsage;
    }

    isUsageAt(usage) {
        return this.usage === usage || this.lastUsage === usage;
    }

    static makeCreateAccount() {
        return new DialogData(
            AppConst.DIALOG_USAGE.CREATE_ACCOUNT,
            "Create Account",
            false
        );
    }

    /**
     * 
     * @param {DialogData} lastData 
     * @returns 
     */
    static makeNone(lastData = null) {
        return new DialogData(
            AppConst.DIALOG_USAGE.NONE,
            lastData !== null ? lastData.title : "",
            true,
            lastData !== null ? lastData.width : null,
            lastData !== null ? lastData.height : null,
            lastData !== null ? lastData.extraData : null,
            lastData !== null ? lastData.usage : null
        );
    }

    static makeCreateExam() {
        return new DialogData(
            AppConst.DIALOG_USAGE.CREATE_EXAM,
            "Create Exam",
            true
        );
    }

    static makeAddDocument() {
        return new DialogData(
            AppConst.DIALOG_USAGE.ADD_DOCUMENT,
            "Add Document",
            true,
            '600px',
            '630px'
        );
    }

    /**
     * 
     * @param {DocumentData} docData 
     * @returns 
     */
    static makeViewDocument(docData) {
        return new DialogData(
            AppConst.DIALOG_USAGE.VIEW_DOCUMENT,
            docData.name,
            true,
            '85%',
            '90%',
            docData
        );
    }

    static makeConfirmNotify(
        confirmMessage = "Do you confirm with this ?",
        callbackConfirm = () => {}
    ) {
        return new DialogData(
            AppConst.DIALOG_USAGE.CONFIRM_NOTIFY,
            "Notify",
            true,
            '400px',
            '320px',
            {
                confirmMessage,
                callbackConfirm
            }
        );
    }

    copyWithSize(width, height) {
        return new DialogData(
            this.usage,
            this.title,
            this.canClose,
            width,
            height
        );
    }
}

export {
    DialogData

}

export default DialogData;