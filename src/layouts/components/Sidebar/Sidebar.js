import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';
import { Avatar, Box, Stack, Tab } from '@mui/material';
import { useEffect, useState } from 'react';
import { getConversationsByUserId } from '~/redux/apiRequest';
import { useDispatch, useSelector } from 'react-redux';
import { createAxios } from '~/createInstance';
import { loginSuccess } from '~/redux/authSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import config from '~/config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faPaperclip } from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
const cx = classNames.bind(styles);

function Sidebar({ onChatItemClick }) {
    const socketRef = useSelector((state) => state.socket?.currentSocket);

    const getUser = useSelector((state) => state.users.users?.currentUser);
    const user = useSelector((state) => state.auth.login?.currentUser);

    const selectConversations = useSelector((state) => state.conversations?.currentConversation);

    const selectConversationsByID = useSelector((state) => state.conversations?.currentConversationById);

    const [conversations, setConversations] = useState([]);
    const [conversationsCurrentUser, setConversationsCurrentUser] = useState([]);
    const [conversationsID, setConversationsID] = useState(null);
    const [value, setValue] = useState('1');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    let axiosJWT = createAxios(user, dispatch, loginSuccess);

    const [clickedItem, setClickedItem] = useState(null);
    const [messageLengthEnd, setMessageLengthEnd] = useState([]);
    const [messageLengthUser, setMessageLengthUser] = useState([]);
    const [conversationsWithNewMessagesInfo, setConversationsWithNewMessagesInfo] = useState([]);
    const [messageRender, setmessageRender] = useState(null);

    useEffect(() => {
        if (selectConversationsByID) {
            setClickedItem(selectConversationsByID?._id);
        } else return;
    }, [selectConversationsByID]);
    const fetchConversations = async () => {
        try {
            if (getUser?._id) {
                const response = await axios.get(
                    `https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/conversation/getConversationByUserId/${getUser?._id}`,
                    {
                        headers: {
                            token: `Bearer ${getUser?.token}`,
                        },
                    },
                );
                const data = response.data;
                const newMessageLengthEnd = data.map((conversation) => ({
                    id: conversation._id,
                    length: conversation.messages.length,
                }));

                // Cập nhật state messageLengthEnd với mảng mới này
                setMessageLengthEnd(newMessageLengthEnd);

                setConversations(data);
            }
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    };

    useEffect(() => {
        if (!user || !user.accessToken) {
            navigate(config.routes.login);
        } else {
            const userId = user.user?._id;
            if (userId) {
                setConversationsCurrentUser(selectConversations);
                // getSocketConnection(dispatch, socket.id);

                const newMessageLengthEnd = selectConversations?.map((conversation) => ({
                    id: conversation?._id,
                    length: conversation.messages.length,
                }));

                // Cập nhật state messageLengthEnd với mảng mới này
                setMessageLengthUser(newMessageLengthEnd);
            }
        }
    }, [user, conversations, navigate]);

    useEffect(() => {
        if (socketRef) {
            socketRef.on('sendMessage', (message) => {
                setmessageRender(message);
                return () => {
                    if (socketRef) {
                        socketRef.disconnect();
                    }
                };
            });
        }
    }, [conversations, socketRef]);
    useEffect(() => {
        if (messageRender) fetchConversations();
    }, [messageRender]);

    useEffect(() => {
        fetchConversations();
    }, [getUser?._id]);

    useEffect(() => {
        if (conversationsID !== null) {
            getConversationsByUserId(user?.accessToken, dispatch, getUser?._id, axiosJWT);
        }
    }, [conversationsID]);

    useEffect(() => {
        if (selectConversations?.length > 0 && messageLengthEnd?.length > 0) {
            const newMessagesInfo = [];

            selectConversations.forEach((conversation) => {
                const previousMessageLength = messageLengthUser?.find((item) => item.id === conversation._id)?.length;
                const currentMessageLength = messageLengthEnd?.find((item) => item.id === conversation._id)?.length;

                if (currentMessageLength !== previousMessageLength) {
                    const lengthChange = currentMessageLength - (previousMessageLength || 0);
                    const lastMessage = conversation.messages[conversation.messages.length - 1];
                    const isCurrentUser = lastMessage?.memberId?.userId?._id === getUser?._id;

                    if (!isCurrentUser && conversation._id !== conversationsID) {
                        // Kiểm tra xem conversation hiện tại có phải là conversation đang được chọn không
                        if (conversation._id !== conversationsID) {
                            newMessagesInfo.push({ conversationId: conversation._id, newMessageCount: lengthChange });
                        }
                    }
                }
            });

            // Cập nhật state với thông tin tin nhắn mới
            setConversationsWithNewMessagesInfo(newMessagesInfo);
        }
    }, [messageLengthEnd, conversationsID, selectConversations, messageLengthUser]);

    const handleChatItemClick = (conversation) => {
        // Kiểm tra nếu người dùng đang ở trong cuộc trò chuyện và gửi tin nhắn
        if (conversationsID !== conversation._id) {
            setConversationsID(conversation._id);

            onChatItemClick(conversation);

            // Cập nhật conversationsWithNewMessagesInfo cho cuộc trò chuyện được click
            setConversationsWithNewMessagesInfo((prevInfo) => {
                return prevInfo.map((info) => {
                    if (info.conversationId === conversation._id) {
                        return { ...info, newMessageCount: 0 };
                    }
                    return info;
                });
            });

            // Đánh dấu tin nhắn là đã đọc cho cuộc trò chuyện được click
            markMessagesAsRead(conversation._id);

            // Cập nhật lại messageLengthEnd cho cuộc trò chuyện được click
            if (setMessageLengthUser && Array.isArray(messageLengthUser)) {
                setMessageLengthUser((prevLengths) =>
                    prevLengths.map((lengthObj) =>
                        lengthObj.id === conversation._id
                            ? { ...lengthObj, length: conversation.messages.length }
                            : lengthObj,
                    ),
                );
            }
        }
    };

    const markMessagesAsRead = (conversationId) => {
        // Tìm và cập nhật tin nhắn mới trong state
        setConversationsWithNewMessagesInfo((prevInfo) => {
            return prevInfo.map((info) => {
                if (info.conversationId === conversationId) {
                    return { ...info, newMessageCount: 0 };
                }
                return info;
            });
        });
    };

    function extractFileNameAndType(url, maxLength) {
        const parts = url.split('/');
        const fileNameWithExtension = parts[parts.length - 1];

        const dotIndex = fileNameWithExtension.lastIndexOf('.');
        const fileName = fileNameWithExtension.substring(0, dotIndex); // Tên file
        const fileType = fileNameWithExtension.substring(dotIndex + 1); // Loại file

        // Kiểm tra độ dài của tên file và cắt nếu quá dài
        const truncatedFileName = fileName.length > maxLength ? fileName.substring(0, maxLength) + '...' : fileName;

        return { fileName: truncatedFileName, fileType };
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const sortedConversations = conversations.slice().sort((a, b) => {
        const lastMessageA = a.messages.length > 0 ? a.messages[a.messages.length - 1] : null;
        const lastMessageB = b.messages.length > 0 ? b.messages[b.messages.length - 1] : null;
        // Sắp xếp các cuộc trò chuyện dựa trên thời gian của tin nhắn cuối cùng
        if (lastMessageA && lastMessageB) {
            return new Date(lastMessageB.createAt) - new Date(lastMessageA.createAt);
        } else if (lastMessageA) {
            return -1;
        } else if (lastMessageB) {
            return 1;
        } else {
            return 0;
        }
    });

    const conversationTimeDifferences = sortedConversations
        ? sortedConversations.map((conversation) => {
              // Lấy thời gian hiện tại
              const currentTime = new Date();

              // Kiểm tra xem có tin nhắn nào trong cuộc trò chuyện không
              if (conversation.messages.length === 0) {
                  return 'Không có tin nhắn';
              }

              // Lấy thời gian của tin nhắn cuối cùng trong cuộc trò chuyện
              const lastMessage = conversation.messages[conversation.messages.length - 1];
              const lastMessageCreatedAtString = lastMessage.createAt;

              // Chuyển đổi thời gian tạo của tin nhắn cuối cùng thành đối tượng Date
              const lastMessageCreatedAt = new Date(lastMessageCreatedAtString);
              // Kiểm tra tính hợp lệ của thời gian tạo tin nhắn cuối cùng
              if (isNaN(lastMessageCreatedAt.getTime())) {
                  console.error('Thời gian tin nhắn không hợp lệ:', lastMessageCreatedAtString);
                  return 'Thời gian tin nhắn không hợp lệ';
              }

              // Tính toán sự chênh lệ thời gian và chuyển đổi kết quả thành phút
              const timeDifferenceMilliseconds = Math.abs(currentTime - lastMessageCreatedAt);
              const timeDifferenceSeconds = Math.floor(timeDifferenceMilliseconds / 1000);

              // Kiểm tra nếu thời gian chênh lệch nhỏ hơn 1 phút
              if (timeDifferenceSeconds < 60) {
                  return 'Vài giây';
              }

              // Kiểm tra nếu thời gian chênh lệch lớn hơn hoặc bằng 60 phút
              if (timeDifferenceSeconds >= 60) {
                  // Chia thời gian chênh lệch cho 60 để tính số phút
                  const timeDifferenceMinutes = Math.floor(timeDifferenceSeconds / 60);

                  // Kiểm tra nếu thời gian chênh lệch lớn hơn hoặc bằng 60 phút
                  if (timeDifferenceMinutes >= 60) {
                      // Chia thời gian chênh lệch cho 60 để tính số giờ
                      const timeDifferenceHours = Math.floor(timeDifferenceMinutes / 60);

                      // Kiểm tra nếu thời gian chênh lệch lớn hơn hoặc bằng 24 giờ
                      if (timeDifferenceHours >= 24) {
                          // Chia thời gian chênh lệch cho 24 để tính số ngày

                          if (timeDifferenceHours >= 48) {
                              // Chia thời gian chênh lệch cho 24 để tính số ngày
                              const timeDifferenceDays = Math.floor(timeDifferenceHours / 24);

                              return timeDifferenceDays + ' ngày';
                          }

                          return 'Hôm qua';
                      }

                      return timeDifferenceHours + ' giờ';
                  }

                  return timeDifferenceMinutes + ' phút';
              }
              // Đảm bảo một giá trị được trả về trong mọi trường hợp
              return 'giây trước';
          })
        : [];

    return (
        <div className={cx('wrapper')} style={{ height: '688px' }}>
            <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', marginTop: -2 }}>
                        <TabList onChange={handleChange} aria-label="Message">
                            <Tab
                                label="Tất cả"
                                value="1"
                                sx={{ fontSize: 15, fontWeight: '600', textTransform: 'none' }}
                            />
                            <Tab
                                label="Chưa đọc"
                                value="2"
                                sx={{ fontSize: 15, fontWeight: '600', textTransform: 'none' }}
                            />
                        </TabList>
                    </Box>

                    <TabPanel
                        value="1"
                        sx={{
                            width: 345,
                            height: '639px',
                            padding: 0,
                            overflowY: 'auto',
                            zIndex: 1,
                            overflowX: 'hidden',
                            border: '1px solid #e0e0e0',
                        }}
                    >
                        {conversations &&
                            Array.isArray(conversations) &&
                            sortedConversations.map((conversation, index) => {
                                return (
                                    <div
                                        key={conversation._id}
                                        className={cx('container', {
                                            selected: conversation._id === clickedItem,
                                        })}
                                        onClick={() => {
                                            handleChatItemClick(conversation);
                                            setClickedItem(conversation._id);
                                        }}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                        }}
                                    >
                                        {conversation.type === 'Group' ? (
                                            <div className={cx('group-img-header')}>
                                                <img
                                                    src={conversation.groupImage}
                                                    alt="Default Avatar"
                                                    className={cx('img-header')}
                                                />
                                            </div>
                                        ) : (
                                            // Hiển thị các avatar của thành viên (nếu có)
                                            conversation.members &&
                                            conversation.members.map((member, index) => {
                                                if (member.userId?._id !== getUser?._id) {
                                                    return (
                                                        <div className={cx('group-img-header')} key={index}>
                                                            <img
                                                                key={member?._id}
                                                                src={member.userId?.avatar}
                                                                alt={member.userId?.name}
                                                                className={cx('img-header')}
                                                            />
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })
                                        )}
                                        <div className={cx('title')}>
                                            <div className={cx('top')}>
                                                {conversation.members && conversation.type === 'Group' ? (
                                                    // Hiển thị avatar mặc định
                                                    <p
                                                        className={cx({
                                                            'new-message': conversationsWithNewMessagesInfo.some(
                                                                (info) =>
                                                                    info.conversationId === conversation._id &&
                                                                    info.newMessageCount > 0,
                                                            ),
                                                        })}
                                                    >
                                                        {conversation.name}
                                                    </p>
                                                ) : (
                                                    // Hiển thị các avatar của thành viên (nếu có)
                                                    conversation.members &&
                                                    conversation.members.map((member, index) => {
                                                        if (member.userId?._id !== getUser?._id) {
                                                            return (
                                                                <p
                                                                    key={index}
                                                                    className={cx({
                                                                        'new-message':
                                                                            conversationsWithNewMessagesInfo.some(
                                                                                (info) =>
                                                                                    info.conversationId ===
                                                                                        conversation._id &&
                                                                                    info.newMessageCount > 0,
                                                                            ),
                                                                    })}
                                                                >
                                                                    {member.userId?.name}
                                                                </p>
                                                            );
                                                        }
                                                        return null;
                                                    })
                                                )}

                                                {conversation.createAt && (
                                                    <span style={{ marginLeft: '-30px', marginRight: '15px' }}>
                                                        {conversationTimeDifferences[index] !== 'Không có tin nhắn' && (
                                                            <span>{conversationTimeDifferences[index]}</span>
                                                        )}
                                                    </span>
                                                )}
                                            </div>

                                            <div className={cx('bottom')}>
                                                {conversation.messages.length > 0 && (
                                                    <div>
                                                        {conversation.messages
                                                            .filter(
                                                                (message) =>
                                                                    [
                                                                        'file',
                                                                        'video',
                                                                        'image',
                                                                        'text',
                                                                        'notify',
                                                                    ].includes(message.type) &&
                                                                    message.deleteMember
                                                                        .map((member) => member.userId)
                                                                        .indexOf(getUser?._id) === -1,
                                                            )
                                                            .slice(-1)
                                                            .map((message, index) => {
                                                                if (message.recallMessage) {
                                                                    return (
                                                                        <div
                                                                            key={index}
                                                                            style={{
                                                                                width: '235px',
                                                                            }}
                                                                            className={cx('bottom')}
                                                                        >
                                                                            {message.memberId?.userId._id ===
                                                                            getUser?._id ? (
                                                                                <p style={{ width: '30px' }}>Bạn:</p>
                                                                            ) : (
                                                                                <p>{message.memberId?.userId.name}:</p>
                                                                            )}
                                                                            <span
                                                                                className={cx({
                                                                                    'your1-message':
                                                                                        message.memberId?.userId._id ===
                                                                                        getUser?._id,
                                                                                })}
                                                                            >
                                                                                Tin nhắn đã được thu hồi
                                                                            </span>
                                                                        </div>
                                                                    );
                                                                } else {
                                                                    if (
                                                                        conversation.notifications.length > 0 &&
                                                                        conversation.messages.length === 1 &&
                                                                        conversation.members.length === 2
                                                                    ) {
                                                                        return (
                                                                            <div
                                                                                key={index}
                                                                                style={{
                                                                                    width: '235px',
                                                                                }}
                                                                                className={cx('bottom')}
                                                                            >
                                                                                {conversation.notifications.map(
                                                                                    (
                                                                                        notification,
                                                                                        notificationIndex,
                                                                                    ) => (
                                                                                        <span
                                                                                            key={notificationIndex}
                                                                                            className={cx(
                                                                                                'your2-message',
                                                                                            )}
                                                                                        >
                                                                                            Các bạn đã là bạn bè. Hãy
                                                                                            trò chuyện với nhau nhé!
                                                                                        </span>
                                                                                    ),
                                                                                )}
                                                                            </div>
                                                                        );
                                                                    } else {
                                                                        return (
                                                                            <div key={index} className={cx('bottom')}>
                                                                                <div
                                                                                    className={cx('bottom')}
                                                                                    style={{
                                                                                        width: '235px',
                                                                                        marginRight: '10px',
                                                                                    }}
                                                                                >
                                                                                    {message.memberId.userId?._id ===
                                                                                    getUser?._id ? (
                                                                                        <p
                                                                                            className={cx({
                                                                                                'new-message-content':
                                                                                                    conversationsWithNewMessagesInfo.some(
                                                                                                        (info) =>
                                                                                                            info.conversationId ===
                                                                                                                conversation._id &&
                                                                                                            info.newMessageCount >
                                                                                                                0,
                                                                                                    ),
                                                                                            })}
                                                                                        >
                                                                                            Bạn:
                                                                                        </p>
                                                                                    ) : (
                                                                                        <p
                                                                                            className={cx({
                                                                                                'new-message-content':
                                                                                                    conversationsWithNewMessagesInfo.some(
                                                                                                        (info) =>
                                                                                                            info.conversationId ===
                                                                                                                conversation._id &&
                                                                                                            info.newMessageCount >
                                                                                                                0,
                                                                                                    ),
                                                                                            })}
                                                                                        >
                                                                                            {
                                                                                                message.memberId.userId
                                                                                                    ?.name
                                                                                            }
                                                                                            :
                                                                                        </p>
                                                                                    )}

                                                                                    {(message.type === 'text') |
                                                                                    (message.type === 'notify') ? (
                                                                                        <span
                                                                                            dangerouslySetInnerHTML={{
                                                                                                __html: message.content,
                                                                                            }}
                                                                                            className={cx({
                                                                                                'new-message-content':
                                                                                                    conversationsWithNewMessagesInfo.some(
                                                                                                        (info) =>
                                                                                                            info.conversationId ===
                                                                                                                conversation._id &&
                                                                                                            info.newMessageCount >
                                                                                                                0,
                                                                                                    ),
                                                                                            })}
                                                                                        ></span>
                                                                                    ) : message.type === 'image' ? (
                                                                                        <span
                                                                                            style={{
                                                                                                width: '100px',
                                                                                            }}
                                                                                            className={cx({
                                                                                                'new-message-content':
                                                                                                    conversationsWithNewMessagesInfo.some(
                                                                                                        (info) =>
                                                                                                            info.conversationId ===
                                                                                                                conversation._id &&
                                                                                                            info.newMessageCount >
                                                                                                                0,
                                                                                                    ),
                                                                                            })}
                                                                                        >
                                                                                            <FontAwesomeIcon
                                                                                                icon={faImage}
                                                                                            />{' '}
                                                                                            Hình ảnh
                                                                                        </span>
                                                                                    ) : message.type === 'file' ? (
                                                                                        <div
                                                                                            className={cx(
                                                                                                'footer-chat-input-top-file11',
                                                                                                {
                                                                                                    'new-message-content':
                                                                                                        conversationsWithNewMessagesInfo.some(
                                                                                                            (info) =>
                                                                                                                info.conversationId ===
                                                                                                                    conversation._id &&
                                                                                                                info.newMessageCount >
                                                                                                                    0,
                                                                                                        ),
                                                                                                },
                                                                                            )}
                                                                                        >
                                                                                            {(() => {
                                                                                                let fileDetails = {};
                                                                                                if (
                                                                                                    message.memberId
                                                                                                        ?.userId._id ===
                                                                                                    getUser?._id
                                                                                                ) {
                                                                                                    fileDetails =
                                                                                                        extractFileNameAndType(
                                                                                                            message.content,
                                                                                                            22,
                                                                                                        );
                                                                                                } else {
                                                                                                    fileDetails =
                                                                                                        extractFileNameAndType(
                                                                                                            message.content,
                                                                                                            15,
                                                                                                        );
                                                                                                }

                                                                                                let fileName =
                                                                                                    fileDetails?.fileName;

                                                                                                return (
                                                                                                    <div
                                                                                                        className={cx(
                                                                                                            'footer-chat-file1',
                                                                                                        )}
                                                                                                    >
                                                                                                        <FontAwesomeIcon
                                                                                                            icon={
                                                                                                                faPaperclip
                                                                                                            }
                                                                                                        />
                                                                                                        <span>
                                                                                                            {fileName}
                                                                                                        </span>
                                                                                                    </div>
                                                                                                );
                                                                                            })()}
                                                                                        </div>
                                                                                    ) : (
                                                                                        <span
                                                                                            className={cx({
                                                                                                'new-message':
                                                                                                    conversationsWithNewMessagesInfo.some(
                                                                                                        (info) =>
                                                                                                            info.conversationId ===
                                                                                                                conversation._id &&
                                                                                                            info.newMessageCount >
                                                                                                                0,
                                                                                                    ),
                                                                                            })}
                                                                                        >
                                                                                            <FontAwesomeIcon
                                                                                                icon={faYoutube}
                                                                                            />{' '}
                                                                                            Video
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                                {conversationsWithNewMessagesInfo.map(
                                                                                    (info) => {
                                                                                        if (
                                                                                            info.conversationId ===
                                                                                                conversation._id &&
                                                                                            info.newMessageCount > 0
                                                                                        ) {
                                                                                            return (
                                                                                                <strong
                                                                                                    key={`new-message-indicator-${conversation._id}`}
                                                                                                    className={cx(
                                                                                                        'under',
                                                                                                    )}
                                                                                                >
                                                                                                    {
                                                                                                        info.newMessageCount
                                                                                                    }
                                                                                                </strong>
                                                                                            );
                                                                                        }
                                                                                        return null;
                                                                                    },
                                                                                )}
                                                                            </div>
                                                                        );
                                                                    }
                                                                }
                                                            })}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                    </TabPanel>

                    <TabPanel
                        value="2"
                        sx={{ width: 345, height: 620, padding: 0, overflowY: 'auto', zIndex: 1, overflowX: 'hidden' }}
                    >
                        <div className={cx('container')}>
                            <Stack direction="row" spacing={1}>
                                <Avatar
                                    alt="Avt"
                                    src="https://image666666.s3.ap-southeast-1.amazonaws.com/imgae1.jpg"
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        objectFit: 'cover',
                                    }}
                                />
                            </Stack>

                            <div className={cx('title')}>
                                <div className={cx('top')}>
                                    <p>Cộng đồng Game Online</p>
                                    <span>16/22</span>
                                </div>
                                <div className={cx('bottom')}>
                                    <span>Nhập GITFCODE nhận quà thoải thích</span>
                                </div>
                            </div>
                        </div>
                    </TabPanel>
                </TabContext>
            </Box>
        </div>
    );
}

export default Sidebar;
