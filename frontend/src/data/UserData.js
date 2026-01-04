class UserData {
    constructor(userId, userName, userAvatar) {
        this._userId = userId;
        this._userName = userName;
        this._userAvatar = userAvatar;

    }

    setUserId(userId) {
        this._userId = userId;
    }

    setUserName(userName) {
        this._userName = userName;
    }

    setUserAvatar(userAvatar) {
        this._userAvatar = userAvatar;
    }

    getUserId() {
        return this._userId;
    }

    getUserName () {
        return this._userName;
    }

    getUserAvatar() {
        return this._userAvatar;
    }
}

export default UserData;