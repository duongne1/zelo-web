import React from 'react';
import classNames from 'classnames/bind';
import styles from './Request.module.scss';
import Image from '~/components/Image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import axios from 'axios';
const cx = classNames.bind(styles);

function formatDate(timeRequest) {
    const currentDate = new Date();
    const requestDate = new Date(timeRequest);

    const diffInMillis = currentDate - requestDate;
    const diffInSeconds = Math.floor(diffInMillis / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInSeconds / 3600);

    if (diffInSeconds < 60) {
        return `${diffInSeconds}s trước`;
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

function Request({ avatar, name, timeRequest, content, requestId, onAccept, onRefuse }) {
    const formattedDate = formatDate(timeRequest);

    const getUser = useSelector((state) => state.users.users?.currentUser);
    const socketRef = useSelector((state) => state.socket?.currentSocket);

    const handleRefuseClick = async () => {
        onRefuse(requestId);
        try {
            const response = await axios.post('api/v1/users/deleteFriendRequest', {
                id_sender: requestId,
                id_receiver: getUser?._id,
            });
            console.log(response.data); // Log kết quả từ server (nếu cần)
            console.log('Xóa yêu cầu kết bạn thành công');
        } catch (error) {
            console.error('Error deleting friend request:', error);
        }
    };

    const handleAcceptClick = async () => {
        onAccept(requestId);
        try {
            const response = await axios.post('api/v1/users/acceptFriendRequest', {
                id_sender: requestId,
                id_receiver: getUser?._id,
            });

            if (response.data) {
                socketRef.emit('sendMessage', `${requestId} kết bạn với ${getUser?._id} thành công`);
                createConversation();
            }
        } catch (error) {
            console.error('Error deleting friend request:', error);
        }
    };

    const createConversation = async () => {
        try {
            const response = await axios.post('api/v1/conversation/createConversationWeb', {
                arrayUserId: [requestId, getUser?._id],
            });
            const response1 = await axios.post('api/v1/messages/addMessageWeb', {
                conversationId: response.data._id,
                content: 'Các bạn đã là bạn bè. Hãy trò chuyện với nhau nhé!',
                memberId: getUser._id, // Biến memberId của bạn ở đây
                type: 'notify',
            });
        } catch (error) {
            console.error('Error deleting friend request:', error);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('info')}>
                    <div className={cx('header')}>
                        <Image className={cx('user-avatar')} src={avatar} alt={name} />
                        <div className={cx('info-item')}>
                            <span className={cx('name')}>{name}</span>
                            <span className={cx('time-request')}>{formattedDate}</span>
                        </div>
                    </div>
                    <div className={cx('contend')}>
                        <span className={cx('text-content')}>{content}</span>
                    </div>
                    <div className={cx('btn-more')}>
                        <FontAwesomeIcon icon={faTimes} className={cx('refuse')} onClick={handleRefuseClick} />
                        <FontAwesomeIcon icon={faCheck} className={cx('accept')} onClick={handleAcceptClick} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Request;
