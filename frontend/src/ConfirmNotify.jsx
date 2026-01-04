import './ConfirmNotify.css';

const ConfirmNotify = ({dialogData, closeDialog}) => {

    return (
        <div
            className="confirm-notify-container"
        >
            <div
                className='confirm-notify-content'
            >
                <label
                    className='confirm-notify-message'
                >
                    {dialogData.extraData.confirmMessage}
                </label>
            </div>
            <div
                className='confirm-notify-button-group'
            >
                <button
                    className='secondary-btn'
                    onClick={() => {closeDialog()}}
                >
                    Cancel
                </button>
                <button
                    onClick={() => {
                        closeDialog();
                        dialogData.extraData.callbackConfirm && dialogData.extraData.callbackConfirm();
                    }}
                >
                    Confirm
                </button>
            </div>
        </div>
    );
}

export default ConfirmNotify;