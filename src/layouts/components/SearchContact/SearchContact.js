import { useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './SearchContact.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faArrowsAltV } from '@fortawesome/free-solid-svg-icons';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';

const cx = classNames.bind(styles);

function SearchContact({ searchValue, setSearchValue, sortBy, setSortBy }) {
    const inputRef = useRef();

    const handleClear = () => {
        setSearchValue('');
        inputRef.current.focus();
    };

    const handleChange = (event) => {
        const trimmedValue = event.target.value.trimStart();
        setSearchValue(trimmedValue);
    };

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('search')}>
                <button className={cx('icon-search')}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
                <input ref={inputRef} value={searchValue} placeholder="Tìm kiếm" onChange={handleChange} />
                {!!searchValue && (
                    <button className={cx('icon-clear')} onClick={handleClear}>
                        <FontAwesomeIcon icon={faCircleXmark} />
                    </button>
                )}
            </div>
            <div className={cx('filter')}>
                <FontAwesomeIcon icon={faArrowsAltV} className={cx('icon-filter')} />
                <select value={sortBy} onChange={handleSortChange}>
                    <option value="A-Z">Tên (A-Z)</option>
                    <option value="Z-A">Tên (Z-A)</option>
                </select>
            </div>
        </div>
    );
}

export default SearchContact;
