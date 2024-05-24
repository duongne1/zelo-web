import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import SearchContact from '~/layouts/components/SearchContact';
import styles from './SidebarFriend.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import Image from '~/components/Image';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { toast, Toaster } from 'react-hot-toast';
import config from '~/config';
import { useNavigate } from 'react-router-dom';
import { getConversationsById } from '~/redux/apiRequest';
import { loginSuccess } from '~/redux/authSlice';
import { createAxios } from '~/createInstance';

const cx = classNames.bind(styles);

function SidebarFriend() {
    const [listFriend, setListFriend] = useState([]);
    const [messageRender, setmessageRender] = useState('');
    const [sortBy, setSortBy] = useState('A-Z'); // Mặc định sắp xếp theo tên A-Z

    const [searchValue, setSearchValue] = useState('');
    const [data, setData] = useState('');

    const getUser = useSelector((state) => state.users.users?.currentUser);
    const socketRef = useSelector((state) => state.socket?.currentSocket);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.login?.currentUser);
    let axiosJWT = createAxios(user, dispatch, loginSuccess);

    const fetchDataConversationByUserID = async () => {
        try {
            const response = await axios.get('api/v1/conversation/getConversationByUserId/' + getUser?._id);
            if (response.data) {
                const fetchedData = response.data;
                setData(fetchedData);
            }
        } catch (error) {}
    };
    useEffect(() => {
        fetchDataConversationByUserID();
    }, [getUser]);

    const handleChat = (selectedUserID) => {
        if (data) {
            const filteredConversations = data?.filter(
                (conversation) =>
                    conversation.type === 'Direct' &&
                    conversation.members.some((member) => member?.userId?._id === selectedUserID),
            );
            const conversationByFriend = filteredConversations[0];
            getConversationsById(user?.accessToken, dispatch, conversationByFriend?._id, axiosJWT);

            navigate(config.routes.home);
        } else return;
    };
    useEffect(() => {
        if (socketRef) {
            socketRef.on('sendMessage', (message) => {
                console.log('message', message);
                setmessageRender(message);
                return () => {
                    if (socketRef) {
                        socketRef.disconnect();
                    }
                };
            });
        }
    }, [socketRef]);

    const fetchFriends = async () => {
        try {
            const response = await axios.get(`api/v1/users/getFriendWithDetails/${getUser?._id}`);
            const friendIds = response.data;

            // Lấy thông tin chi tiết của từng bạn bè

            let filteredUser = friendIds;

            if (searchValue.length > 0) {
                const searchTerms = searchValue.trim().toLowerCase().split(' ');
                filteredUser = filteredUser.filter((user) => {
                    const normalizedGroupName = user.name.trim().toLowerCase();
                    return searchTerms.some((term) => normalizedGroupName.includes(term));
                });
            }

            // Sắp xếp danh sách nhóm theo tên
            if (sortBy === 'A-Z') {
                filteredUser.sort((a, b) => a.name.localeCompare(b.name));
            } else if (sortBy === 'Z-A') {
                filteredUser.sort((a, b) => b.name.localeCompare(a.name));
            }

            setListFriend(filteredUser);
        } catch (error) {
            console.error('Error fetching friends:', error);
        }
    };

    useEffect(() => {
        if (messageRender) {
            fetchFriends();
        }
    }, [messageRender]);
    useEffect(() => {
        if (getUser) {
            fetchFriends();
        }
    }, [getUser, searchValue, sortBy]);

    const handleDeleteFriend = async (friendId) => {
        try {
            // Gửi yêu cầu xóa bạn bè lên máy chủ
            await axios.post('api/v1/users/deleteFriends', {
                id_sender: friendId,
                id_receiver: getUser?._id,
            });
            socketRef.emit('sendMessage', friendId + 'Đã xóa bạn bè');
            toast.success('Xóa bạn bè thành công!');
            // Cập nhật lại danh sách bạn bè sau khi xóa thành công
            setListFriend((prevList) => prevList.filter((friend) => friend?._id !== friendId));
        } catch (error) {
            toast.error('Xóa bạn bè thất bại!');
        }
    };

    return (
        <div className={cx('wrapper')}>
            <Toaster toastOptions={{ duration: 2000 }} />
            <SearchContact
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                sortBy={sortBy}
                setSortBy={setSortBy}
            />
            <div className={cx('container')}>
                {listFriend.map((friend) => (
                    <div key={friend?._id} className={cx('friend-item')}>
                        <div
                            className={cx('info')}
                            onClick={() => {
                                handleChat(friend?._id);
                            }}
                        >
                            <Image className={cx('user-avatar')} src={friend?.avatar} alt={friend?.name} />

                            <h3 className={cx('info-item')}>{friend?.name}</h3>
                        </div>

                        <button className={cx('btn-more')} onClick={() => handleDeleteFriend(friend?._id)}>
                            <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SidebarFriend;
