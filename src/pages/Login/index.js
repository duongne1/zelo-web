import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Login.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import config from '~/config';
import { toast, Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { loginUser } from '~/redux/apiRequest';
import PhoneInput from 'react-phone-input-2';
const cx = classNames.bind(styles);

function Login({ props }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!username || !password) {
                toast.error('Vui lòng nhập đầy đủ thông tin!');
                return;
            }
            const newUser = {
                username: normalizePhoneNumber(username),
                password: password,
            };

            const error = await loginUser(newUser, dispatch, navigate);

            if (error) {
                toast.error('Tài khoản hoặc mật khẩu không chính xác!');
                return;
            } else {
                toast.success('Đăng nhập thành công!');
            }
        } catch (e) {}
    };
    return (
        <div className={cx('wrapper')}>
            <div className="Auth-form-container">
                <Toaster toastOptions={{ duration: 2000 }} />
                <div className={cx('form')}>
                    <form className="Auth-form">
                        <div className="Auth-form-content">
                            <h3 className="Auth-form-title fs-1 text-center">Đăng nhập</h3>
                            <br />
                            <br />
                            <div className="form-group mt-3">
                                <label>Tài khoản</label>

                                <PhoneInput
                                    country={'vn'}
                                    value={username}
                                    onChange={setUsername}
                                    containerStyle={{ width: '100%' }}
                                    inputStyle={{ width: '100%' }}
                                />
                            </div>
                            <div className="form-group mt-3">
                                <label>Mật khẩu</label>
                                <input
                                    type="password"
                                    className="form-control form-control-lg mt-1 fs-4 "
                                    placeholder="Nhập mật khẩu"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="d-grid gap-2 mt-3">
                                <button type="submit" className="btn btn-primary btn-lg" onClick={handleSubmit}>
                                    <span className="fs-4">Đăng nhập</span>
                                </button>
                            </div>
                            <br />

                            <Link to={config.routes.home} className={cx('link')}>
                                <p className="forgot-password text-center mt-2 text-decoration-none text-primary fs-5">
                                    Trang chủ
                                </p>
                            </Link>
                            <Link to={config.routes.forgotPassword} className={cx('link')}>
                                <p className="forgot-password text-center mt-2 text-decoration-none text-primary fs-5">
                                    Quên mật khẩu?
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
        </div>
    );
}

export default Login;
