import AppConst from './services/AppConst';
import './ViewDocument.css';

const ViewDocument = ({ docPath }) => {
    
    const getDocURL = () => {
        if (!docPath) return "";
        return AppConst.SERVER_BASE_URL + docPath;
    }

    return (
        <div className="view-document-container">
            <iframe 
                src={getDocURL()} 
                className="document-frame"
                title="Document Viewer"
            />
        </div>
    );
};

export default ViewDocument;
