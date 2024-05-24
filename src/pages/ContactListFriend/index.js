import classNames from 'classnames/bind';
import styles from './ContactListFiend.module.scss';
import SidebarFriend from '~/layouts/components/SidebarFriend';
import { useEffect } from 'react';
import config from '~/config';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const cx = classNames.bind(styles);

function Contact() {
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
                {/* Bắt đầu của sidebar */}
                <SidebarFriend />
                {/* Kết thúc của sidebar */}
            </div>
        </div>
    );
}

export default Contact;
