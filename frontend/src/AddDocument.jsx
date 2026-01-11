import {useState} from 'react';
import Dropzone from './Dropzone';
import AppConst from './services/AppConst';
import imageUploadPDF from './assets/imageUploadPDF.png';
import './AddDocument.css';

import appService from './services/AppService';
import AppUtils from './services/AppUtils';
import LoadingData from './data/LoadingData';
import BoxOneOption from './BoxOneOption';
import DialogData from './data/DialogData';

const AddDocument = ({useDialog, closeDialog, useLoading}) => {
    
    const [docName, setDocName] = useState("");
    const [docType, setDocType] = useState(AppConst.DOCUMENT_TAG.OTHER);
    const [file, setFile] = useState(null);

    const handleDocumentDrop = (files) => {
        if (files && files.length > 0) {
            const file = files[0];
            setFile(file);
        }
    }

    const handleRemoveDocument = () => {
        setFile(null);
    }
    
    const getAllDocumentTag = () => {
        const types = [];
        for (let key in AppConst.DOCUMENT_TAG) {
            types.push(AppConst.DOCUMENT_TAG[key]);
        }
        return types;
    }

    const getAllDocumentTagName = () => {
        const typeNames = [];
        for (let type of getAllDocumentTag()) {
            typeNames.push(AppUtils.getDocumentTagNameBy(type));
        }
        return typeNames;
    }

    const onChoseTag = (index) => {
        const allTags = getAllDocumentTag();
        const type = allTags[index];
        setDocType(type);
    }

    const getAcceptDocumentFormat = () => {
        return ".pdf, .doc, .docx, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    }

    const handleConfirm = () => {

        if (docName == "") {
            alert("Please enter your document name!");
            return;
        }
        if (file === null) {
             alert("Please add file to send!");
            return;
        }

        const loadingData = useLoading(LoadingData.makeLoading("Wait to upload your doccument!"));

        closeDialog();

        appService.addDoc(docName, docType, file, (docData) => {

            useLoading(LoadingData.makeNone(loadingData));

            useDialog(DialogData.makeConfirmNotify(
                "Create document name: " + docData.name + " successfully!"
            ));

        });

    }

    return (
        <>
            <div
                className='add-document-container'
            >
                <div
                    className='document-name-container'
                >
                    <label
                        className='label-input-name label-content'
                    >
                        Enter document name: {docName === "" ? "" : docName + "."}
                    </label>
                    <input
                        type='text'
                        placeholder='Document name...'
                        className='input-name'
                        onChange={(e) => setDocName(e.target.value)}
                    />
                </div>
                <BoxOneOption
                    title={"Select document tag:"}
                    optionNames={getAllDocumentTagName()}
                    onChosenOptions={onChoseTag}
                    defaultChosenIndex={getAllDocumentTag().indexOf(AppConst.DOCUMENT_TAG.OTHER)}
                />
                <Dropzone
                    onDrop={handleDocumentDrop}
                    hasFile={file !== null}
                    accept={getAcceptDocumentFormat()}
                >
                    {file === null && (
                        <p>Drag document here or <span className="browse-link">click to browse</span></p>
                    )}
                    {file !== null && (
                        <div
                            className='document-preview-container'
                        >
                            <img
                                src={imageUploadPDF}
                                className='image-upload-pdf'
                            />
                            <label
                                className='label-doc-name'
                            >
                                {file.name}
                            </label>
                        </div>
                    )}
                </Dropzone>
                <div
                    className='process-buttons-group'
                >
                    {file != null && (
                        <button
                            className='remove-item-btn secondary-btn process-btn'
                            onClick={handleRemoveDocument}
                        >
                            Remove document
                        </button>
                    )}
                    <button
                        className='confirm-btn process-btn'
                        onClick={() => {handleConfirm()}}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </>
    )
}

export default AddDocument;