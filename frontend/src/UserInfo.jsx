import './UserInfo.css'

const UserInfo = ({name, avatarURL, onClickAvatar}) => {

    return (
        <div 
            className="user-info-container"
            onClick={onClickAvatar}
        >
            <img 
                className="user-info-avatar"
                alt="Description of image"
                src={avatarURL}
            />
            <label className="user-info-name">
                {name}
            </label>
        </div>
    );
}

export default UserInfo;