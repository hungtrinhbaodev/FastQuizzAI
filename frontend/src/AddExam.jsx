import {useState} from 'react'
import FloatDropBoxMultiOption from './FloatDropBoxMultiOption';
import AppConst from './services/AppConst';
import AppUtils from './services/AppUtils';
import appService from './services/AppService';
import BoxOneOption from './BoxOneOption';

const AddExam = ({}) => {
    
    const [examName, setExamName] = useState("");
    const [examDocsId, setExamDocsId] = useState([]);
    const [examTime, setExamTime] = useState(0);
    const [examDifficult, setExamDifficult] = useState(0);

    const docsData = appService.getUserDocs();

    const getListDifficultTypes  = () => {
        let listDifficult = [];
        for (const key in AppConst.DIFFICULT_TYPE) {
            listDifficult.push(AppConst.DIFFICULT_TYPE[key]);
        }
        return listDifficult;
    }

    const getListDifficultNames = () => {
        let listDifficultNames = [];
        for (const difficultType of getListDifficultTypes()) {
            listDifficultNames.push(AppUtils.getDifficultNameBy(difficultType));
        }
        return listDifficultNames;
    }

    const onChoseDocs = (docIndices) => {
        const docIds = [];
        docIndices.map(index => docsData[index].id);
        setExamDocsId(docIds);
    }

    const onChoseDifficult = (index) => {
        setExamDifficult(getListDifficultTypes()[index]);
    }

    const onChoseTimeExam = (index) => {

    }

    return (
        <div
            className='add-exam-container'
        >
            <div
                className='add-exam-input-name-container'
            >
                <label
                    className='label-input-name'
                >
                    Enter exam name:
                </label>
                <input 
                    type='text'
                    className='add-exam-input-name-exam'
                    onChange={(e) => {setExamName(e.target.value)}}
                />
            </div>

            <div
                className='add-exam-chose-document-container'
            >
                <label
                    className='add-exam-label-choose-document-container'
                >
                    Chose documents:
                </label>
                <div
                    className='add-exam-options-document-container'
                >
                    <FloatDropBoxMultiOption
                        optionNames={docsData.map(docData => docData.name)}
                        onChoseOptions={onChoseDocs}
                    />
                </div>
            </div>

            <BoxOneOption 
                title={"Chose time exam:"}
                optionNames={[]/**TODO: add time config here */}
                onChosenOptions={onChoseTimeExam}
            />

            <BoxOneOption 
                title={"Chose difficult exam:"}
                optionNames={getListDifficultNames()}
                onChosenOptions={onChoseDifficult}
            />

        </div>
    );
} 