import { useState } from "react";
import './BoxOneOption.css';

const BoxOneOption = ({title, optionNames, onChosenOptions, defaultChosenIndex}) => {

    const [chosenIndex, setChosenIndex] = useState(defaultChosenIndex);

    const getChoseTagStyles = (index) => {
        let styles = {};
        styles['border'] = index === chosenIndex ? '3px solid var(--accept-color)' : '0px';
        index === chosenIndex && (styles['backgroundColor'] =  "rgba(25, 66, 100, 1)");
        index === chosenIndex && (styles['color'] =  "white");
        index === chosenIndex && (styles['transform'] = "scale(1.1)");
        return styles;
    }

    const onChoseIndex = (index) => {
        setChosenIndex(index);
        onChosenOptions(index);
    }

    const getChosenOptionName = () => {
        return optionNames[chosenIndex];
    }

    return (
        <div
            className='box-one-option-container'
        >
            <label
                className='box-one-option-label-title'
            >
                {title} "{getChosenOptionName()}"
            </label>
            <div
                className='box-one-option-buttons-group'
            >
                {optionNames.map((tagName, index) => (
                    <button
                        key={index}
                        className='box-one-option-button-option'
                        style={{
                            ...getChoseTagStyles(index)
                        }}
                        onClick={() => onChoseIndex(index)}
                    >
                        {tagName}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default BoxOneOption;