import classNames from 'classnames/bind';
import styles from './ContactRequest.module.scss';
import SidebarRequest from '~/layouts/components/SidebarRequest';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserLogin } from '../../redux/apiRequest';
import config from '~/config';

const cx = classNames.bind(styles);

function ContactRequest() {
    const user = useSelector((state) => state.auth.login?.currentUser);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || !user.accessToken) {
            navigate(config.routes.login);
        }
    }, [user]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('sidebar')}>
                <SidebarRequest />
            </div>
        </div>
    );
}

export default ContactRequest;
