import AppConst from "../services/AppConst";

class DocumentData {
    constructor(docId, docName, createTime, link, tag) {
        this.id = docId;
        this.name = docName;
        this.createTime = createTime;
        this.link = link;
        this.tag = tag;
    }
}

export default DocumentData;