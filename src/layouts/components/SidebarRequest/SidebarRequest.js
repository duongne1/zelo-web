import Request from '~/layouts/components/SidebarRequest/Request';
import RequestSent from './RequestSent';
import classNames from 'classnames/bind';
import styles from './SidebarRequest.module.scss';
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import UserContext from '~/components/context/UserContext';

const cx = classNames.bind(styles);
function SidebarRequest() {
    const { user, setUser } = useContext(UserContext);
    const [friendRequests, setFriendRequests] = useState([]);
    const [friendRequestsSend, setFriendRequestsSend] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState('');
    const [messageRender, setmessageRender] = useState('');

    const getUser = useSelector((state) => state.users.users?.currentUser);
    const socketRef = useSelector((state) => state.socket?.currentSocket);

    const fetchFriendRequests = async () => {
        try {
            const response = await axios.get(
                'https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/users/getfriendRecivedWeb/' + getUser._id,
            );
            setFriendRequests(response.data);
        } catch (error) {
            console.error('Error fetching friend requests:', error);
        }
    };

    const fetchRequestSent = async () => {
        try {
            const response = await axios.get(
                'https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/users/getfriendRequestWeb/' + getUser._id,
            );
            setFriendRequestsSend(response.data);
        } catch (error) {
            console.error('Error fetching friend requests send:', error);
        }
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

    useEffect(() => {
        if (messageRender) {
            fetchRequestSent();
            fetchFriendRequests();
        }
    }, [messageRender]);
    useEffect(() => {
        fetchRequestSent();
        fetchFriendRequests();
    }, [selectedRequest]);

    const handleRequestClick = (requestId) => {
        const selected = friendRequests.find((request) => request._id === requestId);
        setSelectedRequest(selected);
    };
    const handleRequestSendClick = (requestId) => {
        const selected = friendRequestsSend.find((request) => request._id === requestId);
        setSelectedRequest(selected);
    };
    console.log('selectedRequest', selectedRequest);
    const renderFriendRequest = (requestId) => {
        // Thực hiện hành động chấp nhận lời mời kết bạn
        console.log('Đã chấp nhận', requestId);
        socketRef.emit('sendMessage', requestId + 'Đã chấp nhận yêu cầu kết bạn');
        fetchFriendRequests();
    };
    const renderFriendRequestSend = (requestId) => {
        // Thực hiện hành động từ chối lời mời kết bạn
        console.log('Đã từ chối', requestId);
        socketRef.emit('sendMessage', requestId + 'Đã từ chối yêu cầu kết bạn');

        fetchRequestSent();
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('request')}>
                    <h3 className={cx('heading')}>Lời mời kết bạn ({friendRequests.length})</h3>
                    <div className={cx('info')}>
                        {friendRequests.map((request) => (
                            <Request
                                key={request._id}
                                avatar={request.avatar}
                                name={request.name}
                                timeRequest={request.date}
                                content={request.content}
                                onClick={() => handleRequestClick(request._id)}
                                requestId={request._id}
                                onAccept={renderFriendRequest}
                                onRefuse={renderFriendRequest}
                            />
                        ))}
                    </div>
                </div>

                <div className={cx('sent')}>
                    <h3 className={cx('heading')}>Đã gửi yêu cầu kết bạn ({friendRequestsSend.length})</h3>
                    <div className={cx('info')}>
                        {friendRequestsSend.map((request) => (
                            <RequestSent
                                key={request._id}
                                avatar={request.avatar}
                                name={request.name}
                                timeRequest={request.date}
                                content={request.content}
                                requestId={request._id}
                                onClick={() => handleRequestSendClick(request._id)}
                                onRefuseSend={renderFriendRequestSend}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SidebarRequest;
