import {useState} from 'react'

const FloatDropBoxMultiOption = ({optionNames, onChoseOptions}) => {

    const [chosenOptions, setChosenOptions] = useState([]);
    const [keySearch, setKeySearch] = useState("");
    const [searchResults, setSearchReults] = useState([]);

    const addChosenOption = (name) => {
        setChosenOptions([...chosenOptions, name]);
        onChoseOptions(chosenOptions);
    }

    const removeChosenOption = (name) => {
        const index = chosenOptions.indexOf(name);
        if (index > -1) {
            chosenOptions.splice(index, 1);
        }
        setChosenOptions([...chosenOptions]);
        onChoseOptions(chosenOptions);
    }

    const getRemainOptionNames = () => {
        const remainOptionNames = [];
        for (const name of optionNames) {
            if (!chosenOptions.includes(name)) {
                remainOptionNames.push(name);
            }
        }
        return remainOptionNames
    }

    const onSearching = (keySearch) => {
        setKeySearch(keySearch);
        const remainOptionNames = getRemainOptionNames();
        const optionsShow = [];
        for (const name of remainOptionNames) {
            if (name.includes(keySearch)) {
                optionsShow.push(name);
            }
        }
        setSearchReults(optionsShow);
    }

    const onShowAllRemainOptions = () => {
        const remainOptionNames = getRemainOptionNames();
        setSearchReults(remainOptionNames);
    }

    return (
        <>
            <div
                className='float-drop-box-input-chosen-suggest-container'
            >
                <input 
                    type='text'
                    className='float-drop-box-input-suggest'
                    onClick={() => {onShowAllRemainOptions()}}
                    onChange={(e) => onSearching(e.target.value)}
                    value={keySearch}
                    placeholder='Enter your document name...'
                />
            </div>
            <div
                className='float-drop-box-options-suggest-group-container'
            >
                {searchResults.map((name, index) => (
                    <div
                        key={index}
                        className='float-drop-box-search-option'
                        onClick={() => {addChosenOption(index)}}
                    >
                        {name}
                    </div>
                ))};
            </div>
            <div
                className='float-drop-box-chosen-options-container'
            >
                {chosenOptions.map((name, index) => (
                    <div
                        key={index}
                        className='float-drop-box-chosen-option'
                        onClick={() => {removeChosenOption(index)}}
                    >
                        {name}
                    </div>
                ))}
            </div>
        </>
    );
}

export default FloatDropBoxMultiOption;