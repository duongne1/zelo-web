import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { Box, Tab } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import image1 from '~/assets/slider1.png';
import image2 from '~/assets/slide2.png';
import image3 from '~/assets/slider3.png';
import image4 from '~/assets/slide4.png';
import image5 from '~/assets/slide5.png';
import iconSearch from '~/assets/search.png';
import iconTim from '~/assets/thumbs-up.png';
import iconSmile from '~/assets/smile.png';
import iconVideo from '~/assets/video.png';
import iconUser1 from '~/assets/user.png';
import iconWow from '~/assets/wow.png';
import iconSad from '~/assets/sad.png';
import iconAngry from '~/assets/angry.png';
import iconGroup from '~/assets/add-group.png';
import iconTab from '~/assets/menu.png';
import iconLike from '~/assets/like.png';
import Modal from '@mui/material/Modal';
import image6 from '~/assets/slide6.png';
import image7 from '~/assets/slide7.png';
import { useDispatch, useSelector } from 'react-redux';
import { getUserLogin, getSocketConnection } from '~/redux/apiRequest';
import {
    faAddressCard,
    faAngleLeft,
    faAngleRight,
    faBell,
    faCaretDown,
    faChevronLeft,
    faClock,
    faClose,
    faEllipsis,
    faExclamation,
    faEyeSlash,
    faFaceSmile,
    faFileCsv,
    faFont,
    faGear,
    faLink,
    faPaperclip,
    faPencil,
    faRightFromBracket,
    faRotateBack,
    faShare,
    faSquareCheck,
    faThumbTack,
    faThumbsUp,
    faTrash,
    faUsers,
    faFilePdf,
    faXmark,
    faFileVideo,
    faFilePowerpoint,
    faFileAudio,
    faQuoteRight,
    faMessage,
    faThumbtack,
    faCaretUp,
    faFileWord,
} from '@fortawesome/free-solid-svg-icons';
import { faCircleXmark, faCopy, faImage, faNoteSticky, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import Tippy from '@tippyjs/react';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { useNavigate } from 'react-router-dom';
import config from '~/config';
import axios from 'axios';
import { createAxios } from '~/createInstance';
import { loginSuccess } from '~/redux/authSlice';
import Lightbox from 'react-image-lightbox';
import { toast, Toaster } from 'react-hot-toast';
import { TabContext, TabList, TabPanel } from '@mui/lab';
const cx = classNames.bind(styles);

const buttonsData = [
    { icon: faFaceSmile, content: 'Gửi Sticker' },
    { icon: faImage, content: 'Gửi hình ảnh' },
    { icon: faPaperclip, content: 'Đính kèm file' },
    { icon: faFileVideo, content: 'Gửi video' },
    { icon: faAddressCard, content: 'Gửi danh thiếp' },
    { icon: faClock, content: 'Tạo hẹn giờ' },
    { icon: faSquareCheck, content: 'Giao việc' },
    { icon: faFont, content: 'Đinh dạng tin nhắn (Ctrl + Shift + X)' },
    { icon: faExclamation, content: 'Tin nhắn ưu tiên' },
];

const buttonsData1 = [
    { icon: iconGroup, content: 'Thêm bạn vào nhóm' },
    { icon: iconSearch, content: 'Tìm kiếm tin nhắn' },
    { icon: iconVideo, content: 'Cuộc gọi video' },
    { icon: iconTab, content: 'Thông tin hội thoại' },
];

// Rest of your component code

function Home({ selectedChatItem }) {
    const socketRef = useSelector((state) => state.socket?.currentSocket);
    const pickerRef = useRef(null);
    const messageContainerRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.login?.currentUser);
    const [chatItem, setChatItem] = useState(selectedChatItem);
    const [conversationId, setConversationId] = useState('');
    // const [newMessage, setNewMessage] = useState('');
    const [showPicker1, setShowPicker1] = useState(false);
    const [showPicker, setShowPicker] = useState(false);
    const [messageRender, setmessageRender] = useState(null);
    let axiosJWT = createAxios(user, dispatch, loginSuccess);
    const getUser = useSelector((state) => state.users.users?.currentUser);
    const [modalImgOpen, setImgModalOpen] = useState(false);
    const [messageReaction, setMessageReaction] = useState([]);
    const [conversationAll, setConversationAll] = useState(null);
    const setSelectedMessageInfo = useState(null);
    const [openGroup, setOpenGroup] = useState(false);
    const [searchValueUsername, setSearchValueUsername] = useState('');
    const [clickIconAll, setClickIconAll] = useState(true);
    const [clickIcon, setClickIcon] = useState(false);
    const [selectIcon, setSelectIcon] = useState(null);

    const [openModalAddUser, setOpenModalAddUser] = useState(false);
    const [listFriend, setListFriend] = useState([]);
    const [arrayUser, setArrayUser] = useState([]);
    const [selectedFriends, setSelectedFriends] = useState(arrayUser);
    const [arrayAllPin, setArrayAllPin] = useState([]);
    const [array, setArray] = useState([]);
    const arrayNewFriends = useState([]);
    const isDisabled = array.length === 0;
    const [openChiaSe, setOpenChiaSe] = useState(false);

    const [isOpen, setIsOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);
    const getUserName = getUser?.name.slice(getUser?.name.lastIndexOf(' ') + 1);

    const [value, setValue] = useState('1');
    const [isInfoVisible, setIsInfoVisible] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [isDeputy, setIsDeputy] = useState(false);
    const [isMember, setIsMember] = useState(false);
    const [isLeader, setIsLeader] = useState(false);
    const [isDeputyLogin, setIsDeputyLogin] = useState(false);
    const [openXacNhan, setOpenXacNhan] = useState(false);
    const [openReaction, setOpenReaction] = useState(false);
    const [openGhim, setOpenGhim] = useState(false);
    const [openChiTietImage, setOpenChiTietImage] = useState(false);
    const [openUpdateName, setOpenUpdateName] = useState(false);
    const [nameConversation, setNameConversation] = useState(chatItem?.name);
    const selectConversationsByID = useSelector((state) => state.conversations?.currentConversationById);
    const inputRef = useRef(null);
    const [showReply, setShowReply] = useState(false);
    const [messageReply, setMessageReply] = useState(null);
    const contentRef = useRef(null);

    useEffect(() => {
        if (selectConversationsByID) {
            setChatItem(selectConversationsByID);
        }
    }, [selectConversationsByID]);
    const handleInputUpdateName = (event) => {
        setNameConversation(event.target.value);
    };
    const handleOpenUpdateNameConversation = () => setOpenUpdateName(true);
    const handleCloseUpdateNameConversation = () => {
        setOpenUpdateName(false);
        setNameConversation(chatItem?.name);
    };
    const handleOpenXacNhan = () => setOpenXacNhan(true);
    const handleCloseXacNhan = () => setOpenXacNhan(false);

    const handleOpenReaction = (message) => {
        setOpenReaction(true);
        setMessageReaction(message);
        setClickIconAll(true);
    };

    const handleCloseReaction = () => {
        setOpenReaction(false);
        setSelectIcon(null);
        setClickIcon(false);
    };

    const handleOpenGhim = () => setOpenGhim(true);
    const handleCloseGhim = () => setOpenGhim(false);

    const handleOpenChiTietImage = () => setOpenChiTietImage(true);
    const handleCloseChiTietImage = () => setOpenChiTietImage(false);

    const openLightbox = (index, imageUrl) => {
        setCurrentImage(imageUrl);
        setIsOpen(true);
    };

    const closeLightbox = () => {
        setIsOpen(false);
    };
    const handleCloseModalAddUser = () => {
        setSearchValueUsername('');
        setOpenModalAddUser(false);
        setSelectedFriends(arrayUser);
        setArray([]);
    };

    const handleIconClick = (typeReaction, index) => {
        setSelectIcon(typeReaction);
        setClickIconAll(false);
        setClickIcon(true);
    };

    const handleInfoClick = (userID) => {
        handleCheckboxChange(userID);
    };
    const handleOpenModalAddUser = () => {
        setOpenModalAddUser(true);
    };
    const handleCheckboxChange = (friendId) => {
        let updatedSelectedFriends;

        if (selectedFriends.includes(friendId)) {
            updatedSelectedFriends = arrayNewFriends;
            setArray([]);
            // Nếu friendId đã được chọn, loại bỏ nó khỏi danh sách
            updatedSelectedFriends = selectedFriends.filter((id) => id !== friendId);
        } else {
            // Nếu friendId chưa được chọn, thêm nó vào danh sách
            updatedSelectedFriends = [...selectedFriends, friendId];
            setArray([friendId]);
        }

        setSelectedFriends(updatedSelectedFriends);
        // setArray(updatedSelectedFriends);
    };

    const fetchArrayUser = async () => {
        try {
            if (chatItem?._id) {
                const response = await axios.get(
                    `https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/conversation/getArrayUserConversationUsers/${chatItem?._id}`,
                );
                console.log('arrayuser', response.data);
                setArrayUser(response.data);
                setSelectedFriends(response.data);
            }
        } catch (error) {
            console.error('Error fetching friends:', error);
        }
    };

    useEffect(() => {
        if (selectedChatItem) fetchArrayUser();
    }, [selectedChatItem]);

    useEffect(() => {
        fetchFriends();
    }, [searchValueUsername]);

    const normalizePhoneNumber = (phoneNumber) => {
        // Loại bỏ các ký tự không phải là số và các dấu '+' không cần thiết
        let normalized = phoneNumber.replace(/[^0-9]/g, '');

        // Nếu số không bắt đầu bằng '+84', '84' hoặc '0', trả về chuỗi rỗng
        if (!normalized.startsWith('+84') && !normalized.startsWith('84') && !normalized.startsWith('0')) {
            return '';
        }

        // Nếu số bắt đầu bằng '0', thay thế bằng '84'
        if (normalized.startsWith('0')) {
            normalized = '84' + normalized.slice(1);
        } else if (normalized.startsWith('840')) {
            // Nếu số bắt đầu bằng '840', thay thế bằng '84'
            normalized = '84' + normalized.slice(3);
        }

        return normalized;
    };
    const fetchFriends = async () => {
        try {
            const response = await axios.get(
                `https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/users/getFriendWithDetails/${getUser?._id}`,
            );
            // if (searchValueUsername.length > 1) {
            //     const filteredUsers = response.data.filter((user) => {
            //         const normalizedUserPhone = normalizePhoneNumber(user.username);
            //         const normalizedSearchPhone = normalizePhoneNumber(searchValueUsername);
            //         return normalizedUserPhone === normalizedSearchPhone;
            //     });

            //     setListFriend(filteredUsers);
            //     return;
            // }

            if (searchValueUsername.length > 0) {
                // Hàm kiểm tra xem chuỗi có chứa ký tự số hay không
                const isPhoneNumber = (value) => /\d/.test(value);

                let filteredUsers;

                if (isPhoneNumber(searchValueUsername)) {
                    filteredUsers = listFriend.filter((user) => {
                        const normalizedUserPhone = normalizePhoneNumber(user.username);
                        const normalizedSearchPhone = normalizePhoneNumber(searchValueUsername);
                        return normalizedUserPhone === normalizedSearchPhone;
                    });
                } else {
                    // Nếu là tên
                    filteredUsers = response.data.filter((user) =>
                        user.name.toLowerCase().includes(searchValueUsername.toLowerCase()),
                    );
                }

                setListFriend(filteredUsers);
            } else {
                setListFriend(response.data);
            }
        } catch (error) {
            console.error('Error fetching friends:', error);
        }
    };

    useEffect(() => {
        if (getUser) {
            fetchFriends();
            getConversationByUserId();
        }
    }, [getUser]);

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

    useEffect(() => {
        if (socketRef && chatItem) {
            const roomId = chatItem._id;
            const userId = getUser?._id;

            socketRef.emit('joinRoom', { roomId, userId });
        }
    }, [chatItem, getUser]);

    useEffect(() => {
        // Đảm bảo tồn tại tham chiếu và phần tử DOM
        if (messageContainerRef.current && chatItem && chatItem.messages) {
            // Lấy đối tượng DOM
            const messageContainer = messageContainerRef.current;
            // Cuộn đến tin nhắn cuối cùng
            messageContainer.scrollTop = messageContainer.scrollHeight;
        }
    }, [chatItem]);

    const memberId = chatItem?.members.find((member) => member.userId?._id === getUser?._id)?._id;

    useEffect(() => {
        if (!user || !user.accessToken) {
            navigate(config.routes.login);
        } else {
            const userId = user.user?._id;
            if (userId) {
                getUserLogin(user?.accessToken, dispatch, userId, axiosJWT);
            }
        }
    }, [user]);

    // add emoji
    const addEmoji = (emoji) => {
        const sym = emoji.unified.split('_');
        const codeArray = [];
        sym.forEach((el) => codeArray.push(parseInt(el, 16)));
        let emojiString = String.fromCodePoint(...codeArray);
        if (inputRef.current) {
            inputRef.current.value += emojiString;
        }
    };

    const togglePicker = () => {
        setShowPicker(!showPicker);
        setShowPicker1(false);
    };

    const togglePicker1 = () => {
        setShowPicker1(!showPicker1);
        setShowPicker(false);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            if (showReply) {
                addReply();
                return;
            }
            sendNewMessageToServer();
        }
    };

    useEffect(() => {
        if (selectedChatItem) {
            setChatItem(selectedChatItem);
            setNameConversation(selectedChatItem.name);
        }
    }, [selectedChatItem]);

    useEffect(() => {
        if (chatItem && chatItem._id) {
            setConversationId(chatItem._id);
            socketRef.on('message', (message) => {
                setmessageRender(message);
                return () => {
                    if (socketRef) {
                        socketRef.disconnect();
                    }
                };
            });
        }

        setShowTippy(false);
        setShowReply(false);
        setOpenChiTietImage(false);
        fetchAllPin();
        setOpenGhim(false);
    }, [chatItem]);

    const fetchAllPin = async () => {
        try {
            if (chatItem?._id) {
                const response = await axios.post(
                    'https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/messages/getAllPinMessages',
                    {
                        conversationId: chatItem?._id,
                    },
                );

                if (response.data) {
                    setArrayAllPin(response.data);
                }
            }
        } catch (error) {
            // Xử lý lỗi nếu có
            console.error('Error pinning message:', error);
        }
    };
    useEffect(() => {
        if (chatItem === null) {
            setChatItem(null);
        }
        if (messageRender && chatItem !== null) {
            fetchConversations();
            fetchArrayUser();
        }
    }, [messageRender]);

    useEffect(() => {
        if (socketRef) {
            socketRef.on('sendMessage', (message) => {
                console.log('message123:', message);
                if (getUser?._id === message) {
                    setChatItem(null);
                    toast.error('Bạn đã bị xóa khỏi nhóm!');
                }
                setmessageRender(message);
                return () => {
                    if (socketRef) {
                        socketRef.disconnect();
                    }
                };
            });
        }
    }, [chatItem]);

    const fetchConversations = async () => {
        try {
            if (chatItem?._id) {
                const conversationId = chatItem?._id;
                const response = await axios.get(
                    `https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/conversation/getConversationById/${conversationId}`,
                    {
                        headers: {
                            token: `Bearer ${getUser?.token}`,
                        },
                    },
                );

                const data = response.data;
                setChatItem(data);
            }
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    };

    const getConversationByUserId = async () => {
        try {
            if (getUser?._id) {
                const userId = getUser?._id;
                const response = await axios.get(
                    `https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/conversation/getConversationByUserId/${userId}`,
                    {
                        headers: {
                            token: `Bearer ${getUser?.token}`,
                        },
                    },
                );

                const data = response.data;
                setConversationAll(data);
            }
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    };

    const sendNewMessageToServer = async () => {
        try {
            // Kiểm tra xem trường newMessage có rỗng không
            if (!inputRef.current.value) {
                console.error('Content cannot be empty');
                return;
            }

            // Gửi yêu cầu POST đến API để tạo tin nhắn mới
            const response = await axios.post(
                'https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/messages/addMessageWeb',
                {
                    conversationId: conversationId, // ID của cuộc trò chuyện hoặc nhóm
                    content: inputRef.current.value,
                    memberId: memberId,
                    type: 'text',
                },
            );

            // Kiểm tra xem yêu cầu đã thành công hay không
            if (response.data) {
                socketRef.emit('message', { message: inputRef.current.value, room: conversationId });
                socketRef.emit('sendMessage', conversationId + inputRef.current.value);
                inputRef.current.value = '';
            } else {
                // Xử lý lỗi nếu cần
                console.error('Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const addReply = async () => {
        try {
            // Kiểm tra xem nội dung tin nhắn có rỗng không
            if (!inputRef.current.value) {
                console.error('Content cannot be empty');
                return;
            }

            // Gửi yêu cầu POST đến API để tạo tin nhắn trả lời
            const response = await axios.post('https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/messages/addReply', {
                conversationId: conversationId,
                content: inputRef.current.value,
                memberId: memberId,
                type: 'text',
                messageRepliedId: messageReply._id,
            });

            // Kiểm tra xem yêu cầu đã thành công hay không
            if (response.data) {
                socketRef.emit('message', { message: inputRef.current.value, room: conversationId });
                socketRef.emit('sendMessage', conversationId + inputRef.current.value);
                inputRef.current.value = '';
                setShowReply(false);
            } else {
                // Xử lý lỗi nếu cần
                console.error('Failed to send reply');
            }
        } catch (error) {
            console.error('Error sending reply:', error);
        }
    };

    const shareNewMessage = async (conversationIds, content, type) => {
        try {
            // Gửi yêu cầu POST đến API để tạo tin nhắn mới
            const response = await axios.post(
                'https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/messages/senderMessageToConversations',
                {
                    conversationIds: conversationIds,
                    content: content,
                    memberId: memberId,
                    type: type,
                },
            );

            // Kiểm tra xem yêu cầu đã thành công hay không
            if (response.data) {
                setOpenChiaSe(false);
                socketRef.emit('message', { message: content, room: conversationIds });
                socketRef.emit('sendMessage', 'Id phòng' + conversationIds + 'with message' + content);
                setCheckedConversations([]);
            } else {
                // Xử lý lỗi nếu cần
                console.error('Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const [openTitles, setOpenTitles] = useState({
        1: true,
        2: true,
        3: true,
        4: true,
        5: true,
    });

    const toggleTitle = (titleIndex) => {
        setOpenTitles((prevOpenTitles) => ({
            ...prevOpenTitles,
            [titleIndex]: !prevOpenTitles[titleIndex],
        }));
    };

    const getTitleHeight = (titleIndex) => {
        return openTitles[titleIndex] ? 'auto' : '40px';
    };

    //Đóng mở thông tin hội thoại

    const [infoVisible, setInfoVisible] = useState(false);
    useEffect(() => {
        document.documentElement.style.setProperty(
            '--container-width',
            infoVisible ? 'var(--min-width-home)' : 'var(--max-width-home)',
        );
        document.documentElement.style.setProperty(
            '--header-width',
            infoVisible ? 'var(--min-width-home)' : 'var(--max-width-home)',
        );
    }, [infoVisible]);

    const toggleInfoVisibility = () => {
        setInfoVisible((prevInfoVisible) => !prevInfoVisible);
        setShowTippy(false);
        setOpenGhim(false);
        setOpenChiTietImage(false);
    };

    const images1 = [
        {
            src: image1,
            title: 'Nhắn tin nhiều hơn, soạn thảo ít hơn',
            content: 'Sử dụng tin nhắn nhanh để lưu trữ các tin nhắn thường dùng và gửi nhanh trong hội thoại bất kì. ',
        },
        {
            src: image2,
            title: 'Tin nhắn tự xóa',
            content: 'Từ giờ tin nhắn có thể tự động xóa sau khoảng thời gian nhất định.',
        },
        {
            src: image3,
            title: 'Gửi file lớn',
            content: 'Gửi file lên đến 1GB mà không cần phải nén.',
        },
        {
            src: image4,
            title: 'Gọi nhóm và làm việc hiệu quả với Zelo Group Call',
            content: 'Trao đổi công việc mọi lúc mọi nơi.',
        },
        {
            src: image5,
            title: 'Gửi file nặng?',
            content: 'Đã có Zelo PC "xử" hết.',
        },
        {
            src: image6,
            title: 'Chát nhóm với đồng nghiệp',
            content: 'Tiện lợi hơn, nhờ các công cụ hỗ trợ chát trên máy tính.',
        },
        {
            src: image7,
            title: 'Giải quyết công việc hiệu quả hơn, lên đến 40%',
            content: 'Với Zelo PC.',
        },
    ];

    const [index, setIndex] = useState(0);

    const handleNext = () => {
        if (index === images1.length - 1) {
            // Nếu đang ở ảnh cuối cùng, quay lại ảnh đầu tiên
            setIndex(0);
        } else {
            // Nếu không, chuyển đến ảnh kế tiếp
            setIndex(index + 1);
        }
    };

    const handlePrevious = () => {
        if (index === 0) {
            setIndex(images1.length - 1);
        } else {
            setIndex(index - 1);
        }
    };

    function formatTime(date) {
        const options = { hour: '2-digit', minute: '2-digit' };
        return new Date(date).toLocaleTimeString([], options);
    }

    const handleImageChange = async (event) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                // Tạo formData chứa hình ảnh đã chọn
                const formData = new FormData();
                formData.append('image', file);

                // Gửi hình ảnh lên server để upload lên S3
                const response = await axios.post(
                    'https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/messages/uploadImageToS3',
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    },
                );

                // Lấy URL của hình ảnh đã upload thành công
                const imageUrl = response.data.imageUrl;

                // Gửi tin nhắn mới kèm theo URL của hình ảnh đó
                const messageResponse = await axios.post(
                    'https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/messages/addMessageWeb',
                    {
                        conversationId: conversationId,
                        content: imageUrl,
                        memberId: memberId,
                        type: 'image',
                    },
                );

                const data = await messageResponse.data;
                // Xử lý response từ server (nếu cần)
                if (data) {
                    socketRef.emit('message', { message: imageUrl, room: conversationId });
                    socketRef.emit('sendMessage', imageUrl);
                }
            } catch (error) {
                console.error('Error sending image:', error);
                // Xử lý lỗi nếu cần
            }
        }
    };

    // Hàm xử lý khi người dùng chọn ảnh

    const handleClickOutside = (event) => {
        if (pickerRef.current && !pickerRef.current.contains(event.target)) {
            setShowPicker1(false);
            setShowPicker(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Hàm mở modal
    const openModal = (messageInfo) => {
        setSelectedMessageInfo(messageInfo);
        setImgModalOpen(true);
    };
    const closeModal = () => {
        setImgModalOpen(false);
    };

    // const handleInputChange = (e) => {
    //     setNewMessage(e.target.value);
    // };

    const handleDeleteMessage = async (conversationId, messageId, memberId) => {
        try {
            const response = await axios.post(
                'https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/messages/deleteMessage',
                {
                    conversationId,
                    messageId,
                    memberId,
                },
            );

            if (response.data) {
                socketRef.emit('message', { message: 'Hello', room: conversationId });
                socketRef.emit('sendMessage', memberId + conversationId + 'đã xóa tin nhắn');
                fetchConversations();
            }

            // Xử lý dữ liệu phản hồi nếu cần
        } catch (error) {
            // Xử lý lỗi nếu có
            console.error('Error deleting message:', error);
        }
    };

    const [contentChiaSe, setContentChiaSe] = useState('');
    const [messageType, setMessageType] = useState('');
    const handleOpenChiaSe = (content, type) => {
        setOpenChiaSe(true);
        setContentChiaSe(content);
        setMessageType(type);
    };
    const handleCloseChiaSe = () => {
        setCheckedConversations([]);

        setOpenChiaSe(false);
    };

    const handleDeleteButtonClick = (conversationId, messageId, memberId) => {
        handleDeleteMessage(conversationId, messageId, memberId);
    };

    const handleThuHoiMessage = async (conversationId, messageId, memberId) => {
        try {
            handleDeleteReactionAll(messageId);
            const response = await axios.post(
                'https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/messages/thuHoiMessage',
                {
                    conversationId,
                    messageId,
                    memberId,
                },
            );

            if (response.data) {
                socketRef.emit('message', { message: 'Hello', room: conversationId });
                socketRef.emit('sendMessage', 'thu hoi tin nhan');
                fetchConversations();
            }

            // Xử lý dữ liệu phản hồi nếu cần
        } catch (error) {
            // Xử lý lỗi nếu có
            console.error('Error deleting message:', error);
        }
    };

    const handleThuHoiButtonClick = (conversationId, messageId, memberId) => {
        handleThuHoiMessage(conversationId, messageId, memberId);
    };
    const [showTippy, setShowTippy] = useState(false);

    const toggleTippy = () => {
        setShowTippy(!showTippy);
    };
    const handleTippyClose = (e) => {
        e.stopPropagation(); //
        setShowTippy(false);
    };
    const infoRef = useRef(null);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    function extractFileNameAndType(url, maxLength) {
        const parts = url.split('/');
        const fileNameWithExtension = parts[parts.length - 1];

        const dotIndex = fileNameWithExtension.lastIndexOf('.');
        const fileName = fileNameWithExtension.substring(0, dotIndex); // Tên file
        const fileType = fileNameWithExtension.substring(dotIndex + 1); // Loại file

        // Kiểm tra độ dài của tên file và cắt nếu quá dài
        const truncatedFileName = fileName.length > maxLength ? fileName.substring(0, maxLength) + '...' : fileName;
        return { fileName: truncatedFileName + '.' + fileType, fileType };
    }

    function getFileIcon(fileType) {
        switch (fileType) {
            case 'pdf':
                return (
                    <FontAwesomeIcon
                        icon={faFilePdf}
                        size="2x"
                        color="rgb(233, 83, 64)"
                        style={{ marginRight: '3px' }}
                    />
                );
            case 'docx':
                return (
                    <FontAwesomeIcon
                        icon={faFileWord}
                        size="2x"
                        color="rgb(41,120,203)"
                        style={{ marginRight: '3px' }}
                    />
                );
            case 'pptx':
                return (
                    <FontAwesomeIcon
                        icon={faFilePowerpoint}
                        size="2x"
                        color="rgb(233, 83, 64)"
                        style={{ marginRight: '3px' }}
                    />
                );
            case 'mp3':
                return (
                    <FontAwesomeIcon
                        icon={faFileAudio}
                        size="2x"
                        color="rgb(233, 83, 64)"
                        style={{ marginRight: '3px' }}
                    />
                );
            case 'mp4':
                return (
                    <FontAwesomeIcon
                        icon={faFileAudio}
                        size="2x"
                        color="rgb(233, 83, 64)"
                        style={{ marginRight: '3px' }}
                    />
                );
            case 'csv':
                return (
                    <FontAwesomeIcon
                        icon={faFileCsv}
                        size="2x"
                        color="rgb(29, 109, 67"
                        style={{ marginRight: '3px' }}
                    />
                );

            default:
                return <FontAwesomeIcon icon={faFilePdf} size="2x" color="red" style={{ marginRight: '3px' }} />;
        }
    }

    const handleClick = (url) => {
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', '');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                // Tạo formData chứa hình ảnh đã chọn
                const encodedFileName = encodeURIComponent(file.name);

                // Tạo formData chứa hình ảnh đã chọn
                const formData = new FormData();
                formData.append('image', file, encodedFileName);
                console.log('filedhdhđ', encodedFileName);

                // Gửi hình ảnh lên server để upload lên S3
                const response = await axios.post(
                    'https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/messages/uploadImageToS3',
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    },
                );

                // Lấy URL của hình ảnh đã upload thành công
                const fileURL = response.data.imageUrl;

                console.log('fileURL1111', fileURL);
                // Gửi tin nhắn mới kèm theo URL của hình ảnh đó
                const messageResponse = await axios.post(
                    'https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/messages/addMessageWeb',
                    {
                        conversationId: conversationId,
                        content: fileURL,
                        memberId: memberId,
                        type: 'file',
                    },
                );

                const data = await messageResponse.data;
                // Xử lý response từ server (nếu cần)
                if (data) {
                    socketRef.emit('message', { message: fileURL, room: conversationId });
                    socketRef.emit('sendMessage', fileURL);
                }
            } catch (error) {
                console.error('Error sending image:', error);
                // Xử lý lỗi nếu cần
            }
        }
    };

    const handleClickInfo = (userID) => {
        const foundDeputy = chatItem.deputy.find((deputy) => deputy?.userId._id === getUser?._id);
        const foundDeputyByUserId = chatItem.deputy.find((deputy) => deputy.userId?._id === userID);
        const deputy = chatItem.deputy.find((deputy) => deputy.userId?._id === userID);

        if (
            chatItem.leader.userId?._id !== getUser?._id &&
            foundDeputy &&
            chatItem.leader.userId?._id !== userID &&
            !deputy &&
            userID !== getUser?._id
        ) {
            setSelectedMember(userID);
            setIsDeputyLogin(true);
            setIsInfoVisible(true);
            return userID;
        }

        //Trưởng nhóm kích vào trưởng nhốm
        if (userID === chatItem.leader.userId?._id && chatItem.leader.userId?._id === getUser?._id) {
            setSelectedMember(userID);
            setIsLeader(true);
            setIsInfoVisible(true);
            return userID;
        }
        //Trưởng nhóm kích vào phó nhóm
        if (foundDeputyByUserId && chatItem.leader.userId?._id === getUser?._id) {
            setSelectedMember(userID);
            setIsLeader(false);
            setIsDeputy(true);
            setIsInfoVisible(true);
        }
        //Trưởng nhóm kích vào thành viên
        if (
            !foundDeputyByUserId &&
            userID !== chatItem.leader.userId?._id &&
            chatItem.leader.userId?._id === getUser?._id
        ) {
            setSelectedMember(userID);
            setIsLeader(false);
            setIsDeputy(false);
            setIsMember(true);
            setIsInfoVisible(true);
            return userID;
        }

        //Tự bản thân kích vào
        if (userID === getUser?._id && chatItem.leader.userId?._id === getUser?._id) {
            setSelectedMember(userID);
            setIsInfoVisible(true);
            return userID;
        }
        if (userID === getUser?._id && foundDeputy) {
            setSelectedMember(userID);
            setIsInfoVisible(true);
            return userID;
        }

        if (userID === getUser?._id && !foundDeputy && chatItem.leader.userId?._id !== getUser?._id) {
            setSelectedMember(userID);
            setIsInfoVisible(true);
            return userID;
        }

        //Nếu là phó nhóm đăng nhập
    };

    const handleContainerClick = () => {
        setIsInfoVisible(false); // Ẩn thông tin nếu click ra ngoài
    };

    //Role
    const addDeputyToConversationHandler = async (conversationID, deputyUserID) => {
        try {
            // Gọi API addDeputyToConversation với thông tin conversationID và deputyUserID
            const response = await axios.post(
                'https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/conversation/addDeputyToConversation',
                {
                    conversationID,
                    deputyUserID,
                },
            );

            const responseUser = await axios.get(
                'https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/users/' + deputyUserID,
            );

            const response1 = await axios.post(
                'https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/messages/addMessageWeb',
                {
                    conversationId: conversationID,
                    content: `${getUserName}  đã thêm ${responseUser.data.name} làm  phó nhóm`,
                    memberId: memberId, // Biến memberId của bạn ở đây
                    type: 'notify',
                },
            );
            if (response.data || response1.data) {
                setIsInfoVisible(false);

                setShowTippy(true);
                socketRef.emit('sendMessage', `${getUserName} đã thêm ${responseUser.data.name} làm phó nhóm`);
            }

            // Trả về dữ liệu từ phản hồi nếu thành công
            return response.data;
        } catch (error) {
            // Xử lý lỗi nếu có bất kỳ lỗi nào xảy ra
            console.error('Error addDeputy:', error);
        }
    };

    const deleteDeputyToConversationHandler = async (conversationID, deputyUserID) => {
        try {
            // Gọi API addDeputyToConversation với thông tin conversationID và deputyUserID
            const response = await axios.post(
                'https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/conversation/removeDeputyFromConversation',
                {
                    conversationID,
                    deputyUserID,
                },
            );
            const responseUser = await axios.get(
                'https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/users/' + deputyUserID,
            );

            const response1 = await axios.post(
                'https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/messages/addMessageWeb',
                {
                    conversationId: conversationID,
                    content: `${getUserName} đã xóa phó nhóm ${responseUser.data.name} `,
                    memberId: memberId, // Biến memberId của bạn ở đây
                    type: 'notify',
                },
            );
            if (response.data || response1.data) {
                setIsInfoVisible(false);

                setShowTippy(true);
                socketRef.emit('sendMessage', `${getUserName} đã xóa phó nhóm ${responseUser.data.name}`);
            }

            // Trả về dữ liệu từ phản hồi nếu thành công
            return response.data;
        } catch (error) {
            // Xử lý lỗi nếu có bất kỳ lỗi nào xảy ra
            console.error('Error addDeputy:', error);
        }
    };

    const leaveConversationHandler = async (conversationID, userID) => {
        try {
            // Gọi API addDeputyToConversation với thông tin conversationID và deputyUserID
            const response = await axios.post(
                'https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/conversation/leaveConversation',
                {
                    conversationID,
                    userID,
                },
            );
            const responseUser = await axios.get('https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/users/' + userID);

            await axios.post('https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/messages/addMessageWeb', {
                conversationId: conversationID,
                content: `${responseUser.data.name} đã rời nhóm`,
                memberId: memberId, // Biến memberId của bạn ở đây
                type: 'notify',
            });

            socketRef.emit('sendMessage', `${responseUser.data.name} đã rời nhóm`);

            setInfoVisible(false);

            setChatItem(null);

            // Trả về dữ liệu từ phản hồi nếu thành công
            return response.data;
        } catch (error) {
            // Xử lý lỗi nếu có bất kỳ lỗi nào xảy ra
            console.error('Error addDeputy:', error);
        }
    };

    const removedUserToConversationHandler = async (conversationID, userID) => {
        try {
            // Gọi API addDeputyToConversation với thông tin conversationID và deputyUserID
            const response = await axios.post(
                'https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/conversation/leaveConversation',
                {
                    conversationID,
                    userID,
                },
            );
            const responseUser = await axios.get('https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/users/' + userID);

            await axios.post('api/v1/messages/addMessageWeb', {
                conversationId: conversationID,
                content: `${getUserName} đã đuổi ${responseUser.data.name} rời khỏi nhóm`,
                memberId: memberId, // Biến memberId của bạn ở đây
                type: 'notify',
            });

            socketRef.emit('sendMessage', `${userID}`);

            fetchConversations();

            setIsInfoVisible(false);

            setShowTippy(true);
            if (getUser?._id === userID) {
                setChatItem(null);
            }

            // Trả về dữ liệu từ phản hồi nếu thành công
            return response.data;
        } catch (error) {
            // Xử lý lỗi nếu có bất kỳ lỗi nào xảy ra
            console.error('Error addDeputy:', error);
        }
    };

    const leaveConversationInLeaderHandler = async (conversationID, userID) => {
        try {
            // Gọi API addDeputyToConversation với thông tin conversationID và deputyUserID
            const response = await axios.post(
                'https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/conversation/leaveConversation',
                {
                    conversationID,
                    userID,
                },
            );

            const responseUser = await axios.get('https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/users/' + userID);

            await axios.post('api/v1/messages/addMessageWeb', {
                conversationId: conversationID,
                content: `${responseUser.data.name} đã rời nhóm `,
                memberId: memberId, // Biến memberId của bạn ở đây
                type: 'notify',
            });

            socketRef.emit('sendMessage', `${responseUser.data.name} đã rời nhóm`);

            setIsInfoVisible(false);
            setChatItem(null);

            // Trả về dữ liệu từ phản hồi nếu thành công
            return response.data;
        } catch (error) {
            // Xử lý lỗi nếu có bất kỳ lỗi nào xảy ra
            console.error('Error addDeputy:', error);
        }
    };

    const deleteConversationHandler = async (conversationID) => {
        try {
            // Gọi API addDeputyToConversation với thông tin conversationID và deputyUserID
            const response = await axios.post(
                'https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/conversation/deleteConversationById/' +
                    conversationID,
            );
            socketRef.emit('sendMessage', `${conversationID}Giả tán xóa cuộc trò chuyện`);

            setInfoVisible(false);
            setChatItem(null);
            setOpenXacNhan(false);
            // Trả về dữ liệu từ phản hồi nếu thành công
            return response.data;
        } catch (error) {
            // Xử lý lỗi nếu có bất kỳ lỗi nào xảy ra
            console.error('Error addDeputy:', error);
        }
    };

    const selectNewLeaderHandler = async (conversationID, newLeaderUserID) => {
        try {
            // Gọi API addDeputyToConversation với thông tin conversationID và deputyUserID
            const response = await axios.post(
                'https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/conversation/selectNewLeader',
                {
                    conversationID,
                    newLeaderUserID,
                },
            );

            const responseUser = await axios.get(
                'https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/users/' + newLeaderUserID,
            );

            const response1 = await axios.post(
                'https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/messages/addMessageWeb',
                {
                    conversationId: conversationID,
                    content: `${getUserName} đã cho ${responseUser.data.name} làm nhóm trưởng.`,
                    memberId: memberId, // Biến memberId của bạn ở đây
                    type: 'notify',
                },
            );

            if (response.data || response1.data) {
                socketRef.emit('sendMessage', `${getUser?.name} cho ${responseUser.data.name} làm nhóm trưởng.`);
                setOpenGroup(false);
                setShowTippy(false);
            }

            // Trả về dữ liệu từ phản hồi nếu thành công
            return response.data;
        } catch (error) {
            // Xử lý lỗi nếu có bất kỳ lỗi nào xảy ra
            console.error('Error addDeputy:', error);
        }
    };

    const addUserToConversation = async (conversationID, arrayUserID) => {
        try {
            // Gọi API addDeputyToConversation với thông tin conversationID và deputyUserID
            const response = await axios.post(
                'https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/conversation/addUserToConversation',
                {
                    conversationID,
                    arrayUserID,
                },
            );
            const newMemberNames = response.data.newMemberNames;
            for (const memberName of newMemberNames) {
                await axios.post('https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/messages/addMessageWeb', {
                    conversationId: conversationID,
                    content: `${getUserName} đã thêm ${memberName} vào nhóm`,
                    memberId: memberId, // Biến memberId của bạn ở đây
                    type: 'notify',
                });
            }

            socketRef.emit('sendMessage', `${getUser?.name} đã thêm`);
            // Nếu gửi tin nhắn thành công và fetch dữ liệu cuộc trò chuyện, bạn có thể thực hiện như sau:

            return response.data; // Trả về dữ liệu từ response của axios.post đầu tiên
        } catch (error) {
            // Xử lý lỗi nếu có bất kỳ lỗi nào xảy ra
            console.error('Error addDeputy:', error);
        }
    };

    //update conversation
    const updateNameConversation = async (conversationID) => {
        try {
            // Gọi API addDeputyToConversation với thông tin conversationID và deputyUserID
            const response = await axios.post(
                'https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/conversation/updateConversationNameById',
                {
                    conversationID,
                    name: nameConversation,
                },
            );
            await axios.post('https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/messages/addMessageWeb', {
                conversationId: conversationID,
                content: `🖊️ ${getUserName} đã đổi thành "${nameConversation}" `,
                memberId: memberId, // Biến memberId của bạn ở đây
                type: 'notify',
            });

            socketRef.emit('sendMessage', `${nameConversation} đã đổi tên`);
            fetchConversations();
            setOpenUpdateName(false);
            // Nếu gửi tin nhắn thành công và fetch dữ liệu cuộc trò chuyện, bạn có thể thực hiện như sau:

            return response.data; // Trả về dữ liệu từ response của axios.post đầu tiên
        } catch (error) {
            // Xử lý lỗi nếu có bất kỳ lỗi nào xảy ra
            console.error('Error addDeputy:', error);
        }
    };
    const handleChangeUser = (event) => {
        event.target.value = event.target.value.trimStart();
        setSearchValueUsername(event.target.value);
    };
    const handleOpenLeave = () => {
        if (getUser?._id === chatItem.leader?.userId?._id && chatItem.members.length > 1) {
            setOpenGroup(true);
        } else {
            leaveConversationHandler(chatItem?._id, getUser?._id);
        }
    };

    const handleCloseGroup = () => {
        setOpenGroup(false);
    };

    const [isChecked, setIsChecked] = useState(false);

    const handleDivClick = (userId) => {
        setIsChecked(userId);
    };

    const [checkedConversations, setCheckedConversations] = useState([]);
    const handleCheckboxShareChange = (conversationId) => {
        if (checkedConversations.includes(conversationId)) {
            setCheckedConversations(checkedConversations.filter((id) => id !== conversationId));
        } else {
            setCheckedConversations([...checkedConversations, conversationId]);
        }
    };

    const handleDivClickShare = (conversationId) => {
        if (checkedConversations.includes(conversationId)) {
            setCheckedConversations(checkedConversations.filter((id) => id !== conversationId));
        } else {
            setCheckedConversations([...checkedConversations, conversationId]);
        }
    };

    function getDayAndMonthFromDate(dateString) {
        const dateObject = new Date(dateString);

        const day = dateObject.getDate(); // Lấy ngày (từ 1 đến 31)
        const month = dateObject.getMonth() + 1; // Lấy tháng (từ 0 đến 11, nên cần cộng 1)

        return { day, month };
    }

    function groupMessagesByDate(messages) {
        const groupedMessages = {};
        messages.forEach((message) => {
            const { day, month } = getDayAndMonthFromDate(message.createAt);
            const dateKey = `Ngày ${day} tháng ${month}`;
            if (!groupedMessages[dateKey]) {
                groupedMessages[dateKey] = [];
            }
            groupedMessages[dateKey].push(message);
        });
        return groupedMessages;
    }

    const calculateReactionTotalsType = (reactions) => {
        const reactionTotals = {};

        reactions?.forEach((reactionGroup) => {
            reactionGroup.reactions?.forEach((reaction) => {
                if (!reactionTotals[reaction.typeReaction]) {
                    reactionTotals[reaction.typeReaction] = 0;
                }
                reactionTotals[reaction.typeReaction] += reaction?.quantity;
            });
        });

        return reactionTotals;
    };

    //Sender Video
    const handleVideoChange = async (event) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                // Tạo formData chứa hình ảnh đã chọn
                const formData = new FormData();
                formData.append('image', file);

                // Gửi hình ảnh lên server để upload lên S3
                const response = await axios.post(
                    'https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/messages/uploadImageToS3',
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    },
                );

                // Lấy URL của hình ảnh đã upload thành công
                const fileURL = response.data.imageUrl;
                // Gửi tin nhắn mới kèm theo URL của hình ảnh đó
                const messageResponse = await axios.post(
                    'https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/messages/addMessageWeb',
                    {
                        conversationId: conversationId,
                        content: fileURL,
                        memberId: memberId,
                        type: 'video',
                    },
                );

                const data = await messageResponse.data;
                // Xử lý response từ server (nếu cần)
                if (data) {
                    socketRef.emit('message', { message: fileURL, room: conversationId });
                    socketRef.emit('sendMessage', fileURL);
                }
            } catch (error) {
                console.error('Error sending image:', error);
                // Xử lý lỗi nếu cần
            }
        }
    };

    useEffect(() => {
        if (contentRef.current) {
            if (showReply) {
                contentRef.current.style.height = '540px';
            } else {
                contentRef.current.style.height = '580px';
            }
        }
    }, [showReply]);

    const handleToggleReply = (message) => {
        setShowReply((prevState) => (prevState === message?._id ? !prevState : message?._id));
        setMessageReply(message);
    };

    useEffect(() => {
        if (!showReply) {
            setMessageReply(null);
        }
    }, [showReply]);

    useEffect(() => {
        if (showReply) {
            // Tập trung vào ô nhập khi showReply thay đổi
            inputRef.current.focus();
        }
    }, [showReply]);

    const handleAddReaction = async (reactionType, messageId, message) => {
        try {
            const response = await axios.post(
                'https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/messages/addReaction',
                {
                    messageId: messageId,
                    typeReaction: reactionType,
                    memberId: memberId,
                },
            );

            if (response.data) {
                socketRef.emit('sendMessage', `${messageId} ${calculateTotalReactions(message)}`);
                fetchConversations();
            }
            // Xử lý cập nhật giao diện nếu cần
        } catch (error) {
            console.error('Error adding reaction:', error);
            // Xử lý lỗi nếu cần
        } finally {
        }
    };

    const handleDeleteReaction = async (messageId, message) => {
        try {
            const response = await axios.post(
                'https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/messages/deleteReaction',
                {
                    messageId: messageId,
                    memberId: memberId,
                },
            );

            if (response.data) {
                socketRef.emit('sendMessage', `${messageId} ${calculateTotalReactions(message)}`);
                fetchConversations();
            }
        } catch (error) {
            console.error('Error adding reaction:', error);
            // Xử lý lỗi nếu cần
        } finally {
        }
    };

    const handleDeleteReactionAll = async (messageId) => {
        try {
            const response = await axios.post(
                'https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/messages/deleteAllReactionByMessageID',
                {
                    messageId: messageId,
                },
            );

            if (response.data) {
            }
        } catch (error) {
            // Xử lý lỗi nếu cần
        } finally {
        }
    };

    //Xử lý pin

    const handlePinMessage = async (messageId) => {
        try {
            if (messageId === null) {
                return;
            }
            if (arrayAllPin.length >= 3) {
                toast.error('Bạn chỉ có thể ghim tối đa 3 tin nhắn!');
            } else {
                // Nếu chưa có 3 tin nhắn, thực hiện yêu cầu ghim tin nhắn mới
                const response = await axios.post(
                    'https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/messages/addPinMessageToConversation',
                    {
                        conversationId: chatItem._id,
                        messageId,
                    },
                );
                const responseMessage = await axios.post(
                    'https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/messages/getMessageByIdWeb',
                    {
                        messageId: messageId,
                    },
                );

                if (responseMessage.data.type === 'image') {
                    const response1 = await axios.post(
                        'https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/messages/addMessageWeb',
                        {
                            conversationId: chatItem?._id,
                            content: `${getUserName} đã ghim tin nhắn hình ảnh`,
                            memberId: memberId,
                            type: 'notify',
                        },
                    );
                    console.log('response1333', response1);
                } else if (responseMessage.data.type === 'text') {
                    const response1 = await axios.post(
                        'https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/messages/addMessageWeb',
                        {
                            conversationId: chatItem?._id,
                            content: `${getUserName} đã ghim tin nhắn <strong > ${response.data.pinMessages[0].content} </strong>`,
                            memberId: memberId, // Biến memberId của bạn ở đây
                            type: 'notify',
                        },
                    );
                    console.log('response1333', response1);
                } else {
                    const response1 = await axios.post(
                        'https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/messages/addMessageWeb',
                        {
                            conversationId: chatItem?._id,
                            content: `${getUserName} đã ghim tin nhắn file`,
                            memberId: memberId, // Biến memberId của bạn ở đây
                            type: 'notify',
                        },
                    );
                    console.log('response1333', response1);
                }

                if (response.data) {
                    // Nếu yêu cầu thành công, cập nhật dữ liệu và thực hiện các công việc liên quan khác
                    socketRef.emit('message', { message: 'Ghim', room: conversationId });
                    socketRef.emit('sendMessage', `${messageId}`);
                    fetchConversations();
                }
            }
        } catch (error) {
            // Xử lý lỗi nếu có
            console.error('Error pinning message:', error);
        }
    };

    const handleDeletePinMessage = async (messageId) => {
        try {
            if (messageId === null) {
                return;
            }
            await axios.post(
                'https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/messages/deletePinMessageToConversation',
                {
                    conversationId: chatItem._id,
                    messageId,
                },
            );

            const responseMessage = await axios.post(
                'https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/messages/getMessageByIdWeb',
                {
                    messageId,
                },
            );
            console.log('typeXxoa', responseMessage.data.type);
            if (responseMessage.data.type === 'image') {
                await axios.post('https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/messages/addMessageWeb', {
                    conversationId: chatItem?._id,
                    content: `${getUserName} đã bỏ ghim tin nhắn hình ảnh`,
                    memberId: memberId, // Biến memberId của bạn ở đây
                    type: 'notify',
                });
            } else if (responseMessage.data.type === 'text') {
                await axios.post('https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/messages/addMessageWeb', {
                    conversationId: chatItem?._id,
                    content: `${getUserName} đã bỏ ghim tin nhắn <strong > ${responseMessage.data.content} </strong>`,
                    memberId: memberId, // Biến memberId của bạn ở đây
                    type: 'notify',
                });
            } else {
                await axios.post('api/v1/messages/addMessageWeb', {
                    conversationId: chatItem?._id,
                    content: `${getUserName} đã bỏ ghim tin nhắn file`,
                    memberId: memberId, // Biến memberId của bạn ở đây
                    type: 'notify',
                });
            }

            // Nếu yêu cầu thành công, cập nhật dữ liệu và thực hiện các công việc liên quan khác
            socketRef.emit('message', { message: 'Bỏ Ghim', room: conversationId });
            socketRef.emit('sendMessage', `${messageId}`);
            fetchConversations();
        } catch (error) {
            // Xử lý lỗi nếu có
            console.error('Error pinning message:', error);
        }
    };

    const handlePrioritizePinMessage = async (messageId) => {
        try {
            const response = await axios.post(
                'https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/messages/prioritizePinMessage',
                {
                    conversationId: chatItem._id,
                    messageId,
                },
            );

            await axios.post('https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/messages/addMessageWeb', {
                conversationId: chatItem?._id,
                content: `${getUserName} đã chỉnh sửa danh sách ghim.`,
                memberId: memberId, // Biến memberId của bạn ở đây
                type: 'notify',
            });
            if (response.data) {
                // Nếu yêu cầu thành công, cập nhật dữ liệu và thực hiện các công việc liên quan khác
                socketRef.emit('message', { message: 'Đưa ghim lên đầu', room: conversationId });
                socketRef.emit('sendMessage', `${messageId}`);
                fetchConversations();
            }
        } catch (error) {
            // Xử lý lỗi nếu có
            console.error('Error pinning message:', error);
        }
    };

    function calculateTotalReactions(message) {
        const memberReactionCounts = {};

        message?.reaction?.forEach(({ memberId, reactions }) => {
            reactions.forEach(({ typeReaction, quantity }) => {
                if (!memberReactionCounts[memberId._id]) {
                    memberReactionCounts[memberId._id] = {};
                }

                if (!memberReactionCounts[memberId._id][typeReaction]) {
                    memberReactionCounts[memberId._id][typeReaction] = 0;
                }

                memberReactionCounts[memberId._id][typeReaction] += quantity;
            });
        });

        return Object.values(memberReactionCounts).reduce(
            (total, member) => total + Object.values(member).reduce((sum, qty) => sum + qty, 0),
            0,
        );
    }

    // Hàm tính tổng số lượng phản ứng cho mỗi người dùng
    function calculateTotalReactionsByUser(data) {
        const memberReactions = {};

        data.forEach((item) => {
            const userId = item?.memberId?.userId?._id;
            const userName = item?.memberId?.userId?.name;
            const userAvatar = item?.memberId?.userId?.avatar;

            const totalQuantity = item?.reactions.reduce((total, reaction) => total + (reaction.quantity || 0), 0);

            if (memberReactions[userId]) {
                memberReactions[userId].quantity += totalQuantity;
            } else {
                memberReactions[userId] = {
                    userId: userId,
                    quantity: totalQuantity,
                    name: userName,
                    avatar: userAvatar,
                };
            }
        });

        return memberReactions;
    }

    const reactionIconMapping = {
        Like: { icon: iconLike },
        Love: { icon: iconTim },
        Smile: { icon: iconSmile },
        Wow: { icon: iconWow },
        Sad: { icon: iconSad },
        Angry: { icon: iconAngry },
    };

    if (!chatItem) {
        return (
            <div className={cx('slider-container')}>
                <h2>
                    Chào mừng đến với <span>Zelo Web</span>
                </h2>
                <p>
                    Khám phá những tiện ích hỗ trợ làm việc và trò chuyện cùng <br></br>
                    người thân, bạn bè được tối ưu cho máy tính của bạn.
                </p>
                <div className={cx('slider-image')}>
                    <button className={cx('icon')} onClick={handlePrevious}>
                        <FontAwesomeIcon icon={faAngleLeft} />
                    </button>
                    <div className={cx('slider')}>
                        <img src={images1[index].src} alt={`Slide ${index + 1}`} className={cx('img-slider')} />
                        <div className={cx('slide-title')}>{images1[index].title}</div>
                        <div className="slide-content">{images1[index].content}</div>
                    </div>

                    <button className={cx('icon')} onClick={handleNext}>
                        <FontAwesomeIcon icon={faAngleRight} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={cx('body')}>
            <Toaster toastOptions={{ duration: 4000 }} />
            <Modal
                open={openModalAddUser}
                onClose={() => {
                    // Đặt lại các giá trị khi đóng modal

                    handleCloseModalAddUser();
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className={cx('model-container-group')}>
                    <h1 className={cx('h1-group')}>Thêm thành viên</h1>
                    <div id="modal-modal-title" className={cx('model-title-add')}>
                        <div className={cx('model-search')}>
                            <input
                                className={cx('search-group')}
                                placeholder="Nhập số điện thoại"
                                value={searchValueUsername}
                                onChange={handleChangeUser}
                            />
                        </div>
                        <div className={cx('list-friend')}>
                            <span>Danh sách bạn bè</span>
                            {listFriend.map((friend) => (
                                <div key={friend._id} className={cx('friend-item')}>
                                    <div
                                        className={cx('info-add')}
                                        onClick={() => {
                                            handleInfoClick(friend._id);
                                        }}
                                        disabled={arrayUser.includes(friend._id)}
                                        style={{ opacity: arrayUser.includes(friend._id) ? 0.5 : 1 }}
                                    >
                                        <input
                                            className={cx('check-box')}
                                            type="checkbox"
                                            checked={selectedFriends.includes(friend._id)}
                                            onChange={() => {
                                                handleInfoClick(friend._id);
                                            }}
                                            style={{ opacity: arrayUser.includes(friend._id) ? 0.5 : 1 }}
                                        />
                                        <img className={cx('user-avatar')} src={friend.avatar} alt={friend.name} />
                                        <h3 className={cx('info-item')}>{friend.name}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={cx('create-group')}>
                        <div className={cx('list-addUser')}></div>
                        <div className={cx('btn-addUser')} onClick={handleCloseModalAddUser}>
                            <input type="button" className={cx('bnt-exit')} value={'Hủy'} />

                            <input
                                type="button"
                                className={cx('bnt-create')}
                                value={'Thêm thành viên'}
                                onClick={() => {
                                    addUserToConversation(chatItem._id, selectedFriends);
                                }}
                                style={{ opacity: isDisabled ? 0.5 : 1 }} // Thiết lập opacity dựa trên điều kiện
                                disabled={isDisabled} // Ngăn người dùng click vào nút khi bị disabled
                            />
                        </div>
                    </div>
                </Box>
            </Modal>
            <div className={cx('container')} style={{ width: 'var(--container-width)' }}>
                <div className={cx('header')} style={{ width: 'var(--header-width)' }}>
                    <div className={cx('header-left')}>
                        {chatItem.type === 'Group' ? (
                            // Hiển thị avatar mặc định
                            <img src={chatItem.groupImage} alt="Default Avatar" className={cx('img-header')} />
                        ) : (
                            // Hiển thị các avatar của thành viên (nếu có)
                            chatItem.members.map((member) => {
                                if (member.userId?._id !== getUser?._id) {
                                    return (
                                        <img
                                            key={member?._id}
                                            src={member.userId?.avatar}
                                            alt={member.userId?.name}
                                            className={cx('img-header')}
                                        />
                                    );
                                }
                                return null;
                            })
                        )}

                        <div className={cx('content-header')}>
                            {chatItem.type === 'Group' ? (
                                <h2 className={cx('content-top-h2')}>{chatItem.name}</h2>
                            ) : (
                                chatItem.members.map((member) => {
                                    if (member.userId?._id !== getUser?._id) {
                                        return <h2 className={cx('content-top-h2')}>{member.userId?.name}</h2>;
                                    }
                                    return null;
                                })
                            )}

                            <div className={cx('content-bottom')}>
                                <Tippy
                                    delay={[700, 0]}
                                    content="6 thành viên"
                                    placement="bottom"
                                    className={cx('tippy')}
                                >
                                    {chatItem.type === 'Group' ? (
                                        <div className={cx('nav1')}>
                                            <img
                                                src={iconUser1}
                                                className={cx('icon1')}
                                                style={{ width: '17px', height: '17px', marginRight: '4px' }}
                                                alt="icon"
                                            />
                                            <h3 className={cx('content-bottom-h3')} style={{ height: '17px' }}>
                                                {chatItem.members.length} thành viên
                                            </h3>
                                        </div>
                                    ) : (
                                        <div className={cx('nav1')}>
                                            <img
                                                src={iconUser1}
                                                className={cx('icon1')}
                                                style={{ width: '17px', marginRight: '10px' }}
                                                alt="icon"
                                            />
                                        </div>
                                    )}
                                </Tippy>
                            </div>
                        </div>
                    </div>

                    <div className={cx('header-right')}>
                        {buttonsData1.map((button, index) => (
                            <Tippy
                                key={index}
                                content={button.content}
                                offset={[-70, 19]}
                                placement="bottom"
                                className={cx('tippy')}
                            >
                                <button
                                    className={cx('icon3')}
                                    onClick={() => {
                                        if (button.icon === iconTab) {
                                            toggleInfoVisibility();
                                        }
                                        if (button.icon === iconGroup) {
                                            handleOpenModalAddUser();
                                        }
                                    }}
                                >
                                    {button.icon === iconGroup && chatItem.type === 'Group' && (
                                        <img src={button.icon} alt="icon"></img>
                                    )}
                                    {button.icon !== iconGroup && (
                                        <img
                                            src={button.icon}
                                            style={{
                                                width: button.icon === iconVideo ? '20px' : '',
                                            }}
                                            alt="icon"
                                        ></img>
                                    )}
                                </button>
                            </Tippy>
                        ))}
                    </div>
                </div>

                <div
                    className={cx('content')}
                    ref={(node) => {
                        contentRef.current = node;
                    }}
                    onClick={handleContainerClick}
                >
                    <Modal
                        open={openGhim}
                        onClose={handleCloseGhim}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                        sx={{
                            position: 'absolute',
                            top: '30%',
                            left: '70%',
                            marginTop: '9%',
                            marginLeft: '-6.6%',
                            transform: 'translate(-50%, -50%)',
                            width: 1127,
                            height: 570,
                            bgcolor: 'transparent',
                            boxShadow: 24,
                        }}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                width: 1127,
                                bgcolor: 'background.paper',
                                boxShadow: 24,
                            }}
                        >
                            <div className={cx('modal-ghim-title')}>
                                <h1>Danh sách ghim ({arrayAllPin.length})</h1>
                                <button onClick={handleCloseGhim}>
                                    {'   '}
                                    Thu gọn <FontAwesomeIcon icon={faCaretUp} />
                                </button>
                            </div>

                            {arrayAllPin.map((pinMessage) => (
                                <div
                                    key={pinMessage._id}
                                    className={cx('pinned-content11')}
                                    style={{ marginLeft: '1px' }}
                                >
                                    <div className={cx('pinned-content1')} style={{ marginLeft: '-15px' }}>
                                        <button>
                                            <FontAwesomeIcon icon={faMessage} color="blue" />
                                        </button>
                                        <div className={cx('pinned-content-info')}>
                                            <h1>Tin nhắn</h1>
                                            {pinMessage.type === 'text' ? (
                                                <span
                                                    style={{
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        maxWidth: '1000px',
                                                    }}
                                                >
                                                    {pinMessage.memberId.userId.name}:{pinMessage.content}
                                                </span>
                                            ) : pinMessage.type === 'image' ? (
                                                <span>
                                                    {pinMessage.memberId.userId.name}
                                                    :
                                                    <img
                                                        className={cx('image-pin')}
                                                        src={pinMessage.content}
                                                        alt="imagePin"
                                                    />
                                                    Hình ảnh
                                                </span>
                                            ) : pinMessage.type === 'file' ? (
                                                <div className={cx('pin-file')}>
                                                    {(() => {
                                                        let { fileName, fileType } = extractFileNameAndType(
                                                            pinMessage.content,
                                                        );
                                                        let fileIcon = getFileIcon(fileType);

                                                        return (
                                                            <div className={cx('pin-file-content')}>
                                                                <span>
                                                                    {pinMessage.memberId.userId.name}: {fileIcon} File -{' '}
                                                                    {fileName}
                                                                </span>
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                            ) : (
                                                <span>
                                                    {pinMessage.memberId?.userId.name}
                                                    : <FontAwesomeIcon icon={faYoutube} /> Video
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <Tippy
                                            placement="bottom-end"
                                            arrow={false}
                                            offset={[-5, 5]}
                                            className={cx('tippy-message-ghim')}
                                            content={
                                                <div className={cx('content-tippy-ghim')} style={{ zIndex: 999 }}>
                                                    <button onClick={() => handleDeletePinMessage(pinMessage._id)}>
                                                        <span>Bỏ ghim</span>
                                                    </button>
                                                    <button onClick={() => handlePrioritizePinMessage(pinMessage._id)}>
                                                        <span>Đưa lên đầu</span>
                                                    </button>
                                                </div>
                                            }
                                            interactive={true}
                                            distance={100}
                                            trigger="click"
                                        >
                                            <button className={cx('pinned-content-btn')}>
                                                <FontAwesomeIcon icon={faEllipsis} />
                                            </button>
                                        </Tippy>
                                    </div>
                                </div>
                            ))}
                        </Box>
                    </Modal>

                    {arrayAllPin.length > 0 && (
                        <div key={arrayAllPin[0]._id} className={cx('pinned-content')}>
                            <div className={cx('pinned-content1')}>
                                <button>
                                    <FontAwesomeIcon icon={faMessage} color="blue" />
                                </button>
                                <div className={cx('pinned-content-info')}>
                                    <h1>Tin nhắn</h1>
                                    {arrayAllPin[0].type === 'text' ? (
                                        <span
                                            style={{
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                maxWidth: '900px',
                                            }}
                                        >
                                            {arrayAllPin[0].memberId.userId.name}:{arrayAllPin[0].content}
                                        </span>
                                    ) : arrayAllPin[0].type === 'image' ? (
                                        <span>
                                            {arrayAllPin[0].memberId.userId.name}
                                            :
                                            <img
                                                className={cx('image-pin')}
                                                src={arrayAllPin[0].content}
                                                alt="imagePin"
                                            />
                                            Hình ảnh
                                        </span>
                                    ) : arrayAllPin[0].type === 'file' ? (
                                        <div className={cx('pin-file')}>
                                            {(() => {
                                                let { fileName, fileType } = extractFileNameAndType(
                                                    arrayAllPin[0].content,
                                                );
                                                let fileIcon = getFileIcon(fileType);

                                                return (
                                                    <div className={cx('pin-file-content')}>
                                                        <span>
                                                            {arrayAllPin[0].memberId.userId.name}: {fileIcon} File -{' '}
                                                            {fileName}
                                                        </span>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    ) : (
                                        <span>
                                            {arrayAllPin[0].memberId?.userId.name}
                                            : <FontAwesomeIcon icon={faYoutube} /> Video
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <Tippy
                                    placement="bottom-end"
                                    arrow={false}
                                    offset={[-5, 5]}
                                    className={cx('tippy-message-ghim')}
                                    content={
                                        <div className={cx('content-tippy-ghim')}>
                                            <button onClick={() => handleDeletePinMessage(arrayAllPin[0]._id)}>
                                                <span>Bỏ ghim</span>
                                            </button>
                                        </div>
                                    }
                                    interactive={true}
                                    distance={100}
                                    trigger="click"
                                >
                                    <button className={cx('pinned-content-btn')}>
                                        <FontAwesomeIcon icon={faEllipsis} />
                                    </button>
                                </Tippy>
                                {arrayAllPin.length > 1 && (
                                    <button className={cx('pinned-content-btn-more')} onClick={handleOpenGhim}>
                                        <span>{arrayAllPin.length - 1} ghim khác</span>
                                        <FontAwesomeIcon icon={faCaretDown} />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    <div
                        className={cx('content-message-conver')}
                        ref={(node) => {
                            contentRef.current = node;
                            messageContainerRef.current = node;
                        }}
                    >
                        {chatItem.messages.map((message, index) => {
                            // Kiểm tra xem tin nhắn có bị xóa bởi user hiện tại không
                            const isDeletedByCurrentUser = message.deleteMember.some(
                                (member) => member?.userId === getUser?._id,
                            );

                            if (isDeletedByCurrentUser) {
                                return null;
                            }

                            const messageStyle = {
                                justifyContent: 'space-between',
                                marginLeft: 'auto',
                                marginRight: '10px',
                            };

                            const messageTextStyle = {
                                marginLeft: '150px',
                                marginRight: '5px',
                                backgroundColor: '#e5efff',
                                minWidth: '120px',
                            };
                            const fileMessageTextStyle = {
                                marginLeft: '120px',
                                marginRight: '8px',
                                maxWidth: '800px',
                                maxHeight: '420px',
                                borderRadius: '10px',
                                backgroundColor: 'transparent',
                            };

                            const additionalStyle = {
                                marginRight: '120px',
                                maxWidth: '800px',
                                maxHeight: '420px',
                                borderRadius: '10px',
                                backgroundColor: 'transparent',
                            };

                            // Kiểm tra loại tin nhắn là 'notify'
                            if (message.type === 'notify') {
                                return (
                                    <div key={index} className={cx('content-message-notify')}>
                                        <div className={cx('content-message-notify1')}>
                                            <p
                                                style={{
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                }}
                                                dangerouslySetInnerHTML={{ __html: message.content }}
                                                className={cx('p-notify')}
                                            />
                                        </div>
                                    </div>
                                );
                            }
                            return (
                                <div
                                    key={index}
                                    className={cx('content-message', message.type === 'image' && 'file-message')}
                                    style={message?.memberId.userId?._id === getUser?._id ? messageStyle : null}
                                >
                                    {message.memberId && (
                                        <div className={cx('content-title')}>
                                            {message.memberId.userId?._id !== getUser?._id &&
                                                message.memberId.userId?.avatar && (
                                                    <img
                                                        key={message.memberId.userId?._id}
                                                        src={message.memberId.userId?.avatar}
                                                        alt="User Avatar"
                                                        className={cx('img-content')}
                                                    />
                                                )}
                                        </div>
                                    )}
                                    <div
                                        className={cx('content-message-text')}
                                        style={
                                            message.memberId.userId?._id === getUser?._id
                                                ? message.type === 'image' && message?.recallMessage === false
                                                    ? fileMessageTextStyle
                                                    : messageTextStyle
                                                : message.type === 'image' && message?.recallMessage === false
                                                ? additionalStyle
                                                : null
                                        }
                                    >
                                        <div className={cx('contain-text')}>
                                            <Tippy
                                                delay={[200, 0]}
                                                placement="right-end"
                                                arrow={false}
                                                offset={[-30, 16]}
                                                className={cx('tippy-message')}
                                                content={
                                                    <div className={cx('content-tippy1')}>
                                                        <button onClick={() => handleToggleReply(message)}>
                                                            <FontAwesomeIcon icon={faQuoteRight} />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDeleteButtonClick(
                                                                    conversationId,
                                                                    message._id,
                                                                    memberId,
                                                                )
                                                            }
                                                        >
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleOpenChiaSe(message?.content, message?.type)
                                                            }
                                                        >
                                                            <FontAwesomeIcon icon={faShare} />
                                                        </button>
                                                        {message.memberId.userId?._id === getUser?._id && (
                                                            <button
                                                                onClick={() =>
                                                                    handleThuHoiButtonClick(
                                                                        conversationId,
                                                                        message._id,
                                                                        memberId,
                                                                    )
                                                                }
                                                            >
                                                                <FontAwesomeIcon icon={faRotateBack} />
                                                            </button>
                                                        )}
                                                        <button onClick={() => handlePinMessage(message._id)}>
                                                            <FontAwesomeIcon icon={faThumbtack} />
                                                        </button>
                                                    </div>
                                                }
                                                interactive={true}
                                                distance={100}
                                            >
                                                <div>
                                                    {message.reply.length > 0 && (
                                                        <div
                                                            className={cx('message-content-reply')}
                                                            style={
                                                                message.memberId.userId?._id === getUser?._id
                                                                    ? { backgroundColor: 'rgb(204, 223, 249)' }
                                                                    : null
                                                            }
                                                        >
                                                            <div className={cx('message-content-reply-boder')}></div>

                                                            {message.reply[0] && (
                                                                <>
                                                                    {message.reply[0].type === 'image' && (
                                                                        <div
                                                                            className={cx(
                                                                                'footer-chat-input-top-image1',
                                                                            )}
                                                                        >
                                                                            <img
                                                                                src={message.reply[0].content}
                                                                                alt="User Avatar"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                    {message.reply[0].type === 'file' && (
                                                                        <div
                                                                            className={cx(
                                                                                'footer-chat-input-top-file1',
                                                                            )}
                                                                        >
                                                                            {(() => {
                                                                                let { fileType } =
                                                                                    extractFileNameAndType(
                                                                                        message.reply[0].content,
                                                                                    );
                                                                                let fileIcon = getFileIcon(fileType);
                                                                                return (
                                                                                    <div className={'footer-chat-file'}>
                                                                                        {fileIcon}
                                                                                    </div>
                                                                                );
                                                                            })()}
                                                                        </div>
                                                                    )}
                                                                    {message.reply[0].type === 'video' && (
                                                                        <div
                                                                            className={cx(
                                                                                'footer-chat-input-top-file1',
                                                                            )}
                                                                        >
                                                                            {(() => {
                                                                                let { fileType } =
                                                                                    extractFileNameAndType(
                                                                                        message.reply[0].content,
                                                                                    );
                                                                                let fileIcon = getFileIcon(fileType);
                                                                                return (
                                                                                    <div className={'footer-chat-file'}>
                                                                                        {fileIcon}
                                                                                    </div>
                                                                                );
                                                                            })()}
                                                                        </div>
                                                                    )}
                                                                    <div>
                                                                        <h1>
                                                                            {message.reply[0].memberId.userId?.name}
                                                                        </h1>

                                                                        {message.reply[0].type === 'image' ? (
                                                                            <span>[Hình ảnh]</span>
                                                                        ) : message.reply[0].type === 'video' ? (
                                                                            <span>[Video]</span>
                                                                        ) : message.reply[0].type === 'file' ? (
                                                                            <span>[File]</span>
                                                                        ) : message.reply[0].type === 'text' ? (
                                                                            <span>{message.reply[0].content}</span>
                                                                        ) : null}
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    )}
                                                    {chatItem.type === 'Group' &&
                                                        message.memberId.userId?._id !== getUser?._id && (
                                                            <p className={cx('content-message-title')}>
                                                                {message.memberId?.userId?.name}
                                                            </p>
                                                        )}
                                                    {message.recallMessage ? (
                                                        <p
                                                            className={cx('content-message-p')}
                                                            style={{ color: 'gray' }}
                                                        >
                                                            Tin nhắn đã được thu hồi
                                                        </p>
                                                    ) : message.type === 'text' ? (
                                                        <p className={cx('content-message-p')}>{message.content}</p>
                                                    ) : message.type === 'image' ? (
                                                        <div>
                                                            <div className={cx('file-message')}>
                                                                <img
                                                                    className={cx('img-send')}
                                                                    src={message.content}
                                                                    alt="File"
                                                                    onClick={() => openLightbox(index, message.content)}
                                                                />
                                                            </div>
                                                            {isOpen && (
                                                                <div
                                                                    onClick={(e) => {
                                                                        if (e.target.tagName.toLowerCase() !== 'img') {
                                                                            closeLightbox();
                                                                        }
                                                                    }}
                                                                >
                                                                    <Lightbox
                                                                        mainSrc={currentImage}
                                                                        onCloseRequest={closeLightbox}
                                                                        wrapperClassName={cx('fullscreen-lightbox')}
                                                                        showCloseButton={false}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : message.type === 'audio' ? (
                                                        <div className={cx('audio-message')}>
                                                            <audio controls>
                                                                <source src={message.content} type="audio/mpeg" />
                                                            </audio>
                                                        </div>
                                                    ) : message.type === 'file' ? (
                                                        (() => {
                                                            let { fileName, fileType } = extractFileNameAndType(
                                                                message.content,
                                                            );
                                                            let fileIcon = getFileIcon(fileType);
                                                            return (
                                                                <div
                                                                    className={cx('file-message1')}
                                                                    onClick={() => handleClick(message.content)}
                                                                >
                                                                    <p className={cx('file-css')}>
                                                                        {fileIcon}
                                                                        {fileName}
                                                                    </p>
                                                                </div>
                                                            );
                                                        })()
                                                    ) : message.type === 'video' ? (
                                                        <div className={cx('video-message')}>
                                                            <video controls width={300}>
                                                                <source src={message.content} type="video/mp4" />
                                                            </video>
                                                        </div>
                                                    ) : null}
                                                    <span className={cx('content-title-span')}>
                                                        {formatTime(message.createAt)}
                                                    </span>
                                                </div>
                                            </Tippy>
                                        </div>

                                        <Tippy
                                            placement={
                                                calculateTotalReactions(message) === 0
                                                    ? 'top'
                                                    : message.memberId?.userId?._id !== getUser?._id &&
                                                      calculateTotalReactions(message) === 0
                                                    ? 'top'
                                                    : message.memberId?.userId?._id !== getUser?._id &&
                                                      calculateTotalReactions(message) !== 0
                                                    ? 'top'
                                                    : message.memberId?.userId?._id === getUser?._id &&
                                                      calculateTotalReactions(message) !== 0
                                                    ? 'top'
                                                    : 'top'
                                            }
                                            arrow={false}
                                            offset={
                                                calculateTotalReactions(message) === 0 &&
                                                message.memberId?.userId?._id === getUser?._id
                                                    ? [-170, -5]
                                                    : message.memberId?.userId?._id !== getUser?._id &&
                                                      calculateTotalReactions(message) === 0
                                                    ? [-100, -4]
                                                    : message.memberId?.userId?._id !== getUser?._id &&
                                                      calculateTotalReactions(message) !== 0
                                                    ? [-80, -4]
                                                    : message.memberId?.userId?._id === getUser?._id &&
                                                      calculateTotalReactions(message) !== 0
                                                    ? [-138, -3]
                                                    : [-115, -3]
                                            }
                                            className={cx('tippy-reaction')}
                                            content={
                                                <div className={cx('content-tippy-reaction')}>
                                                    <div style={{ marginLeft: '-2px', margin: 'auto' }}>
                                                        <button
                                                            className={cx('reaction-icon1')}
                                                            onClick={() =>
                                                                handleAddReaction('Like', message._id, message)
                                                            }
                                                        >
                                                            <img src={iconLike} alt="icon-reaction" />
                                                        </button>
                                                        <button
                                                            className={cx('reaction-icon1')}
                                                            onClick={() =>
                                                                handleAddReaction('Love', message._id, message)
                                                            }
                                                        >
                                                            <img src={iconTim} alt="icon-reaction" />
                                                        </button>
                                                        <button
                                                            className={cx('reaction-icon1')}
                                                            onClick={() =>
                                                                handleAddReaction('Smile', message._id, message)
                                                            }
                                                        >
                                                            <img src={iconSmile} alt="icon-reaction" />
                                                        </button>
                                                        <button
                                                            className={cx('reaction-icon1')}
                                                            onClick={() =>
                                                                handleAddReaction('Wow', message._id, message)
                                                            }
                                                        >
                                                            <img src={iconWow} alt="icon-reaction" />
                                                        </button>
                                                        <button
                                                            className={cx('reaction-icon1')}
                                                            onClick={() =>
                                                                handleAddReaction('Sad', message._id, message)
                                                            }
                                                        >
                                                            <img src={iconSad} alt="icon-reaction" />
                                                        </button>
                                                        <button
                                                            className={cx('reaction-icon1')}
                                                            onClick={() =>
                                                                handleAddReaction('Angry', message._id, message)
                                                            }
                                                        >
                                                            <img src={iconAngry} alt="icon-reaction" />
                                                        </button>
                                                    </div>

                                                    {Object.values(calculateTotalReactionsByUser(message.reaction)).map(
                                                        (member) => (
                                                            <div key={member.userId} className={cx('reaction-member')}>
                                                                {member.quantity > 0 &&
                                                                    member.userId === getUser._id && (
                                                                        <button
                                                                            className={cx('reaction-icon2')}
                                                                            onClick={() =>
                                                                                handleDeleteReaction(
                                                                                    message._id,
                                                                                    message,
                                                                                )
                                                                            }
                                                                        >
                                                                            <FontAwesomeIcon icon={faClose} />
                                                                        </button>
                                                                    )}
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            }
                                            interactive={true}
                                            distance={100}
                                        >
                                            <div
                                                className={cx('reaction')}
                                                style={{
                                                    marginTop: message.type === 'image' ? '-40px' : 'auto',
                                                }}
                                            >
                                                {calculateTotalReactions(message) > 0 && (
                                                    <div
                                                        className={cx('reaction-contet-icon')}
                                                        style={{
                                                            marginLeft:
                                                                message.memberId?.userId?._id === getUser?._id
                                                                    ? '25px'
                                                                    : '',
                                                        }}
                                                        onClick={() => handleOpenReaction(message)}
                                                    >
                                                        <div
                                                            style={{
                                                                marginRight: '3px',
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                            }}
                                                        >
                                                            {message.reaction
                                                                .flatMap((reaction) =>
                                                                    reaction.reactions.map((react) => ({
                                                                        typeReaction: react?.typeReaction,
                                                                        quantity: react?.quantity,
                                                                    })),
                                                                )
                                                                .reduce((acc, curr) => {
                                                                    // Tìm hoặc cập nhật số lượng của mỗi loại phản ứng
                                                                    const index = acc.findIndex(
                                                                        (item) =>
                                                                            item.typeReaction === curr.typeReaction,
                                                                    );
                                                                    if (index !== -1) {
                                                                        acc[index].quantity += curr?.quantity;
                                                                    } else {
                                                                        acc.push(curr);
                                                                    }
                                                                    return acc;
                                                                }, [])
                                                                .sort((a, b) => b.quantity - a.quantity) // Sắp xếp theo số lượng giảm dần
                                                                .slice(0, 3) // Chỉ lấy tối đa 3 loại phản ứng
                                                                .map((reaction) => (
                                                                    // Render biểu tượng cho mỗi loại phản ứng duy nhất
                                                                    <img
                                                                        key={reaction.typeReaction}
                                                                        src={
                                                                            reactionIconMapping[reaction.typeReaction]
                                                                                .icon
                                                                        }
                                                                        className={cx('icon-reaction')}
                                                                        alt="icon"
                                                                    />
                                                                ))}
                                                        </div>

                                                        <span>{calculateTotalReactions(message)}</span>
                                                    </div>
                                                )}

                                                <button
                                                    className={cx('reaction-icon')}
                                                    style={{
                                                        opacity:
                                                            calculateTotalReactions(message) > 0
                                                                ? '1'
                                                                : message.recallMessage
                                                                ? '0'
                                                                : '',
                                                    }}
                                                >
                                                    <img
                                                        src={iconLike}
                                                        className={cx('icon-reaction-cx')}
                                                        alt="icon1"
                                                    />
                                                </button>
                                            </div>
                                        </Tippy>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className={cx('modal-container')}>
                    {modalImgOpen && (
                        <Modal
                            open={openModal}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                            className={cx('model-image')}
                        >
                            <Box className={cx('model-changepass-container')}>
                                <button className={cx('modal-button')} onClick={closeModal}>
                                    <FontAwesomeIcon icon={faClose} />
                                </button>
                                <div className={cx('content-modal')}></div>
                            </Box>
                        </Modal>
                    )}
                </div>

                <div className={cx('footer')}>
                    <div className={cx('footer-icon')}>
                        {buttonsData.map((button, index) => (
                            <Tippy
                                key={index}
                                delay={[700, 0]}
                                content={button.content}
                                placement="bottom"
                                className={cx('tippy')}
                            >
                                {button.icon === faImage ? (
                                    <form>
                                        <label htmlFor="imageSend" className={cx('footer-lable-icon')}>
                                            <div className={cx('icon4')}>
                                                <FontAwesomeIcon icon={button.icon} />
                                            </div>
                                            <input
                                                className={cx('imageInput')}
                                                id="imageSend"
                                                type="file"
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                onChange={handleImageChange}
                                            />
                                        </label>
                                    </form>
                                ) : button.icon === faPaperclip ? (
                                    <form>
                                        <label htmlFor="fileSend" className={cx('footer-lable-icon')}>
                                            <div className={cx('icon4')} style={{ marginLeft: '7px' }}>
                                                <FontAwesomeIcon icon={button.icon} />
                                            </div>
                                            <input
                                                className={cx('imageInput')}
                                                id="fileSend"
                                                type="file"
                                                accept="*"
                                                style={{ display: 'none', marginLeft: '5px' }}
                                                onChange={handleFileChange}
                                            />
                                        </label>
                                    </form>
                                ) : button.icon === faFileVideo ? (
                                    <form>
                                        <label htmlFor="videoSend" className={cx('footer-lable-icon')}>
                                            <div className={cx('icon4')} style={{ marginLeft: '7px' }}>
                                                <FontAwesomeIcon icon={button.icon} />
                                            </div>
                                            <input
                                                className={cx('imageInput')}
                                                id="videoSend"
                                                type="file"
                                                accept="audio/mp3, audio/mpeg, video/mp4"
                                                style={{ display: 'none', marginLeft: '5px' }}
                                                onChange={handleVideoChange}
                                            />
                                        </label>
                                    </form>
                                ) : (
                                    <button
                                        className={cx('button')}
                                        onClick={() => {
                                            if (button.icon === faFaceSmile) {
                                                togglePicker1();
                                            }
                                        }}
                                    >
                                        <FontAwesomeIcon className={cx('icon4')} icon={button.icon} />
                                    </button>
                                )}
                            </Tippy>
                        ))}

                        {showPicker1 && (
                            <div className={cx('emoji1')} ref={pickerRef}>
                                <Picker
                                    data={data}
                                    emojiSize={20}
                                    emojiButtonSize={35}
                                    maxFrequentRows={0}
                                    onEmojiSelect={addEmoji}
                                    custom={true}
                                />
                            </div>
                        )}
                    </div>

                    <div className={cx('footer-chat')}>
                        {showReply && messageReply && (
                            <div className={cx('footer-chat-input-top')}>
                                <div className={cx('footer-chat-input-top-left')}></div>
                                {messageReply.type === 'image' && (
                                    <div className={cx('footer-chat-input-top-image')}>
                                        <img src={messageReply.content} alt="User Avatar" />
                                    </div>
                                )}
                                {messageReply.type === 'file' && (
                                    <div className={cx('footer-chat-input-top-file')}>
                                        {(() => {
                                            let { fileType } = extractFileNameAndType(messageReply.content);

                                            let fileIcon = getFileIcon(fileType);
                                            return <div>{fileIcon}</div>;
                                        })()}
                                    </div>
                                )}
                                {messageReply.type === 'video' && (
                                    <div className={cx('footer-chat-input-top-file')}>
                                        {(() => {
                                            let { fileType } = extractFileNameAndType(messageReply.content);

                                            let fileIcon = getFileIcon(fileType);
                                            return <div>{fileIcon}</div>;
                                        })()}
                                    </div>
                                )}
                                <div className={cx('footer-chat-input-top-center')}>
                                    <h1>Trả lời {messageReply.memberId.userId?.name}</h1>
                                    {(() => {
                                        let { fileName } = extractFileNameAndType(messageReply.content);

                                        return (
                                            <div className={cx('footer-chat-input-top-center')}>
                                                {messageReply.type === 'image' ? (
                                                    <span>[Hình ảnh]</span>
                                                ) : messageReply.type === 'file' ? (
                                                    <span>{fileName}</span>
                                                ) : messageReply.type === 'video' ? (
                                                    <span>{fileName}</span>
                                                ) : (
                                                    <span>{messageReply.content}</span>
                                                )}
                                            </div>
                                        );
                                    })()}
                                </div>
                                <button className={cx('footer-chat-input-top-btn')} onClick={() => setShowReply(false)}>
                                    <FontAwesomeIcon icon={faXmark} />
                                </button>
                            </div>
                        )}
                        <div className={cx('footer-chat-input-bottom')} style={{ marginTop: showReply ? '0' : '10px' }}>
                            <input
                                ref={inputRef}
                                type="text"
                                className={cx('input')}
                                placeholder="Nhập @, tin nhắn mới"
                                onKeyPress={handleKeyPress}
                            />
                            <div className={cx('footer-chat-icon')}>
                                <button>
                                    <FontAwesomeIcon icon={faThumbsUp} />
                                </button>
                                <button style={{ backgroundColor: showPicker ? '#ccc' : 'initial' }}>
                                    <FontAwesomeIcon icon={faFaceSmile} onClick={togglePicker} />
                                </button>
                                {showPicker && (
                                    <div className={cx('emoji')} ref={pickerRef}>
                                        <Picker
                                            data={data}
                                            emojiSize={20}
                                            emojiButtonSize={35}
                                            maxFrequentRows={0}
                                            onEmojiSelect={addEmoji}
                                            custom={true}
                                        />
                                    </div>
                                )}
                                <button
                                    className={cx('btn-send')}
                                    onClick={showReply ? addReply : sendNewMessageToServer}
                                >
                                    GỬI
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {infoVisible && !showTippy ? (
                <div style={{ position: 'relative' }}>
                    <Modal
                        open={openChiTietImage}
                        onClose={handleCloseChiTietImage}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                        className={cx('model-image')}
                        sx={{
                            position: 'absolute',
                            top: '31%',
                            left: '95.6%',
                            marginTop: '9%',
                            marginLeft: '-6.6%',
                            transform: 'translate(-50%, -50%)',
                            width: 335,
                            height: 736,
                            bgcolor: 'white',
                        }}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                width: 335,
                                height: 736,
                                bgcolor: 'white',
                                border: '1px solid #D6DBE1',
                            }}
                        >
                            <div className={cx('content-modal-image')}>
                                <button onClick={handleCloseChiTietImage}>
                                    <FontAwesomeIcon
                                        icon={faChevronLeft}
                                        style={{ marginLeft: '15px', fontSize: '25px' }}
                                    />
                                </button>
                                <h2>Kho lưu trữ</h2>
                                <p>Chọn</p>
                            </div>

                            <TabContext value={value}>
                                <TabList
                                    onChange={handleChange}
                                    aria-label="Message"
                                    style={{ borderBottom: '1px solid #D6DBE1' }}
                                >
                                    <Tab
                                        label="Ảnh/Video"
                                        value="1"
                                        sx={{ fontSize: 14, fontWeight: 'bold', textTransform: 'none', color: 'black' }}
                                    />
                                    <Tab
                                        label="Files"
                                        value="2"
                                        sx={{ fontSize: 14, fontWeight: 'bold', textTransform: 'none', color: 'black' }}
                                    />
                                </TabList>
                                <TabPanel value="1">
                                    <div className={cx('content-image-info')}>
                                        <div className={cx('info-image')}>
                                            <div className={cx('info-image-container-wrapper')}>
                                                {Object.entries(groupMessagesByDate(chatItem.messages))
                                                    .slice()
                                                    .reverse()
                                                    .map(([date, messages]) => (
                                                        <div
                                                            key={date}
                                                            style={{
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                width: '305px',
                                                            }}
                                                        >
                                                            <div className={cx('info-image-container-null')}></div>
                                                            <p
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    fontSize: '16px',
                                                                    marginTop: '5px',
                                                                }}
                                                            >
                                                                {date}
                                                            </p>

                                                            <div className={cx('info-render')}>
                                                                {messages
                                                                    .filter(
                                                                        (message) =>
                                                                            (message.type === 'image') |
                                                                                (message.type === 'video') &&
                                                                            message.recallMessage === false &&
                                                                            message.deleteMember
                                                                                .map((member) => member.userId)
                                                                                .indexOf(getUser?._id) === -1,
                                                                    )
                                                                    .slice()
                                                                    .reverse()
                                                                    .map((message, index) => {
                                                                        if (message.type === 'image') {
                                                                            return (
                                                                                <div key={index}>
                                                                                    <img
                                                                                        src={message.content}
                                                                                        alt={
                                                                                            message.memberId.userId.name
                                                                                        }
                                                                                        className={cx('img-info')}
                                                                                        onClick={() =>
                                                                                            openLightbox(
                                                                                                index,
                                                                                                message.content,
                                                                                            )
                                                                                        }
                                                                                    />

                                                                                    {isOpen && (
                                                                                        <div
                                                                                            onClick={(e) => {
                                                                                                if (
                                                                                                    e.target.tagName.toLowerCase() !==
                                                                                                    'img'
                                                                                                ) {
                                                                                                    closeLightbox();
                                                                                                }
                                                                                            }}
                                                                                        >
                                                                                            <Lightbox
                                                                                                mainSrc={currentImage}
                                                                                                onCloseRequest={
                                                                                                    closeLightbox
                                                                                                }
                                                                                                wrapperClassName={cx(
                                                                                                    'fullscreen-lightbox',
                                                                                                )}
                                                                                                showCloseButton={false}
                                                                                            />
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            );
                                                                        } else if (message.type === 'video') {
                                                                            return (
                                                                                <video
                                                                                    key={index}
                                                                                    controls
                                                                                    width={91}
                                                                                    height={91}
                                                                                    src={message.content}
                                                                                    style={{
                                                                                        marginTop: '-3px',
                                                                                        marginLeft: '5px',
                                                                                        marginRight: '5px',
                                                                                        borderRadius: '5px',
                                                                                    }}
                                                                                ></video>
                                                                            );
                                                                        } else {
                                                                            return null;
                                                                        }
                                                                    })}
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                </TabPanel>
                                <TabPanel value="2">
                                    <div className={cx('content-image-info')}>
                                        <div className={cx('info-image')}>
                                            <div className={cx('info-image-container-wrapper')}>
                                                {Object.entries(groupMessagesByDate(chatItem.messages))
                                                    .slice()
                                                    .reverse()
                                                    .map(([date, messages]) => (
                                                        <div
                                                            key={date}
                                                            style={{
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                width: '305px',
                                                            }}
                                                        >
                                                            <div className={cx('info-image-container-null')}></div>
                                                            <p
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    fontSize: '16px',
                                                                    marginTop: '5px',
                                                                }}
                                                            >
                                                                {date}
                                                            </p>

                                                            <div className={cx('info-render')}>
                                                                {messages
                                                                    .filter(
                                                                        (message) =>
                                                                            message.type === 'file' &&
                                                                            message.recallMessage === false &&
                                                                            message.deleteMember
                                                                                .map((member) => member.userId)
                                                                                .indexOf(getUser?._id) === -1,
                                                                    )
                                                                    .slice()
                                                                    .reverse()
                                                                    .map((message, index) => {
                                                                        if (message.type === 'file') {
                                                                            let { fileName, fileType } =
                                                                                extractFileNameAndType(
                                                                                    message.content,
                                                                                    25,
                                                                                );
                                                                            let fileIcon = getFileIcon(fileType);
                                                                            return (
                                                                                <div
                                                                                    className={cx('info-file1')}
                                                                                    onClick={() =>
                                                                                        handleClick(message.content)
                                                                                    }
                                                                                >
                                                                                    <p className={cx('file-css1')}>
                                                                                        {fileIcon}

                                                                                        {fileName}
                                                                                    </p>
                                                                                </div>
                                                                            );
                                                                        } else {
                                                                            return null;
                                                                        }
                                                                    })}
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                </TabPanel>
                            </TabContext>
                        </Box>
                    </Modal>

                    <div className={cx('info')} ref={infoRef} style={{ position: 'absolute' }}>
                        <div className={cx('header')}>
                            {chatItem.type === 'Group' ? (
                                <h2 className={cx('h2-header')}>Thông tin nhóm</h2>
                            ) : (
                                chatItem.members.map((member) => {
                                    if (member.userId?._id !== getUser?._id) {
                                        return <h2 className={cx('h2-header')}>Thông tin hội thoại</h2>;
                                    }
                                    return null;
                                })
                            )}
                        </div>

                        <div className={cx('control')}>
                            <div className={cx('nav')}>
                                <div className={cx('nav-top')}>
                                    <div className={cx('img')}>
                                        {chatItem.type === 'Group' ? (
                                            // Hiển thị avatar mặc định
                                            <img
                                                src={chatItem.groupImage}
                                                alt="Default Avatar"
                                                className={cx('img-nav')}
                                            />
                                        ) : (
                                            // Hiển thị các avatar của thành viên (nếu có)
                                            chatItem.members.map((member) => {
                                                if (member.userId?._id !== getUser?._id) {
                                                    return (
                                                        <img
                                                            key={member._id}
                                                            src={member.userId.avatar}
                                                            alt={member.userId.name}
                                                            className={cx('img-nav')}
                                                        />
                                                    );
                                                }
                                                return null;
                                            })
                                        )}
                                    </div>
                                    <div className={cx('nav-top-footer')}>
                                        {chatItem.type === 'Group' ? (
                                            <h2 className={cx('h2-nav')}>{chatItem.name}</h2>
                                        ) : (
                                            chatItem.members.map((member) => {
                                                if (member.userId?._id !== getUser?._id) {
                                                    return <h2 className={cx('h2-nav')}>{member.userId.name}</h2>;
                                                }
                                                return null;
                                            })
                                        )}
                                        {chatItem.type === 'Group' && (
                                            <button
                                                className={cx('nav-top-button')}
                                                onClick={handleOpenUpdateNameConversation}
                                            >
                                                <FontAwesomeIcon icon={faPencil} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className={cx('nav-footer')}>
                                    {chatItem.type === 'Group' ? (
                                        <>
                                            <div className={cx('nav-footer-nav')}>
                                                <button>
                                                    <FontAwesomeIcon icon={faBell} />
                                                </button>
                                                <h4>Bật thông báo</h4>
                                            </div>
                                            <div className={cx('nav-footer-nav')}>
                                                <button>
                                                    <FontAwesomeIcon icon={faThumbTack} />
                                                </button>
                                                <h4>Ghim hội thoại</h4>
                                            </div>
                                            <div className={cx('nav-footer-nav')} onClick={handleOpenModalAddUser}>
                                                <button>
                                                    <FontAwesomeIcon icon={faUsers} />
                                                </button>
                                                <h4>Thêm thành viên</h4>
                                            </div>
                                            <div className={cx('nav-footer-nav')}>
                                                <button>
                                                    <FontAwesomeIcon icon={faGear} />
                                                </button>
                                                <h4>Quản lý nhóm</h4>
                                            </div>
                                        </>
                                    ) : null}
                                </div>
                            </div>

                            {chatItem.type === 'Group' && (
                                <div className={cx('title')} style={{ height: getTitleHeight(1) }}>
                                    <button className={cx('title-top')} onClick={() => toggleTitle(1)}>
                                        <h2>Thành viên nhóm</h2>
                                        <FontAwesomeIcon icon={faCaretDown} className={cx('title-center-icon')} />
                                    </button>
                                    {openTitles[1] && (
                                        <>
                                            <button className={cx('title-center')} onClick={toggleTippy}>
                                                <div className={cx('title-center1')}>
                                                    <FontAwesomeIcon icon={faUsers} />
                                                    <h2>{chatItem.members.length} thành viên</h2>
                                                </div>
                                            </button>
                                            <button className={cx('title-bottom')}>
                                                <FontAwesomeIcon icon={faLink} />
                                                <div className={cx('title-bottom-nav')}>
                                                    <h2>Link thanh gia nhóm</h2>
                                                    <p>zelo.me/g/kugopy333</p>
                                                </div>
                                                <div className={cx('title-icon')}>
                                                    <button>
                                                        <FontAwesomeIcon icon={faCopy} />
                                                    </button>
                                                    <button>
                                                        <FontAwesomeIcon icon={faShare} />
                                                    </button>
                                                </div>
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}

                            <div className={cx('title')} style={{ height: getTitleHeight(2) }}>
                                {chatItem.type === 'Group' && (
                                    <button className={cx('title-top')} onClick={() => toggleTitle(2)}>
                                        <h2>Bảng tin nhóm</h2>
                                        <FontAwesomeIcon icon={faCaretDown} className={cx('title-center-icon')} />
                                    </button>
                                )}
                                {openTitles[2] && (
                                    <>
                                        <button className={cx('title-center')}>
                                            <FontAwesomeIcon icon={faClock} />
                                            <h2>Danh sách nhắc hẹn</h2>
                                        </button>
                                        <button className={cx('title-center')}>
                                            <FontAwesomeIcon icon={faNoteSticky} rotation={180} />
                                            <h2>Ghi chú, ghim bình chọn</h2>
                                        </button>
                                    </>
                                )}
                            </div>

                            <div className={cx('title')} style={{ height: getTitleHeight(3), position: 'relative' }}>
                                <button className={cx('title-top')} onClick={() => toggleTitle(3)}>
                                    <h2>Ảnh/Video</h2>
                                    <FontAwesomeIcon icon={faCaretDown} className={cx('title-center-icon')} />
                                </button>
                                {openTitles[3] && (
                                    <>
                                        <div className={cx('title-image')}>
                                            {chatItem.messages
                                                .filter(
                                                    (message) =>
                                                        (message.type === 'image') | (message.type === 'video') &&
                                                        message.recallMessage === false &&
                                                        message.deleteMember
                                                            .map((member) => member.userId)
                                                            .indexOf(getUser?._id) === -1,
                                                )
                                                .slice(-8)
                                                .reverse()
                                                .map((message, index) => {
                                                    if (message.type === 'image') {
                                                        return (
                                                            <div key={index}>
                                                                <img
                                                                    src={message.content}
                                                                    alt={message.memberId.userId.name}
                                                                    className={cx('img')}
                                                                    onClick={() => openLightbox(index, message.content)}
                                                                />

                                                                {isOpen && (
                                                                    <div
                                                                        onClick={(e) => {
                                                                            if (
                                                                                e.target.tagName.toLowerCase() !== 'img'
                                                                            ) {
                                                                                closeLightbox();
                                                                            }
                                                                        }}
                                                                    >
                                                                        <Lightbox
                                                                            mainSrc={currentImage}
                                                                            onCloseRequest={closeLightbox}
                                                                            wrapperClassName={cx('fullscreen-lightbox')}
                                                                            showCloseButton={false}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    } else if (message.type === 'video') {
                                                        return (
                                                            // eslint-disable-next-line jsx-a11y/img-redundant-alt
                                                            <video
                                                                key={index}
                                                                controls
                                                                width={73}
                                                                height={73}
                                                                src={message.content}
                                                                style={{ borderRadius: '5px' }}
                                                            ></video>
                                                        );
                                                    } else {
                                                        return null;
                                                    }
                                                })}
                                        </div>

                                        <button
                                            className={cx('title-button')}
                                            onClick={() => {
                                                handleOpenChiTietImage();
                                                setValue('1');
                                            }}
                                        >
                                            <h2>Xem tất cả</h2>
                                        </button>
                                    </>
                                )}
                            </div>

                            <div className={cx('title')} style={{ height: getTitleHeight(4) }}>
                                <button className={cx('title-top')} onClick={() => toggleTitle(4)}>
                                    <h2>File</h2>
                                    <FontAwesomeIcon icon={faCaretDown} className={cx('title-center-icon')} />
                                </button>
                                {openTitles[4] && (
                                    <>
                                        <div className={cx('title-file1')}>
                                            {chatItem.messages
                                                .filter(
                                                    (message) =>
                                                        message.type === 'file' &&
                                                        message.recallMessage === false &&
                                                        message.deleteMember
                                                            .map((member) => member.userId)
                                                            .indexOf(getUser?._id) === -1,
                                                )
                                                .slice(-3)
                                                .reverse()
                                                .map((message, index) => {
                                                    if (message.type === 'file') {
                                                        let { fileName, fileType } = extractFileNameAndType(
                                                            message.content,
                                                            28,
                                                        );
                                                        let fileIcon = getFileIcon(fileType);
                                                        return (
                                                            <div
                                                                className={cx('info-file')}
                                                                onClick={() => handleClick(message.content)}
                                                            >
                                                                <p className={cx('file-css1')}>
                                                                    {fileIcon}
                                                                    {fileName}
                                                                </p>
                                                            </div>
                                                        );
                                                    } else {
                                                        return null;
                                                    }
                                                })}
                                        </div>

                                        <button
                                            className={cx('title-button')}
                                            onClick={() => {
                                                handleOpenChiTietImage();
                                                setValue('2');
                                            }}
                                        >
                                            <h2>Xem tất cả</h2>
                                        </button>
                                    </>
                                )}
                            </div>

                            <div className={cx('title')} style={{ height: getTitleHeight(5) }}>
                                <button className={cx('title-top')} onClick={() => toggleTitle(5)}>
                                    <h2>Thiết lập bảo mật</h2>
                                    <FontAwesomeIcon icon={faCaretDown} className={cx('title-center-icon')} />
                                </button>
                                {openTitles[5] && (
                                    <>
                                        <button className={cx('title-center')}>
                                            <FontAwesomeIcon icon={faEyeSlash} />
                                            <h2>Ẩn cuộc trò chuyện</h2>
                                        </button>
                                        <button className={cx('title-center')}>
                                            <FontAwesomeIcon icon={faTrashCan} />
                                            <h2>Xóa lịch sử trò chuyện</h2>
                                        </button>
                                        {chatItem.type === 'Group' && (
                                            <button className={cx('title-center')} onClick={handleOpenLeave}>
                                                <FontAwesomeIcon icon={faRightFromBracket} />
                                                <h2>Rời nhóm</h2>
                                            </button>
                                        )}
                                        {chatItem.leader.userId?._id === getUser?._id && chatItem.type === 'Group' && (
                                            <button
                                                className={cx('title-center')}
                                                style={{ color: 'red' }}
                                                onClick={handleOpenXacNhan}
                                            >
                                                <FontAwesomeIcon icon={faCircleXmark} />
                                                <h2>Giải tán nhóm</h2>
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <Tippy
                    content={
                        <div
                            className={cx('tippy-container')}
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            <div className={cx('tippy-infoheader')}>
                                <button className={cx('tippy-button-info')} onClick={handleTippyClose}>
                                    <FontAwesomeIcon icon={faChevronLeft} size="2x" />
                                </button>
                                <h1>Thành viên</h1>
                            </div>
                            <button className={cx('tippy-info-nav')} onClick={handleOpenModalAddUser}>
                                <FontAwesomeIcon icon={faUsers} />
                                <h1>Thêm thành viên</h1>
                            </button>
                            <div className={cx('tippy-infobottom')}>
                                <h1>Danh sách thành viên ({chatItem.members.length})</h1>
                                <FontAwesomeIcon icon={faEllipsis} size="2x" />
                            </div>

                            <div style={{ overflowY: 'auto', height: '555px' }}>
                                {[
                                    chatItem?.leader,
                                    ...(chatItem?.deputy.length > 0 ? chatItem?.deputy : []),
                                    ...(chatItem.members
                                        ? chatItem.members.filter(
                                              (member) =>
                                                  !chatItem?.deputy.some(
                                                      (deputy) => deputy?.userId?._id === member.userId?._id,
                                                  ) && member.userId?._id !== chatItem?.leader?.userId?._id,
                                          )
                                        : []),
                                ].map((member) => (
                                    <div key={member?.userId?._id} className={cx('tippy-info-member')}>
                                        <img
                                            src={member?.userId?.avatar}
                                            alt="Avatar"
                                            className={cx('tippy-member-img')}
                                        />
                                        <div className={cx('tippy-info-member-name')}>
                                            <h1>{member?.userId?.name}</h1>
                                            <p>
                                                {member?.userId?._id === chatItem?.leader?.userId?._id && 'Trưởng nhóm'}
                                                {chatItem?.deputy.map(
                                                    (deputy) =>
                                                        deputy?.userId?._id === member?.userId?._id && 'Phó nhóm',
                                                )}
                                            </p>
                                        </div>
                                        <div onClick={() => handleClickInfo(member?.userId?._id)}>
                                            <FontAwesomeIcon
                                                icon={faEllipsis}
                                                size="2x"
                                                className={cx('tippy-info-member-icon')}
                                            />
                                        </div>

                                        {/* Xử lý khi người dùng là trưởng nhóm */}
                                        {selectedMember === member?.userId?._id &&
                                            getUser?._id === selectedMember &&
                                            isInfoVisible && (
                                                <div className={cx('info-group-leave')}>
                                                    <p
                                                        onClick={() =>
                                                            leaveConversationHandler(chatItem?._id, member?.userId?._id)
                                                        }
                                                    >
                                                        Rời khỏi nhóm
                                                    </p>
                                                </div>
                                            )}

                                        {/* Xử lý khi người dùng là trưởng nhóm */}
                                        {selectedMember === member?.userId?._id &&
                                            getUser?._id === chatItem?.leader?.userId?._id &&
                                            isDeputy &&
                                            isInfoVisible &&
                                            !isLeader && (
                                                <div className={cx('info-group-role')}>
                                                    <p
                                                        onClick={() =>
                                                            deleteDeputyToConversationHandler(
                                                                chatItem?._id,
                                                                member?.userId?._id,
                                                            )
                                                        }
                                                    >
                                                        Xóa phó nhóm
                                                    </p>
                                                    <p
                                                        onClick={() =>
                                                            removedUserToConversationHandler(
                                                                chatItem?._id,
                                                                member?.userId?._id,
                                                            )
                                                        }
                                                    >
                                                        Xóa khỏi nhóm
                                                    </p>
                                                </div>
                                            )}

                                        {/* Xử lý khi người dùng là thành viên */}
                                        {selectedMember === member?.userId?._id &&
                                            getUser?._id === chatItem?.leader?.userId?._id &&
                                            !isDeputy &&
                                            !isLeader &&
                                            isMember &&
                                            isInfoVisible && (
                                                <div className={cx('info-group-role-leader')}>
                                                    <p
                                                        onClick={() =>
                                                            selectNewLeaderHandler(chatItem?._id, member?.userId?._id)
                                                        }
                                                    >
                                                        Nhường nhóm trưởng
                                                    </p>
                                                    <p
                                                        onClick={() =>
                                                            addDeputyToConversationHandler(
                                                                chatItem?._id,
                                                                member?.userId?._id,
                                                            )
                                                        }
                                                    >
                                                        Thêm phó nhóm
                                                    </p>
                                                    <p
                                                        onClick={() =>
                                                            removedUserToConversationHandler(
                                                                chatItem?._id,
                                                                member?.userId?._id,
                                                            )
                                                        }
                                                    >
                                                        Xóa khỏi nhóm
                                                    </p>
                                                </div>
                                            )}

                                        {/* Xử lý khi người dùng là phó nhóm */}
                                        {isDeputyLogin &&
                                            chatItem?.deputy.find((deputy) => deputy?.userId?._id === getUser?._id) &&
                                            selectedMember === member?.userId?._id &&
                                            selectedMember !== getUser?._id &&
                                            isInfoVisible && (
                                                <div className={cx('info-group-remote')}>
                                                    <p
                                                        onClick={() =>
                                                            removedUserToConversationHandler(
                                                                chatItem?._id,
                                                                member?.userId?._id,
                                                            )
                                                        }
                                                    >
                                                        Xóa khỏi nhóm
                                                    </p>
                                                </div>
                                            )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    }
                    visible={showTippy}
                    onClickOutside={(e) => {
                        setShowTippy(true);
                    }}
                    placement="top-start"
                    offset={[1, 5]}
                    interactive={true}
                    interactiveBorder={10}
                    theme="light-border"
                    className={cx('tippy1')}
                    style={{ position: 'absolute', top: '100px', left: '100px' }}
                >
                    <h1> </h1>
                </Tippy>
            )}

            <Modal
                open={openGroup}
                onClose={() => {
                    // Đặt lại các giá trị khi đóng modal

                    handleCloseGroup();
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className={cx('model-container-role')}>
                    <h1 className={cx('role-h1')}>Chọn trưởng nhóm trước khi rời</h1>
                    <div id="modal-modal-title" className={cx('role-content')}>
                        <div className={cx('role-modal-content')}>
                            <input
                                className={cx('role-input-sdt')}
                                placeholder="Nhập số điện thoại"
                                value={searchValueUsername}
                                onChange={handleChangeUser}
                                onKeyPress={handleKeyPress}
                            />
                        </div>

                        <div className={cx('aaaaa')}>
                            {chatItem.members.map((member) => {
                                if (member && member.userId && member.userId?._id !== getUser?._id) {
                                    return (
                                        <div className={cx('modal-role-member')} key={member.userId?._id}>
                                            <div
                                                className={cx('modal-role-member-id')}
                                                onClick={() => handleDivClick(member.userId?._id)}
                                            >
                                                <input
                                                    className="modal-role-radio"
                                                    type="radio"
                                                    name="userId"
                                                    checked={member.userId._id === isChecked}
                                                    onChange={() => {}}
                                                />
                                                <img
                                                    src={member.userId.avatar}
                                                    alt="Avatar"
                                                    className={cx('modal-role-img')}
                                                />
                                                <div className={cx('modal-role-info')}>
                                                    <h1>{member.userId.name}</h1>
                                                    {member.userId &&
                                                        member.userId?._id === chatItem.leader.userId?._id && (
                                                            <span>Trưởng nhóm</span>
                                                        )}
                                                    {chatItem.deputy?.map(
                                                        (deputy) =>
                                                            deputy &&
                                                            deputy.userId &&
                                                            member.userId._id === deputy.userId?._id && (
                                                                <span key={deputy.userId._id}>Phó nhóm</span>
                                                            ),
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    </div>
                    <div className={cx('modal-role-btn')}>
                        <div className={cx('modal-role-btn1')}>
                            <input
                                type="button"
                                className={cx('bnt-exit-role')}
                                value={'Hủy'}
                                onClick={handleCloseGroup}
                            />
                            <input
                                type="button"
                                className={cx('bnt-role')}
                                value={'Chọn và tiếp tục'}
                                onClick={() => {
                                    leaveConversationInLeaderHandler(chatItem?._id, getUser?._id);
                                    selectNewLeaderHandler(chatItem?._id, isChecked);
                                }}
                            />
                        </div>
                    </div>
                </Box>
            </Modal>

            <Modal
                open={openUpdateName}
                onClose={handleCloseUpdateNameConversation}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className={cx('modal-updateName')}>
                    <div className={cx('modal-updateName-title')}>
                        <h1>Đổi tên nhóm</h1>
                    </div>

                    <div className={cx('contend-updateName')}>
                        {chatItem.type === 'Group' ? (
                            // Hiển thị avatar mặc định
                            <img src={chatItem.groupImage} alt="Default Avatar" className={cx('img-nav')} />
                        ) : (
                            // Hiển thị các avatar của thành viên (nếu có)
                            chatItem.members.map((member) => {
                                if (member.userId?._id !== getUser?._id) {
                                    return (
                                        <img
                                            key={member._id}
                                            src={member.userId.avatar}
                                            alt={member.userId.name}
                                            className={cx('img-nav')}
                                        />
                                    );
                                }
                                return null;
                            })
                        )}

                        <p>
                            Bạn có chắc chắn muốn đổi tên nhóm, khi xác nhận tên nhóm mới sẽ hiển thị với tất cả thành
                            viên.
                        </p>
                        <input
                            className={cx('input-UpdateName')}
                            type="text"
                            value={nameConversation}
                            onChange={handleInputUpdateName}
                        />
                    </div>
                    <div className={cx('.modal-xacnhan-btn')}>
                        <div className={cx('modal-role-btn1')}>
                            <input
                                type="button"
                                className={cx('bnt-exit-role')}
                                value={'Hủy'}
                                onClick={handleCloseUpdateNameConversation}
                            />
                            <input
                                type="button"
                                className={cx('bnt-role')}
                                value={'Xác nhận'}
                                onClick={() => {
                                    updateNameConversation(chatItem?._id);
                                }}
                            />
                        </div>
                    </div>
                </Box>
            </Modal>

            <Modal
                open={openXacNhan}
                onClose={handleCloseXacNhan}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className={cx('modal-xacnhan')}>
                    <div className={cx('modal-xacnhan-title')}>
                        <h1>Giải tán nhóm</h1>
                    </div>
                    <p>Mời tất cả mọi người rời nhóm và xóa tin nhắn? Nhóm đã giải tán sẽ KHÔNG THỂ khôi phục.</p>
                    <div className={cx('.modal-xacnhan-btn')}>
                        <div className={cx('modal-role-btn1')}>
                            <input
                                type="button"
                                className={cx('bnt-exit-role')}
                                value={'Không'}
                                onClick={handleCloseXacNhan}
                            />
                            <input
                                type="button"
                                className={cx('bnt-role')}
                                value={'Giải tán nhóm'}
                                onClick={() => {
                                    deleteConversationHandler(chatItem?._id);
                                }}
                            />
                        </div>
                    </div>
                </Box>
            </Modal>

            <Modal
                open={openReaction}
                onClose={handleCloseReaction}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className={cx('modal-reaction')}>
                    <div className={cx('modal-reaction-title')}>
                        <h1>Biểu cảm</h1>
                        <button onClick={handleCloseReaction}>
                            <FontAwesomeIcon icon={faClose} />
                        </button>
                    </div>
                    <div className={cx('modal-reaction-container')}>
                        <div className={cx('modal-reaction-left')}>
                            <div
                                className={cx('modal-reaction-left-content')}
                                onClick={() => {
                                    setClickIconAll(true);
                                    setClickIcon(false);
                                }}
                            >
                                <span>Tất cả</span>
                                <p>{calculateTotalReactions(messageReaction)}</p>
                            </div>

                            {Object.keys(calculateReactionTotalsType(messageReaction.reaction))
                                .sort((a, b) => {
                                    const countA = calculateReactionTotalsType(messageReaction.reaction)[a];
                                    const countB = calculateReactionTotalsType(messageReaction.reaction)[b];
                                    if (countA !== countB) {
                                        return countB - countA;
                                    } else {
                                        // Nếu số lượng bằng nhau, sử dụng chỉ số của loại phản ứng
                                        return a.localeCompare(b);
                                    }
                                })
                                .map((typeReaction, index) => {
                                    return (
                                        <div
                                            className={cx('modal-reaction-left-content')}
                                            key={index}
                                            onClick={() => handleIconClick(typeReaction, index)}
                                        >
                                            <img
                                                src={reactionIconMapping[typeReaction].icon}
                                                className={cx('reaction-left-content-icon')}
                                                alt="icon-reactions"
                                            />
                                            <p style={{ marginTop: '5px' }}>
                                                {calculateReactionTotalsType(messageReaction.reaction)[typeReaction]}
                                            </p>
                                        </div>
                                    );
                                })}
                        </div>

                        {selectIcon !== null && clickIcon && (
                            <div className={cx('modal-reaction-right')}>
                                {messageReaction.reaction
                                    ?.sort(
                                        (a, b) =>
                                            b.reactions.find((reaction) => reaction.typeReaction === selectIcon)
                                                ?.quantity -
                                            a.reactions.find((reaction) => reaction.typeReaction === selectIcon)
                                                ?.quantity,
                                    )
                                    .map((reaction, index) => {
                                        const likeReaction = reaction.reactions.find(
                                            (reaction) => reaction.typeReaction === selectIcon,
                                        );
                                        return (
                                            likeReaction &&
                                            likeReaction?.quantity && (
                                                <div className={cx('modal-reaction-right-content')} key={index}>
                                                    <div className={cx('reaction-right-content-user')}>
                                                        <img
                                                            src={reaction.memberId.userId.avatar}
                                                            alt={reaction.memberId.userId.name}
                                                        />
                                                        <span>{reaction.memberId.userId.name}</span>
                                                    </div>
                                                    <div className={cx('modal-reaction-icon')}>
                                                        <div>
                                                            <img
                                                                src={reactionIconMapping[selectIcon].icon}
                                                                className={cx('reaction-right-content-icon1')}
                                                                alt="icon-reactions"
                                                            />
                                                            <span>{likeReaction?.quantity}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        );
                                    })}
                            </div>
                        )}

                        {clickIconAll && (
                            <div className={cx('modal-reaction-right')}>
                                {messageReaction.reaction
                                    ?.sort(
                                        (a, b) =>
                                            b.reactions.reduce(
                                                (totalA, typeReactionA) => totalA + typeReactionA?.quantity,
                                                0,
                                            ) -
                                            a.reactions.reduce(
                                                (totalB, typeReactionB) => totalB + typeReactionB?.quantity,
                                                0,
                                            ),
                                    )
                                    .map((reaction, index) => {
                                        return (
                                            <div className={cx('modal-reaction-right-content')} key={index}>
                                                <div className={cx('reaction-right-content-user')}>
                                                    <img
                                                        src={reaction.memberId.userId.avatar}
                                                        alt={reaction.memberId.userId.name}
                                                    />

                                                    <span>{reaction.memberId.userId.name}</span>
                                                </div>
                                                <div className={cx('modal-reaction-icon')}>
                                                    {reaction?.reactions?.map((typeReaction, index) => {
                                                        return (
                                                            <div key={index}>
                                                                <img
                                                                    src={
                                                                        reactionIconMapping[typeReaction.typeReaction]
                                                                            .icon
                                                                    }
                                                                    className={cx('reaction-right-content-icon1')}
                                                                    alt="icon-reactions"
                                                                />
                                                            </div>
                                                        );
                                                    })}
                                                    <span>
                                                        {reaction?.reactions?.reduce(
                                                            (total, typeReaction) => total + typeReaction?.quantity,
                                                            0,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        )}
                    </div>
                </Box>
            </Modal>

            <Modal
                open={openChiaSe}
                onClose={() => {
                    handleCloseChiaSe();
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className={cx('model-container-share')}>
                    <h1 className={cx('role-h1')}>Chia sẻ</h1>
                    <div id="modal-modal-title" className={cx('role-content')}>
                        <div className={cx('role-modal-content')}>
                            <input
                                className={cx('role-input-sdt')}
                                placeholder="Nhập số điện thoại"
                                value={searchValueUsername}
                                onChange={handleChangeUser}
                                onKeyPress={handleKeyPress}
                            />
                        </div>

                        <div className={cx('bbbb')}>
                            <h1 className={cx('bbbb-title')}>Trò chuyện gần đây</h1>
                            {conversationAll &&
                                conversationAll.map((conversation) => {
                                    const avatar =
                                        conversation.type === 'Group'
                                            ? conversation?.groupImage
                                            : (
                                                  conversation.members.find(
                                                      (member) => member.userId?._id !== getUser?._id,
                                                  ) || {}
                                              ).userId?.avatar;
                                    return (
                                        <div className={cx('modal-role-member')} key={conversation?._id}>
                                            <div
                                                className={cx('modal-role-member-id')}
                                                onClick={() => handleDivClickShare(conversation?._id)}
                                            >
                                                <input
                                                    className={cx('modal-share-checkbox')}
                                                    type="checkbox"
                                                    name="conversationId"
                                                    checked={checkedConversations.includes(conversation?._id)}
                                                    onChange={() => handleCheckboxShareChange(conversation?._id)}
                                                />
                                                <img src={avatar} alt="Avatar" className={cx('modal-role-img')} />
                                                <div className={cx('modal-share-info')}>
                                                    <h1>
                                                        {conversation?.type === 'Group'
                                                            ? conversation?.name
                                                            : conversation.members.find(
                                                                  (member) => member.userId?._id !== getUser?._id,
                                                              )?.userId?.name}
                                                    </h1>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                    <div className={cx('modal-share-content')}>
                        <h1>Nội dung chia sẻ</h1>
                        <div className={cx('modal-share-content-title')}>
                            <span>{contentChiaSe}</span>
                        </div>
                    </div>
                    <div className={cx('modal-role-btn2')}>
                        <div className={cx('modal-role-btn3')}>
                            <input
                                type="button"
                                className={cx('bnt-exit-role')}
                                value={'Hủy'}
                                onClick={handleCloseChiaSe}
                            />
                            <input
                                type="button"
                                className={cx('bnt-role')}
                                value={'Chia sẻ'}
                                onClick={() => {
                                    shareNewMessage(checkedConversations, contentChiaSe, messageType);
                                }}
                            />
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}

export default Home;
