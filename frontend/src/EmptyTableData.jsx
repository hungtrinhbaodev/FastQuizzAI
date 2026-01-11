import './EmptyTableData.css';
import {FaFolderPlus} from 'react-icons/fa'

const EmptyTableData = ({onClick, text}) => {

    return (
        <div 
            className='empty-table-data-container'
        >
            <FaFolderPlus
                className='empty-table-data-button-add-docs'
                onClick={() => {onClick()}}
            />
            <label
                className='empty-table-data-label-add-docs'
            >
                {text}
            </label>
        </div>
    );
}

export default EmptyTableData;