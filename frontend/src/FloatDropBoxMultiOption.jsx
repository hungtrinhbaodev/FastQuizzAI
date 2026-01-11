import {useState, useEffect, useRef} from 'react'
import './FloatDropBoxMultiOption.css'
import AppUtils from './services/AppUtils';
import {FaTimes} from 'react-icons/fa'

const FloatDropBoxMultiOption = ({optionNames, onChoseOptions, defaultChosenOptions}) => {

    const [chosenOptionNames, setChosenOptionNames] = useState([]);
    const [keySearch, setKeySearch] = useState("");
    const [searchResults, setSearchReults] = useState([]);
    const [isSearching, setSearching] = useState(false);
    const [chosenOptions, setChosenOptions] = useState([]);
    const refInputSearch = useRef(null);

    useEffect(() => {
        defaultChosenOptions = defaultChosenOptions.filter(option => (option >= 0 && option < optionNames.length));
        setChosenOptions(defaultChosenOptions);
        setChosenOptionNames(defaultChosenOptions.map(index => optionNames[index]));
    }, [defaultChosenOptions, optionNames]);

    const addChosenOption = (index) => {
        const indexInOptions = optionNames.indexOf(searchResults[index]);
        const choseOptions = [...chosenOptions, indexInOptions];
        setChosenOptions(choseOptions);
        setChosenOptionNames([...chosenOptionNames, optionNames[indexInOptions]]);
        onChoseOptions(choseOptions);
        stopSearching();
    }

    const removeChosenOption = (index) => {
        const indexInOptions = optionNames.indexOf(chosenOptionNames[index]);
        const indexInChosenOptions = chosenOptions.indexOf(indexInOptions);
        if (indexInChosenOptions > -1) {
            chosenOptions.splice(indexInChosenOptions, 1);
            chosenOptionNames.splice(indexInChosenOptions, 1);
        }
        setChosenOptions([...chosenOptions]);
        setChosenOptionNames([...chosenOptionNames]);
        onChoseOptions([...chosenOptions]);
    }

    const getRemainOptionNames = () => {
        const remainOptionNames = optionNames.map(name => name);
        for (const name of chosenOptionNames) {
            let index = remainOptionNames.indexOf(name);
            if (index > -1) {
                remainOptionNames.splice(index, 1);
            }
        }
        return remainOptionNames
    }

    const stopSearching = () => {
        setSearching(false);
        refInputSearch.current.value = "";
        setKeySearch("");
    }

    const onSearching = (keySearch) => {

        setKeySearch(keySearch);

        const remainOptionNames = getRemainOptionNames();
        const optionsShow = [];
        const normKeySearch = AppUtils.convertUTF8ToNormal(keySearch);
        for (const name of remainOptionNames) {
            const normName = AppUtils.convertUTF8ToNormal(name);
            if (normName.toLowerCase().includes(normKeySearch.toLowerCase())) {
                optionsShow.push(name);
            }
        }
        setSearchReults(optionsShow);
    }

    const onShowAllRemainOptions = (e) => {

        setSearching(true);

        const inputText = e.target.value;
        if (inputText == "") {
            const remainOptionNames = getRemainOptionNames();
            setSearchReults(remainOptionNames);
        }
    }

    return (
        <>
            <div
                className='float-drop-box-input-chosen-suggest-container'
                ref={refInputSearch}
            >
                <input 
                    type='text'
                    className='float-drop-box-input-suggest'
                    onClick={(e) => {onShowAllRemainOptions(e)}}
                    onChange={(e) => onSearching(e.target.value)}
                    value={keySearch}
                    placeholder='Enter your document name...'
                />
                {isSearching && (<FaTimes 
                    className='float-drop-box-button-close-search'
                    onClick={() => stopSearching()}
                />)}
                {isSearching && (
                    <div
                        className='float-drop-box-options-suggest-group-container'
                        style={{
                            'alignItems': searchResults.length <= 0 ? 'center' : 'none',
                            'justifyContent': searchResults.length <= 0 ? 'center' : 'none',
                            'paddingBottom': searchResults.length <= 0 ? '0px' : '5px'
                        }}
                        onClick={() => {
                            searchResults.length <= 0 && stopSearching();
                        }}
                    >
                        {searchResults.map((name, index) => (
                            <div
                                key={index}
                                className='float-drop-box-search-option'
                                onClick={() => {addChosenOption(index)}}
                            >
                                {name}
                            </div>
                        ))}
                        {searchResults.length <= 0 && (
                            <label
                                className='float-drop-box-label-none-result'
                            >
                                Not have result...
                            </label>
                        )}
                    </div>
                )}
            </div>
            <div
                className='float-drop-box-chosen-options-container'
            >
                {chosenOptionNames.map((name, index) => (
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