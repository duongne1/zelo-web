import React, { useContext, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './ForgotPassword.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import config from '~/config';
import axios from 'axios';
import UserContext from '~/components/context/UserContext';
import PhoneInput from 'react-phone-input-2';

const cx = classNames.bind(styles);
function SignIn(props) {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    const { setUserOtp } = useContext(UserContext);

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
    const handleFormSubmit = async (event) => {
        event.preventDefault();

        try {
            // Gọi API để kiểm tra tên người dùng
            const response = await axios.post('https://backend-zalo-pfceb66tqq-as.a.run.app/api/v1/users/username', {
                username: normalizePhoneNumber(username),
            });
            setUserOtp(response.data);
            // Xử lý phản hồi từ API

            if (response.data) {
                navigate(config.routes.otpForgotPassword);
            }
        } catch (error) {
            toast.error('Không tìm thấy người dùng này!');
        }
    };

    const location = useLocation();
    // Trích xuất thông tin người dùng từ location.state
    const user = location.state && location.state.user;
    return (
        <div className={cx('wrapper')}>
            <div className="Auth-form-container">
                <form className="Auth-form">
                    <div className="Auth-form-content">
                        <Toaster toastOptions={{ duration: 2000 }} />
                        <h3 className="Auth-form-title fs-1 text-center">Quên mật khẩu</h3>
                        <br />
                        <br />
                        <p className="forgot-password  mt-2 text-decoration-none text-primary fs-5 text-info">
                            Nhập SĐT để lấy lại mật khẩu
                        </p>
                        <div className="form-group mt-3">
                            <label>Số điện thoại</label>

                            <PhoneInput
                                country={'vn'}
                                value={username}
                                onChange={setUsername}
                                containerStyle={{ width: '100%' }}
                                inputStyle={{ width: '100%' }}
                            />
                        </div>
                        <Link className={cx('button')}>
                            <div className="d-grid gap-2 mt-3">
                                <button type="submit" className="btn btn-primary btn-lg" onClick={handleFormSubmit}>
                                    <span className="fs-4">Xác nhận</span>
                                </button>
                            </div>
                        </Link>
                        <br />
                        <Link to={config.routes.home} className={cx('link')}>
                            <p className="forgot-password text-center mt-2 text-decoration-none text-primary fs-5">
                                Trang chủ
                            </p>
                        </Link>
                        <Link to={config.routes.login} className={cx('link')}>
                            <p className="forgot-password text-center mt-2 text-decoration-none text-primary fs-5">
                                Đăng nhập
                            </p>
                        </Link>
                        <Link to={config.routes.signIn} className={cx('link')}>
                            <p className="forgot-password text-center mt-2 text-decoration-none text-primary fs-5">
                                Bạn chưa có tài khoản?
                            </p>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignIn;
