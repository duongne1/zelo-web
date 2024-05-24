import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import SearchContact from '~/layouts/components/SearchContact';
import styles from './SidebarGroup.module.scss';
import Image from '~/components/Image';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import config from '~/config';
import { useNavigate } from 'react-router-dom';
import { getConversationsById } from '~/redux/apiRequest';
import { loginSuccess } from '~/redux/authSlice';
import { createAxios } from '~/createInstance';

const cx = classNames.bind(styles);

function SidebarGroup() {
    const [listGroup, setListGroup] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [sortBy, setSortBy] = useState('A-Z'); // Mặc định sắp xếp theo tên A-Z
    const getUser = useSelector((state) => state.users.users?.currentUser);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.login?.currentUser);
    let axiosJWT = createAxios(user, dispatch, loginSuccess);

    const fetchGroups = async () => {
        try {
            const response1 = await axios.get(
                `https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/conversation/getConversationByUserId/${getUser?._id}`,
                {
                    headers: {
                        token: `Bearer ${getUser?.token}`,
                    },
                },
            );
            const conversations = response1.data;

            let groupConversations = conversations.filter((conversation) => conversation.type === 'Group');

            if (searchValue.length > 0) {
                const searchTerms = searchValue.trim().toLowerCase().split(' ');
                groupConversations = groupConversations.filter((group) => {
                    const normalizedGroupName = group.name.trim().toLowerCase();
                    return searchTerms.some((term) => normalizedGroupName.includes(term));
                });
            }

            // Sắp xếp danh sách nhóm theo tên
            if (sortBy === 'A-Z') {
                groupConversations.sort((a, b) => a.name.localeCompare(b.name));
            } else if (sortBy === 'Z-A') {
                groupConversations.sort((a, b) => b.name.localeCompare(a.name));
            }

            setListGroup(groupConversations);
        } catch (error) {
            console.error('Error fetching groups:', error);
        }
    };

    useEffect(() => {
        if (getUser) {
            fetchGroups();
        }
    }, [getUser, searchValue, sortBy]);

    const handleChat = (conversationByFriend) => {
        getConversationsById(user?.accessToken, dispatch, conversationByFriend, axiosJWT);

        navigate(config.routes.home);
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
                {listGroup.map((group) => (
                    <div
                        key={group?._id}
                        className={cx('group-item')}
                        onClick={() => {
                            handleChat(group?._id);
                        }}
                    >
                        <div className={cx('info')}>
                            <Image className={cx('user-avatar')} src={group?.groupImage} alt={group?.name} />
                            <div className={cx('info-Sum')}>
                                <h3 className={cx('info-item')}>{group?.name}</h3>
                                <span className={cx('info-length')}>{group?.members.length} thành viên</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SidebarGroup;
