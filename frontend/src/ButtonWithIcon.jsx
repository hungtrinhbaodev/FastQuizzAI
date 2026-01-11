import AppIcon from "./AppIcon";
import './ButtonWithIcon.css';

const ButtonWithIcon = ({iconType, text, onClick}) => {
    return (
        <div
            className='button-with-icon-container'
            onClick={() => {onClick()}}
        >
            <AppIcon
                iconType={iconType}
                className='button-with-icon-icon'
            />
            <label
                className='button-with-icon-label'
            >
                {text}
            </label>
        </div>
    );
} 

export default ButtonWithIcon;