import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import { toast, Toaster } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { createAxios } from '~/createInstance';
import { logOutSuccess } from '~/redux/authSlice';
import { logOut } from '~/redux/apiRequest';

import { faBell, faEdit, faIdBadge, faMessage, faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import {
    faArrowsRotate,
    faBriefcase,
    faCamera,
    faCloud,
    faCommentDots,
    faGear,
    faLock,
    faSliders,
    faSquareCheck,
} from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';
import config from '~/config';
import axios from 'axios';
import { TextField } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getUserLogin, getSocketConnection } from '~/redux/apiRequest';

const cx = classNames.bind(styles);

function Header() {
    const [open, setOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    // const { user } =  useContext(UserContext);
    const user1 = useSelector((state) => state.auth.login?.currentUser);
    const user2 = useSelector((state) => state.users.users?.currentUser);
    const [userAvatar, setUserAvatar] = useState(user1?.user.avatar);
    const [openSetting, setOpenSetting] = useState(false);
    const [openChangePassword, setOpenChangePassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const location = useLocation();

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
        if (normalized.startsWith('+84')) {
            normalized = '0' + normalized.slice(3);
            return normalized;
        }

        return normalized;
    };

    // const getUser = useSelector((state) => state.users.users?.currentUser);
    const dispatch = useDispatch();
    const getUser = user1?.user;
    const socketRef = useSelector((state) => state.socket?.currentSocket);
    const isContactRequest =
        location.pathname === '/contactRequest' ||
        location.pathname === '/contactListFriend' ||
        location.pathname === '/contactListGroup';
    const isIndex = location.pathname === '/';

    useEffect(() => {
        getSocketConnection(dispatch);

        return () => {
            if (socketRef) {
                socketRef.disconnect();
            }
        };
    }, [getUser]);

    useEffect(() => {
        getSocketConnection(dispatch);
    }, [dispatch]);

    const navigate = useNavigate();
    const id = getUser?._id;
    const accessToken = user1?.accessToken;
    let axiosJWT = createAxios(user1, dispatch, logOutSuccess);

    const handleLogout1 = () => {
        logOut(dispatch, id, navigate, accessToken, axiosJWT);
    };
    const handleOpen = () => {
        setShowTippy(false);
        setOpen(true); // Tắt Tippy khi mở Modal
    };
    const handleClose = () => setOpen(false);

    const [showTippy, setShowTippy] = useState(false);
    const toggleTippy = () => {
        setShowTippy(!showTippy);
    };

    const handleCurrentPasswordChange = (event) => setCurrentPassword(event.target.value);
    const handleNewPasswordChange = (event) => setNewPassword(event.target.value);
    const handleConfirmPasswordChange = (event) => setConfirmPassword(event.target.value);
    const [activeSetting, setActiveSetting] = useState(null);

    const handleSubmit = async () => {
        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

        if (!currentPassword) {
            toast.error('Vui lòng nhập mật khẩu cũ!');
            return;
        }

        if (!newPassword) {
            toast.error('Vui lòng nhập mật khẩu mới!');
            return;
        }

        if (newPassword.length < 8) {
            toast.error('Mật khẩu tối thiểu 8 ký tự');
            return;
        }

        if (!passRegex.test(newPassword)) {
            toast.error('Mật khẩu ít nhất một chữ cái thường,hoa và một số!');
            return;
        }
        if (newPassword !== confirmPassword) {
            // Hiển thị thông báo lỗi
            toast.error('Xác nhận mật khẩu không khớp!');
            return;
        }

        try {
            const response = await axios.post('api/v1/users/changePassword', {
                username: getUser.username,
                passwordOld: currentPassword,
                passwordNew: newPassword,
            });

            // Xử lý phản hồi từ API
            console.log(response.data.message);
            toast.success('Đổi mật khẩu thành công');

            // Đóng modal
            handleLogout1();
        } catch (error) {
            if (error.response && error.response.status === 401) {
                toast.error('Mật khẩu cũ không đúng!');
            } else {
                console.error('Error updating password:', error.response.data.error);
            }
        }
    };

    const handleOpenSetting = () => {
        setShowTippy(false);
        setOpenSetting(true); // Tắt Tippy khi mở Modal
    };
    const handleOpenChangePassword = () => {
        setOpenChangePassword(true);
    };
    const handleCloseChangePassword = () => {
        setOpenChangePassword(false);
    };

    const handleSettingClick = (setting) => {
        setActiveSetting(setting);
    };

    const handleCloseSetting = () => {
        setActiveSetting(null);
        setOpenSetting(false);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Hàm xử lý khi người dùng chọn ảnh
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        console.log(file);
        setSelectedImage(file);
    };

    const handleUpdateAvatar = async () => {
        try {
            const formData = new FormData();
            formData.append('avatar', selectedImage);
            formData.append('username', getUser.username);

            const response = await axios.post('api/v1/users/upload-avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setUserAvatar(response.data.user.avatar);

            getUserLogin(user1?.accessToken, dispatch, response.data.user._id, axiosJWT);
            setOpen(false);

            // Cập nhật UI hoặc thực hiện các hành động khác sau khi cập nhật thành công
        } catch (error) {
            console.error('Error updating avatar:', error);
            // Xử lý lỗi nếu có
        }
    };

    return (
        <header className={cx('wrapper')}>
            <Toaster toastOptions={{ duration: 2000 }} />
            <div>
                <Button onClick={toggleTippy}>
                    <Tippy
                        content={
                            <div
                                className={cx('tippy-container')}
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                            >
                                <h1 className={cx('tippy-name')}>{getUser ? getUser.name : 'Vui lòng đăng nhập'}</h1>
                                <p className={cx('tippy-p')}>Nâng cấp tài khoản</p>
                                <p className={cx('tippy-p')} onClick={handleOpen}>
                                    Hồ sơ cá nhân
                                </p>
                                <p className={cx('tippy-p1')} onClick={handleOpenSetting}>
                                    Cài đặt
                                </p>
                                <p className={cx('tippy-p2')}></p>
                                <p className={cx('tippy-p')} onClick={handleLogout1}>
                                    Đăng xuất
                                </p>
                            </div>
                        }
                        visible={showTippy}
                        onClickOutside={() => setShowTippy(false)}
                        placement="right"
                        className={cx('tippy')}
                        interactive={true}
                    >
                        <div className={cx('nav1')}>
                            <img className={cx('user-avatar')} src={user2?.avatar} alt="avatar" />
                        </div>
                    </Tippy>
                </Button>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box className={cx('model-container')}>
                        <div id="modal-modal-title" className={cx('model-title')}>
                            <h1 className={cx('model-title')}>Thông tin tài khoản</h1>
                            <img className={cx('model-img')} src={user2?.avatar} alt="Cao Trùng Dương" />
                            <div className={cx('model-nav')}>
                                {selectedImage ? (
                                    <img
                                        className={cx('model-avatar')}
                                        src={URL.createObjectURL(selectedImage)}
                                        alt="Selected"
                                    />
                                ) : (
                                    <img className={cx('model-avatar')} src={user2?.avatar} alt="Cao Trùng Dương" />
                                )}

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
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                </form>

                                <h1 className={cx('model-nav-name')}>{getUser ? getUser.name : ''}</h1>
                                <button className={cx('model-nav-icon2')}>
                                    <FontAwesomeIcon icon={faEdit} />
                                </button>
                            </div>
                            <div className={cx('div-null')}></div>

                            <div className={cx('model-bottom')}>
                                <h1 className={cx('model-title')}>Thông tin cá nhân</h1>
                                <div className={cx('model-info')}>
                                    <p>Giới tính</p>
                                    <span>{getUser ? getUser.gender : ''}</span>
                                </div>

                                <div className={cx('model-info')}>
                                    <p>Ngày sinh</p>
                                    <span>{getUser ? formatDate(getUser.dateofbirth) : ''}</span>
                                </div>
                                <div className={cx('model-info')}>
                                    <p>Điện thoại</p>
                                    <span>{getUser ? normalizePhoneNumber(getUser.username) : ''}</span>
                                </div>
                            </div>
                            <span className={cx('model-line')}>
                                Chỉ bạn bè có lưu số của bạn trong danh bạ mới xem được số này
                            </span>

                            <button className={cx('model-btn')} onClick={handleUpdateAvatar}>
                                <FontAwesomeIcon icon={faEdit} className={cx('model-nav-icon2')} />
                                Cập nhật
                            </button>
                        </div>
                    </Box>
                </Modal>

                <Modal
                    open={openSetting}
                    onClose={handleCloseSetting}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box className={cx('modal-setting')}>
                        <div variant="h4" className={cx('header-setting')}>
                            <h1 className={cx('modal-setting-title')}>Cài đặt</h1>
                            <div className={cx('options')}>
                                <Box onClick={() => handleSettingClick('total')} className={cx('options-tab')}>
                                    <FontAwesomeIcon icon={faGear} className={cx('icon')} /> Cài đặt chung
                                </Box>
                                <Box onClick={() => handleSettingClick('security')} className={cx('options-tab')}>
                                    <FontAwesomeIcon icon={faLock} className={cx('icon')} /> Riêng tư & bảo mật
                                </Box>
                                <Box
                                    onClick={() => handleSettingClick('storage')}
                                    className={cx('options-tab')}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <FontAwesomeIcon icon={faArrowsRotate} className={cx('icon')} /> Đồng bộ tin nhắn
                                </Box>
                                <Box
                                    onClick={() => handleSettingClick('personalInfo')}
                                    className={cx('options-tab')}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <FontAwesomeIcon icon={faPenToSquare} className={cx('icon')} /> Giao diện
                                </Box>
                                <Box
                                    onClick={() => handleSettingClick('personalInfo')}
                                    className={cx('options-tab')}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <FontAwesomeIcon icon={faBell} className={cx('icon')} /> Thông báo
                                </Box>
                                <Box
                                    onClick={() => handleSettingClick('personalInfo')}
                                    className={cx('options-tab')}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <FontAwesomeIcon icon={faMessage} className={cx('icon')} /> Tin nhắn
                                </Box>
                                <Box
                                    onClick={() => handleSettingClick('personalInfo')}
                                    className={cx('options-tab')}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <FontAwesomeIcon icon={faSliders} className={cx('icon')} />
                                    Tiện ích
                                </Box>
                            </div>
                        </div>

                        <div className={cx('divider')}></div>

                        <Box className={cx('modal-right')}>
                            {activeSetting === 'security' && (
                                <>
                                    <div className={cx('modal-childsetting-tiltle')}>
                                        <h1> Mật khẩu đăng nhập</h1>
                                        <button onClick={handleOpenChangePassword} className={cx('btn-resetmk')}>
                                            Đổi mật khẩu
                                        </button>
                                        <div className={cx('div-nul1')}></div>
                                    </div>
                                </>
                            )}
                            {activeSetting === 'total' && (
                                <>
                                    <div className={cx('modal-childsetting-tiltle')}>
                                        <h1>Danh bạ</h1>
                                        <h2>Danh sách bạn bè được hiển thị trong danh bạ</h2>
                                        <label className={cx('option-checkbox')}>
                                            <div className={cx('div-checkbox')}>
                                                <input type="checkbox" />
                                                <span>Hiển thị tất cả bạn bè</span>
                                            </div>
                                            <div className={cx('div-checkbox')}>
                                                <input type="checkbox" />
                                                <span>Chỉ hiển thị bạn bè đang sử dụng zalo</span>
                                            </div>
                                        </label>
                                    </div>
                                </>
                            )}
                        </Box>
                    </Box>
                </Modal>

                <Modal
                    open={openChangePassword}
                    onClose={handleCloseChangePassword}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box className={cx('model-changepass-container')}>
                        <div id="modal-modal-title" className={cx('model-title')}>
                            <h1 className={cx('model-title')}>Tạo mật khẩu mới</h1>
                            <h5>
                                Lưu ý: Mật khẩu bao gồm chữ kèm theo số hoặc ký tự đặc biệt, tối thiểu 8 ký tự trở lên{' '}
                                và tối đa 32 ký tự
                            </h5>
                            <TextField
                                className={cx('TextField')}
                                label="Mật khẩu cũ"
                                type="password"
                                value={currentPassword}
                                onChange={handleCurrentPasswordChange}
                                margin="normal"
                                fullWidth
                                InputLabelProps={{
                                    style: { fontSize: 15 },
                                }}
                            />
                            <TextField
                                className={cx('TextField')}
                                label="Mật khẩu mới"
                                type="password"
                                value={newPassword}
                                onChange={handleNewPasswordChange}
                                margin="normal"
                                fullWidth
                                InputLabelProps={{
                                    style: { fontSize: 15 },
                                }}
                            />
                            <TextField
                                className={cx('TextField')}
                                label="Xác nhận mật khẩu mới"
                                type="password"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                margin="normal"
                                fullWidth
                                InputLabelProps={{
                                    style: { fontSize: 15 },
                                }}
                            />
                            <button onClick={handleSubmit} variant="contained" className={cx('Button-update')}>
                                Cập nhật
                            </button>
                            <button
                                onClick={handleCloseChangePassword}
                                variant="contained"
                                className={cx('Button-cancel')}
                            >
                                Hủy
                            </button>
                        </div>
                    </Box>
                </Modal>
            </div>
            <div className={cx('top')}>
                <Link to={config.routes.home}>
                    <button className={cx('icon-top', { active: isIndex })}>
                        <FontAwesomeIcon icon={faCommentDots} size="2x" style={{ color: 'white' }} />
                    </button>
                </Link>
                <Link to={config.routes.contactRequest}>
                    <button className={cx('icon-top', { active: isContactRequest })}>
                        <FontAwesomeIcon icon={faIdBadge} size="2x" style={{ color: 'white' }} />
                    </button>
                </Link>
                <button className={cx('icon-top')}>
                    <FontAwesomeIcon icon={faSquareCheck} size="2x" style={{ color: 'white' }} />
                </button>
            </div>

            <div className={cx('bottom')}>
                <button className={cx('icon-bottom')}>
                    <FontAwesomeIcon icon={faCloud} size="2x" style={{ color: 'white' }} />
                </button>

                <button className={cx('icon-bottom')}>
                    <FontAwesomeIcon icon={faBriefcase} size="2x" style={{ color: 'white' }} />
                </button>

                <button className={cx('icon-bottom')}>
                    <FontAwesomeIcon icon={faGear} size="2x" style={{ color: 'white' }} />
                </button>
            </div>
        </header>
    );
}

export default Header;
