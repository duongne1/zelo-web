import classNames from 'classnames/bind';
import styles from './DefaultLayout.module.scss';

import Header from '../components/Header';
import Search from '~/layouts/components/Search';
import CenterLayout from '../CenterLayout';
import Home from '~/pages/Home/index';
import { useState } from 'react';
import ContactRequest from '~/pages/ContactRequest';
import ContactListFriend from '~/pages/ContactListFriend';
import ContactListGroup from '~/pages/ContactListGroup';

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
    const [selectedChatItem, setSelectedChatItem] = useState(null);

    const handleChatItemClick = (message) => {
        setSelectedChatItem(message);
    };

    const currentPath = window.location.pathname;

    return (
        <div className={cx('wrapper')}>
            <Header className={cx('header')} />

            <div className={cx('container')}>
                <Search className={cx('header')} />

                <CenterLayout className={cx('sidebar')} onChatItemClick={handleChatItemClick}>
                    {children}
                </CenterLayout>
            </div>

            <div className={cx('content')}>
                {currentPath === '/' && <Home selectedChatItem={selectedChatItem} />}
                {currentPath === '/contactRequest' && <ContactRequest />}
                {currentPath === '/contactListFriend' && <ContactListFriend />}
                {currentPath === '/contactListGroup' && <ContactListGroup />}
            </div>
        </div>
    );
}

export default DefaultLayout;
