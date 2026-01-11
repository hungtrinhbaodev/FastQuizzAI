import AppConst from "./services/AppConst";
import {FaFileMedicalAlt, FaTrashAlt, FaRegAddressBook, FaFolderPlus} from 'react-icons/fa';

const AppIcon = ({iconType, className}) => {
    return (
        <>
            {iconType === AppConst.ICON_TYPE.WATCH && (
                <FaFileMedicalAlt
                    className={`${className}`}
                />
            )}
            {iconType === AppConst.ICON_TYPE.DELETE && (
                <FaTrashAlt
                    className={`${className}`}
                />
            )}
            {iconType ===  AppConst.ICON_TYPE.MAKE_EXAM && (
                <FaRegAddressBook
                    className={`${className}`}
                />
            )}
            {iconType === AppConst.ICON_TYPE.ADD_FOLDER && (
                <FaFolderPlus
                    className={`${className}`}
                />
            )}
        </>
    );
}

export default AppIcon;