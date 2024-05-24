import React, { useRef, useState, useEffect, useContext } from 'react';
import classNames from 'classnames/bind';
import styles from './Search.module.scss';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faEdit } from '@fortawesome/free-regular-svg-icons';
import Tippy from '@tippyjs/react';
import { faCamera, faMagnifyingGlass, faMagnifyingGlassPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import config from '~/config';
import UserContext from '~/components/context/UserContext';
import { CgSpinner } from 'react-icons/cg';
import PhoneInput from 'react-phone-input-2';
import iconUser from '~/assets/add-friend (2).png';
import iconGroup from '~/assets/add-group.png';
import { getConversationsById } from '~/redux/apiRequest';
import { loginSuccess } from '~/redux/authSlice';
import { createAxios } from '~/createInstance';
const cx = classNames.bind(styles);

function Search() {
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.login?.currentUser);
    let axiosJWT = createAxios(user, dispatch, loginSuccess);
    const [data, setData] = useState(null);
    const [userData, setUserData] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [searchValueUsername, setSearchValueUsername] = useState('');
    const [open, setOpen] = React.useState(false);
    const [openGroup, setOpenGroup] = useState(false);
    const [openAddFriend, setOpenAddFriend] = React.useState(false);
    const inputRef = useRef();
    const [selectedUser, setSelectedUser] = useState(null);
    const getUser = useSelector((state) => state.users.users?.currentUser);
    const [listFriend, setListFriend] = useState([]);
    const [selectedFriends, setSelectedFriends] = useState([getUser?._id]);
    const [groupName, setGroupName] = useState('');
    const isDisabled = selectedFriends.length < 3;
    const [selectedImage, setSelectedImage] = useState(null);
    const arrayUser = useState([getUser?._id]);
    const socketRef = useSelector((state) => state.socket?.currentSocket);
    const [isLoading, setIsLoading] = useState(false);
    const [messageRender, setmessageRender] = useState('');
    const [searchValueUsernameOrName, setSearchValueUsernameOrName] = useState('');

    const handleChat = () => {
        if (data) {
            const filteredConversations = data?.filter(
                (conversation) =>
                    conversation.type === 'Direct' &&
                    conversation.members.some((member) => member?.userId?._id === selectedUser?._id),
            );
            const conversationByFriend = filteredConversations[0];
            handleCloseAddFriend();
            handleClose();
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
    }, [getUser]);

    useEffect(() => {
        if (messageRender) fetchFriends();
    }, [messageRender]);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        console.log(file); // Lấy tệp đầu tiên từ danh sách các tệp được chọn
        setSelectedImage(file); // Lưu tệp đã chọn vào state
    };

    const fetchDataConversationByUserID = async () => {
        try {
            const response = await axios.get(
                'https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/conversation/getConversationByUserId/' +
                    getUser?._id,
            );
            if (response.data) {
                const fetchedData = response.data;
                setData(fetchedData);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchDataUsername = async () => {
        try {
            const response = await axios.get('https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/users/getAllUser');
            if (response.data) {
                const fetchedUserData = response.data;
                setUserData(fetchedUserData);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    useEffect(() => {
        fetchDataConversationByUserID();
        // Fetch data từ API username

        fetchDataUsername();
    }, [getUser]);

    useEffect(() => {
        if (messageRender) {
            fetchDataConversationByUserID();
            fetchFriends();
        }
    }, [messageRender]);

    useEffect(() => {
        if (data) {
            const filteredConversations = data.filter((conversation) =>
                conversation.name.toLowerCase().includes(searchValue.toLowerCase()),
            );
            setSearchResult(filteredConversations);
        }
    }, [searchValue, data]);

    useEffect(() => {
        if (userData) {
            // Lọc danh sách người dùng theo username
            const filteredUsers = userData.filter((user) =>
                user.username.toLowerCase().includes(searchValueUsername.toLowerCase()),
            );
        }
    }, [searchValueUsername, userData]);

    const handleChange = (event) => {
        const trimmedValue = event.target.value.trimStart();
        setSearchValue(trimmedValue);
    };
    const handleChangeUser = (newValue) => {
        const trimmedValue = newValue.trimStart();
        setSearchValueUsername(trimmedValue);
    };
    const handleChangeUserGroup = (event) => {
        const trimmedValue = event.target.value.trimStart();
        setSearchValueUsernameOrName(trimmedValue);
    };
    const handleClear = () => {
        setSearchValue('');
        inputRef.current.focus();
    };

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        fetchFriends();
        setOpen(false);
    };

    const handalAddFriend = () => {
        setOpenAddFriend(true);
        console.log('click');
    };

    const handleCloseAddFriend = () => {
        setOpenAddFriend(false);
        setSearchValueUsername('');
    };

    const handleOpenGroup = () => {
        setOpenGroup(true);
    };

    const handleCloseGroup = () => {
        setGroupName('');
        setSearchValueUsername('');
        setSelectedFriends(arrayUser);
        setSelectedImage();
        setOpenGroup(false);
    };

    const handleFriendRequest = async (id) => {
        try {
            const response = await axios.post(
                'https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/users/addFriendRequest',
                {
                    id_sender: getUser?._id,
                    id_receiver: id,
                },
            );
            if (response.data) {
                socketRef.emit('sendMessage', `${response.data}`);
                toast.success('Add friend request successfully');
            }
        } catch (error) {
            toast.error('Lỗi khi gửi lời mời');
        }
    };
    const normalizePhoneNumber = (phoneNumber) => {
        // Loại bỏ các ký tự không phải là số và các dấu '+' không cần thiết, nhưng giữ lại dấu '+' nếu có ở đầu
        let normalized = phoneNumber.replace(/[^\d+]/g, '');

        // Nếu số không bắt đầu bằng '+84', '84', '0' hoặc '840', trả về chuỗi rỗng
        if (
            !normalized.startsWith('+84') &&
            !normalized.startsWith('84') &&
            !normalized.startsWith('0') &&
            !normalized.startsWith('840')
        ) {
            return '';
        }

        // Nếu số bắt đầu bằng '0', thay thế bằng '+84'
        if (normalized.startsWith('0')) {
            normalized = '+84' + normalized.slice(1);
        } else if (normalized.startsWith('840')) {
            // Nếu số bắt đầu bằng '840', thay thế bằng '+84'
            normalized = '+84' + normalized.slice(3);
        } else if (normalized.startsWith('84')) {
            // Nếu số bắt đầu bằng '84', thêm dấu '+' trước '84'
            normalized = '+84' + normalized.slice(2);
        } else if (normalized.startsWith('+84')) {
            // Nếu số bắt đầu bằng '+84', giữ nguyên
            return normalized;
        }

        return normalized;
    };
    const handleSearch = () => {
        if (!userData) {
            // Kiểm tra nếu dữ liệu người dùng chưa được tải
            toast.error('Dữ liệu người dùng đang được tải. Vui lòng thử lại sau.');
            return;
        }

        if (searchValueUsername.trim() === '') {
            // Kiểm tra nếu trường tìm kiếm trống
            toast.error('Vui lòng nhập tên người dùng để tìm kiếm.');
            return;
        }

        // Lọc danh sách người dùng theo username
        const filteredUsers = userData.filter((user) => {
            const normalizedUserPhone = normalizePhoneNumber(user.username);
            const normalizedSearchPhone = normalizePhoneNumber(searchValueUsername);
            return normalizedUserPhone === normalizedSearchPhone;
        });

        if (filteredUsers.length === 0) {
            // Kiểm tra nếu không tìm thấy kết quả
            toast.error('Không tìm thấy người dùng!');
            return;
        }
        // Lưu dữ liệu người dùng đã lọc vào selectedUser
        setSelectedUser(filteredUsers[0]);

        // Hiển thị kết quả

        // console.log(filteredUsers[0]);
        // Mở modal khi tìm thấy kết quả
        handleOpen();
    };

    const handleSearchButtonClick = () => {
        handleSearch();
    };
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // get list friend
    const fetchFriends = async () => {
        try {
            const response = await axios.get(
                `https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/users/getFriendWithDetails/${getUser?._id}`,
            );

            setListFriend(response.data);
        } catch (error) {}
    };

    useEffect(() => {
        if (searchValueUsernameOrName.length > 0 && listFriend.length > 0) {
            // Hàm kiểm tra xem chuỗi có chứa ký tự số hay không
            const isPhoneNumber = (value) => /\d/.test(value);

            let filteredUsers;

            if (isPhoneNumber(searchValueUsernameOrName)) {
                filteredUsers = listFriend.filter((user) => {
                    const normalizedUserPhone = normalizePhoneNumber(user.username);
                    const normalizedSearchPhone = normalizePhoneNumber(searchValueUsernameOrName);
                    return normalizedUserPhone === normalizedSearchPhone;
                });
            } else {
                // Nếu là tên
                filteredUsers = listFriend.filter((user) =>
                    user.name.toLowerCase().includes(searchValueUsernameOrName.toLowerCase()),
                );
            }

            setListFriend(filteredUsers);
        }
    }, [searchValueUsernameOrName, listFriend]);

    useEffect(() => {
        fetchFriends();
    }, [searchValueUsernameOrName, getUser?._id]);

    const handleCheckboxChange = (friendId) => {
        let updatedSelectedFriends;

        if (selectedFriends.includes(friendId)) {
            updatedSelectedFriends = arrayUser;
            updatedSelectedFriends = selectedFriends.filter((id) => id !== friendId);
        } else {
            updatedSelectedFriends = [...selectedFriends, friendId];
        }

        setSelectedFriends(updatedSelectedFriends);
    };
    // hàm tạo nhóm
    const createConversation = async () => {
        try {
            if (!selectedImage) {
                return toast.error('Chưa chọn ảnh nhóm');
            }
            if (!groupName) {
                return toast.error('Chưa nhập tên nhóm');
            }
            if (selectedFriends.length < 3) {
                return toast.error('Nhóm ít nhất 3 thành viên.');
            }
            setIsLoading(true);
            const formData = new FormData();
            formData.append('image', selectedImage);

            const response = await axios.post(
                'https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/messages/uploadImageToS3',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            );

            if (response.data && response.data.imageUrl) {
                console.log('Image uploaded successfully:', response.data.imageUrl);

                // Tiếp tục tạo cuộc trò chuyện mới với URL ảnh
                const createConversationResponse = await axios.post(
                    'https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/conversation/createConversationWeb',
                    {
                        arrayUserId: selectedFriends,
                        groupImage: response.data.imageUrl, // Sử dụng URL của ảnh đã tải lên S3
                        name: groupName,
                    },
                );
                const conversation = createConversationResponse.data;
                const memberId1 = conversation?.members.find((member) => member.userId?._id === getUser?._id)?._id;
                const myName = getUser?.name;
                await axios.post('api/v1/messages/addMessageWeb', {
                    conversationId: conversation._id,
                    content: `${myName.slice(myName.lastIndexOf(' ') + 1)} đã tạo nhóm`,
                    memberId: memberId1, // Biến memberId của bạn ở đây
                    type: 'notify',
                });

                console.log('Conversation created successfully:', createConversationResponse.data);
                // Xử lý thành công, ví dụ: cập nhật giao diện người dùng
                setUser(createConversationResponse.data);

                socketRef.emit(
                    'sendMessage',
                    `${myName.slice(myName.lastIndexOf(' ') + 1)} đã tạo nhóm ${conversation._id}`,
                );
                handleCloseGroup();
                setIsLoading(false);
                navigate(config.routes.home);
            } else {
                console.error('Failed to upload image:', response.data);
            }
        } catch (error) {
            console.error('Error handling upload and creating conversation:', error);
        }
    };

    const handleGroupNameChange = (event) => {
        setGroupName(event.target.value); // Cập nhật giá trị của groupName khi người dùng nhập vào
    };

    const handleFormSubmit = (event) => {
        event.preventDefault(); // Ngăn chặn form submit lại trang

        // Xử lý logic khi form được submit, có thể sử dụng giá trị của groupName ở đây
    };

    const handleInfoClick = (friend) => {
        // Khi người dùng nhấp vào phần 'info', thay đổi trạng thái của checkbox
        handleCheckboxChange(friend);
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('search')}>
                <Toaster toastOptions={{ duration: 2000 }} />
                <button className={cx('icon-search')}>
                    <FontAwesomeIcon icon={faMagnifyingGlassPlus} />
                </button>

                <Tippy
                    content={
                        <div className={cx('tippy-content')}>
                            {searchResult.map((conversation) => (
                                <div key={conversation._id} className={cx('search-item')}>
                                    <p>{conversation.name}</p>
                                </div>
                            ))}
                        </div>
                    }
                    visible={!!searchValue && searchResult.length > 0}
                    interactive={true}
                    interactiveBorder={10}
                >
                    <input
                        ref={inputRef}
                        value={searchValue}
                        placeholder="Tìm kiếm"
                        onChange={handleChange}
                        onFocus={() => setSearchValue('')}
                    />
                </Tippy>
                {!!searchValue && (
                    <button className={cx('icon-clear')}>
                        <FontAwesomeIcon icon={faCircleXmark} onClick={handleClear} />
                    </button>
                )}
            </div>
            <div className={cx('list-icon')}>
                {/* tìm kiếm người dùng */}
                <button className={cx('icon')} onClick={handalAddFriend}>
                    {' '}
                    {/* Sự kiện khi click vào button faUserPlus */}
                    <img src={iconUser} alt="icon" />
                </button>
                {/* Tạo nhóm */}
                <button className={cx('icon')} onClick={handleOpenGroup}>
                    <img src={iconGroup} alt="icon" />
                </button>
            </div>
            {/* Model Tìm kiếm bạn bè */}
            <Modal
                open={openAddFriend}
                onClose={handleCloseAddFriend}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className={cx('model-container-add')}>
                    <div id="modal-modal-title" className={cx('model-title')}>
                        <h1 className={cx('model-title-add')}>Thêm bạn bè</h1>
                        <div className={cx('model-search')}>
                            <PhoneInput
                                country={'vn'}
                                value={searchValueUsername}
                                onChange={handleChangeUser}
                                onKeyDown={handleKeyPress}
                                fullWidth
                            />

                            <button className={cx('icon-search1')} onClick={handleSearchButtonClick}>
                                <FontAwesomeIcon icon={faMagnifyingGlass} />
                            </button>
                        </div>

                        <div className={cx('bnt-search-add')}>
                            <input
                                type="button"
                                className={cx('bnt-exit')}
                                style={{ backgroundColor: '#ccc', color: 'black', marginRight: '10px' }}
                                onClick={handleCloseAddFriend}
                                value={'Hủy'}
                            ></input>
                            <input
                                type="button"
                                className={cx('bnt-exit')}
                                onClick={handleSearchButtonClick}
                                value={'Tìm kiếm'}
                            ></input>
                        </div>
                    </div>
                </Box>
            </Modal>
            {/* Model Thông tin tài khoản */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className={cx('model-container')}>
                    {selectedUser && (
                        <div id="modal-modal-title" className={cx('model-title')}>
                            <h1 className={cx('model-title')}>Thông tin tài khoản</h1>
                            <img
                                className={cx('model-img')}
                                src={
                                    selectedUser.avatar
                                        ? selectedUser.avatar
                                        : 'https://image666666.s3.ap-southeast-1.amazonaws.com/no-image.png'
                                }
                                alt={selectedUser.name}
                            />
                            <div className={cx('model-nav')}>
                                <img
                                    className={cx('model-avatar')}
                                    src={
                                        selectedUser.avatar
                                            ? selectedUser.avatar
                                            : 'https://image666666.s3.ap-southeast-1.amazonaws.com/no-image.png'
                                    }
                                    alt={selectedUser.name}
                                />

                                <form>
                                    <label htmlFor="imageInput">
                                        <div className={cx('model-icon')}>
                                            <FontAwesomeIcon icon={faCamera} />
                                        </div>
                                        <input
                                            className={cx('imageInput')}
                                            id="imageInput"
                                            type="file"
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                        />
                                    </label>
                                </form>

                                <h1 className={cx('model-nav-name')}>{selectedUser.name}</h1>
                                <button className={cx('model-nav-icon2')}>
                                    <FontAwesomeIcon icon={faEdit} />
                                </button>
                            </div>
                            <div className={cx('div-null')}></div>

                            <div className={cx('model-bottom')}>
                                <h1 className={cx('model-title')}>Thông tin cá nhân</h1>

                                <div className={cx('model-info')}>
                                    <p>Giới tính</p>
                                    <span>{selectedUser.gender}</span>
                                </div>
                                <div className={cx('model-info')}>
                                    <p>Ngày sinh</p>
                                    <span>{formatDate(selectedUser.dateofbirth)}</span>
                                </div>

                                <div className={cx('model-info')}>
                                    <p>Điện thoại</p>
                                    {getUser?._id === selectedUser?._id ||
                                    listFriend.filter((friend) => friend._id === selectedUser?._id).length > 0 ? (
                                        <span>{selectedUser.username}</span>
                                    ) : (
                                        <span>***</span>
                                    )}
                                </div>
                            </div>
                            <span className={cx('model-line')}>
                                Chỉ bạn bè có lưu số của bạn trong danh bạ mới xem được số này
                            </span>

                            {getUser?._id === selectedUser?._id && (
                                <button className={cx('btn-add-friend')}>Cá nhân</button>
                            )}

                            {listFriend.filter((friend) => friend._id === selectedUser?._id).length === 0 &&
                                getUser?._id !== selectedUser?._id && (
                                    <button
                                        onClick={() => {
                                            handleFriendRequest(selectedUser?._id);
                                        }}
                                        className={cx('btn-add-friend')}
                                    >
                                        Thêm bạn bè
                                    </button>
                                )}

                            {listFriend.filter((friend) => friend._id === selectedUser?._id).length > 0 &&
                                getUser?._id !== selectedUser?._id && (
                                    <div className={cx('btn-friend')}>
                                        <button className={cx('bnt-exit')} onClick={handleChat}>
                                            Nhắn tin
                                        </button>

                                        <button
                                            className={cx('bnt-exit')}
                                            style={{ backgroundColor: '#ccc', color: 'black', marginRight: '10px' }}
                                        >
                                            Bạn bè
                                        </button>
                                    </div>
                                )}
                        </div>
                    )}
                </Box>
            </Modal>
            {/* Modal tạo nhóm */}
            <Modal
                open={openGroup}
                onClose={() => {
                    // Đặt lại các giá trị khi đóng modal

                    handleCloseGroup();
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className={cx('model-container-group')}>
                    <h1 className={cx('h1-group')}>Tạo nhóm</h1>
                    <div id="modal-modal-title" className={cx('model-title')}>
                        <div className={cx('model-nav')}>
                            {selectedImage ? (
                                <img
                                    className={cx('model-avatar')}
                                    src={URL.createObjectURL(selectedImage)}
                                    alt="Selected"
                                />
                            ) : (
                                <div className={cx('model-avatar')}>
                                    <span className={cx('text-avatar')}>Ảnh nhóm </span>
                                </div>
                            )}

                            <form>
                                <label htmlFor="imageGroup">
                                    <div className={cx('model-icon')}>
                                        <FontAwesomeIcon icon={faCamera} />
                                    </div>
                                    <input
                                        className={cx('imageInput')}
                                        id="imageGroup"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                            </form>
                            <form onSubmit={handleFormSubmit}>
                                <input
                                    className={cx('group-name')}
                                    placeholder="Nhập tên nhóm"
                                    value={groupName}
                                    onChange={handleGroupNameChange}
                                />
                            </form>
                        </div>
                        <div className={cx('model-search')}>
                            <input
                                className={cx('search-group')}
                                placeholder="Nhập tên hoặc số điện thoại"
                                value={searchValueUsernameOrName}
                                onChange={handleChangeUserGroup}
                                onKeyPress={handleKeyPress}
                            />
                        </div>
                        <div className={cx('list-friend')}>
                            <div className={cx('container')}>
                                <span>Danh sách bạn bè</span>
                                {listFriend.map((friend) => (
                                    <div key={friend._id} className={cx('friend-item')}>
                                        <div
                                            className={cx('info')}
                                            onClick={() => {
                                                handleInfoClick(friend._id);
                                            }}
                                        >
                                            <input
                                                className={cx('check-box')}
                                                type="checkbox"
                                                checked={selectedFriends.includes(friend._id)}
                                                // onChange={() => {
                                                //     handleInfoClick(friend._id);
                                                // }}
                                            />
                                            <img className={cx('user-avatar')} src={friend.avatar} alt={friend.name} />
                                            <h3 className={cx('info-item')}>{friend.name}</h3>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className={cx('create-group')}>
                        <input
                            type="button"
                            className={cx('bnt-exit')}
                            value={'Hủy'}
                            onClick={handleCloseGroup}
                            style={{ backgroundColor: '#ccc', color: 'black' }}
                        />
                        <div
                            className={cx('bnt-create')}
                            onClick={createConversation}
                            style={{ opacity: isDisabled ? 0.5 : 1 }}
                            disabled={isDisabled}
                        >
                            <input type="button" className={cx('bnt-tao')} value={'Tạo nhóm'} />
                            {isLoading && (
                                <CgSpinner
                                    className={cx('spinner-icon')}
                                    style={{ opacity: isDisabled ? 0.5 : 1 }}
                                    disabled={isDisabled}
                                />
                            )}
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}

export default Search;
