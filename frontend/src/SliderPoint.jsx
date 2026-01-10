import {useState, useEffect, useRef} from 'react'
import './SliderPoint.css'

import AppConst from './services/AppConst';

const SliderPoint = ({startPercent, onPercentAt, textStart, textEnd}) => {

    const backgroundBarRef = useRef(null);
    const buttonSlideRef = useRef(null);
    const barRef = useRef(null);

    let slidingState = AppConst.SLIDER_STATE.IDLE;

    const getMaxBarWidth = () => {
        const background = backgroundBarRef.current;
        const button = buttonSlideRef.current;

        const bgRect = background.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();

        return bgRect.width - buttonRect.width * 0.75;
    }

    const getMinBarWidth = () => {
        const button = buttonSlideRef.current;
        const buttonRect = button.getBoundingClientRect();

        return -buttonRect.width / 2;
    }

    const updateComponentByWidth = (width) => {
        const button = buttonSlideRef.current;
        const bar = barRef.current;
        const buttonRect = button.getBoundingClientRect();
        button.style.left = `${width}px`;
        bar.style.width = `${width + buttonRect.width / 2}px`;
    }

    const getWidthByPercent = (percent) => {
        const minWidth = getMinBarWidth();
        const maxWidth = getMaxBarWidth();
        if (percent < 0) percent = 0;
        if (percent > 1) percent = 1;
        return minWidth + percent * (maxWidth - minWidth);
    }

    useEffect(() => {
        updateComponentByWidth(getWidthByPercent(startPercent));
    }, []);

    const onTouchDown = (event) => {
        switch (slidingState) {
            case AppConst.SLIDER_STATE.IDLE: {
                slidingState = AppConst.SLIDER_STATE.SLIDING;
                window.addEventListener('pointermove', onTouchMove);
                window.addEventListener('pointerup', onTouchEnd);
                break;
            }
            default: {
                break;
            }
        }
    }

    const onTouchMove = (event) => {

        switch (slidingState) {
            case AppConst.SLIDER_STATE.SLIDING: {

                const background = backgroundBarRef.current;
                const bgRect = background.getBoundingClientRect();
                let percent = (event.clientX - bgRect.left) / bgRect.width;
                
                updateComponentByWidth(getWidthByPercent(percent));
                onPercentAt(percent);

                break;
            }
        }
    }

    const onTouchEnd = () => {
        switch (slidingState) {
            case AppConst.SLIDER_STATE.SLIDING: {
                
                slidingState = AppConst.SLIDER_STATE.IDLE;
                window.removeEventListener('pointermove', onTouchMove);
                window.removeEventListener('pointerup', onTouchEnd);
                break;
            }
        }
    }

    return (
        <div
            className='slider-point-container'
        >
            <div
                ref={backgroundBarRef}
                className='slider-point-background-bar'
            >
                <div
                    ref={barRef}
                    className='slider-point-bar'
                >
                </div>
                <div
                    ref={buttonSlideRef}
                    className='slider-point-button-slide'
                    onPointerDown={(e)=>{onTouchDown(e)}}
                >
                </div>
            </div>
            <div
                className='slider-point-label-container'
            >
                <label
                    className='slider-point-label-start slider-point-label'
                >
                    {textStart}
                </label>
                <label
                    className='slider-point-label-end slider-point-label'
                >
                    {textEnd}
                </label>
            </div>
        </div>
    );
}

export default SliderPoint;