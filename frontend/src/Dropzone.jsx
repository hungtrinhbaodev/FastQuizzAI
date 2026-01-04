import React, { useState, useCallback, useRef, useEffect } from 'react';
import './Dropzone.css';

const Dropzone = ({ onDrop, children, hasFile, accept }) => {
    
    const [isDragActive, setIsDragActive] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        if (!hasFile) {
            inputRef.current.value = null;
        }
    }, [hasFile]);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDragIn = useCallback((e) => {
        handleDrag(e);
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setIsDragActive(true);
        }
    }, [handleDrag]);

    const handleDragOut = useCallback((e) => {
        handleDrag(e);
        setIsDragActive(false);
    }, [handleDrag]);

    const handleDrop = useCallback((e) => {
        handleDrag(e);
        setIsDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onDrop(e.dataTransfer.files);
            e.dataTransfer.clearData();
        }
    }, [handleDrag, onDrop]);

    const handleClick = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            onDrop(e.target.files);
        }
    };

    return (
        <div
            className={`dropzone-container ${isDragActive ? 'active' : ''} ${!hasFile ? 'clickable' : ''}`}
            onDragEnter={handleDragIn}
            onDragLeave={handleDragOut}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={!hasFile ? handleClick : undefined}
        >
            <input
                ref={inputRef}
                type="file"
                style={{ display: 'none' }}
                onChange={handleFileSelect}
                accept={accept}
            />
            {children}
        </div>
    );
};

export default Dropzone;