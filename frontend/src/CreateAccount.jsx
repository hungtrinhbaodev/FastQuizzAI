import AppConst from './services/AppConst';
import Dropzone from './Dropzone';
import appService from './services/AppService';

import { useState, useEffect } from 'react';
import './CreateAccount.css';

const CreateAccount = ({ onResize, onSuccess }) => {
    const [step, setStep] = useState(AppConst.CREATE_ACCOUNT_STEP.INPUT_NAME);
    const [iUserName, setIUserName] = useState("");
    const [iAvatar, setIAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    const handleAvatarDrop = (files) => {
        if (files && files.length > 0) {
            const file = files[0];
            setIAvatar(file);
            // Create a URL for the dropped file to show a preview
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveAvatar = () => {
        setIAvatar(null);
        setAvatarPreview(null);
    };

    const handleConfirm = async () => {
        if (!iUserName || !iAvatar) {
            alert("Please provide a username and an avatar.");
            return;
        }
        // The onSuccess callback will be called from within the service
        await appService.createAccount(iUserName, iAvatar, onSuccess);
    };

    // Cleanup the object URL to prevent memory leaks when the component unmounts
    useEffect(() => {
        return () => {
            if (avatarPreview) URL.revokeObjectURL(avatarPreview);
        };
    }, [avatarPreview]);

    useEffect(() => {
 
        switch (step) {
            // Step 1: Small dialog for username
            case AppConst.CREATE_ACCOUNT_STEP.INPUT_NAME: {
                onResize("480px", "320px");
                break;
            }

            // Step 2: Larger dialog for avatar drag-and-drop
            case AppConst.CREATE_ACCOUNT_STEP.INPUT_AVATAR: {
            onResize("600px", "500px");
                break;
            }
        }

    }, [step, onResize]);

    return (
        <div className='create-account-container'>
            {step === AppConst.CREATE_ACCOUNT_STEP.INPUT_NAME && (
                <div className='step-content'>
                    <label className='content-title'>Enter your user name:</label>
                    <input 
                        type='text'
                        placeholder='Enter user name'
                        className='input-name'
                        onChange={(e) => setIUserName(e.target.value)}
                        value={iUserName}
                    />
                    <button className="confirm-btn" onClick={() => setStep(AppConst.CREATE_ACCOUNT_STEP.INPUT_AVATAR)}>Next</button>
                </div>
            )}
            {step === AppConst.CREATE_ACCOUNT_STEP.INPUT_AVATAR && (
                <div className='step-content'>
                    <label className='content-title'>Chose your avatar:</label>
                    <Dropzone 
                        onDrop={handleAvatarDrop} 
                        hasFile={avatarPreview !== null} 
                        accept="image/*"
                    >
                        {!avatarPreview && (
                            <p>Drag image here or <span className="browse-link">click to browse</span></p>
                        )}
                        {avatarPreview && (
                            <img src={avatarPreview} alt="Avatar Preview" className="dropzone-preview" />
                        )}
                    </Dropzone>
                    <div className="button-group">
                        <button className='secondary-btn' onClick={() => setStep(AppConst.CREATE_ACCOUNT_STEP.INPUT_NAME)}>Back</button>
                        {iAvatar && (
                            <>
                                <button className='secondary-btn' onClick={handleRemoveAvatar}>Remove</button>
                                <button className='confirm-btn' onClick={handleConfirm}>Confirm</button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateAccount;