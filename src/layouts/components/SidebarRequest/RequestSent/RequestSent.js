import classNames from 'classnames/bind';
import styles from './RequestSent.module.scss';
import Image from '~/components/Image';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import axios from 'axios';

const cx = classNames.bind(styles);
function formatDate(timeRequest) {
    const currentDate = new Date();
    const requestDate = new Date(timeRequest);

    const diffInMillis = currentDate - requestDate;
    const diffInSeconds = Math.floor(diffInMillis / 1000); // Chênh lệch thời gian tính bằng giây
    const diffInMinutes = Math.floor(diffInSeconds / 60); // Chênh lệch thời gian tính bằng phút
    const diffInHours = Math.floor(diffInSeconds / 3600); // Chênh lệch thời gian tính bằng giờ

    if (diffInSeconds < 60) {
        return `vài giây trước`;
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes} phút trước`;
    } else if (diffInHours < 24) {
        return `${diffInHours} giờ trước`;
    } else if (diffInHours >= 24 && diffInHours < 48) {
        return 'Ngày hôm kia';
    } else {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return requestDate.toLocaleDateString('vi-VN', options);
    }
}
function RequestSend({ avatar, name, timeRequest, content, requestId, onRefuseSend }) {
    const formattedDate = formatDate(timeRequest);

    const getUser = useSelector((state) => state.users.users?.currentUser);
    const handleRefuseClick = async () => {
        onRefuseSend(requestId);
        try {
            const response = await axios.post('api/v1/users/deleteFriendRequest', {
                id_sender: getUser?._id,
                id_receiver: requestId,
            });
            console.log(response.data); // Log kết quả từ server (nếu cần)
            console.log('Xóa yêu cầu kết bạn thành công');
            return true;
        } catch (error) {
            console.error('Error deleting friend request:', error);
            return false; // Trả về false nếu có lỗi
        }
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('info')}>
                    <div className={cx('header')}>
                        <Image className={cx('user-avatar')} src={avatar} alt="Cao Trùng Dương" />
                        <div className={cx('info-item')}>
                            <span className={cx('name')}>{name}</span>
                            <span className={cx('time-request')}>{formattedDate}</span>
                        </div>
                    </div>

                    <div className={cx('contend')}>
                        <span className={cx('text-contend')}>{content}</span>
                    </div>

                    <div className={cx('btn-more')}>
                        <FontAwesomeIcon icon={faTimes} className={cx('refuse')} onClick={handleRefuseClick} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RequestSend;
