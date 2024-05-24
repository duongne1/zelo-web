import React, { useContext, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './OtpForgotPassword.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import config from '~/config';
import OtpInput from 'otp-input-react';
import { toast, Toaster } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import UserContext from '~/components/context/UserContext';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from './firebase';
import axios from 'axios';
const cx = classNames.bind(styles);

function OtpForgotPassword() {
    const { userotp } = useContext(UserContext);
    const navigate = useNavigate();
    const ph = userotp?.username;
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otpVerified, setOtpVerified] = useState(false);
    const [otpOnSignup, setotpOnSignup] = useState(false);
    function onCaptchVerify() {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(
                'recaptcha-container',
                {
                    size: 'invisible',
                    callback: (response) => {
                        onSignup();
                    },
                    'expired-callback': () => {},
                },
                auth,
            );
        }
    }

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
    async function onSignup() {
        if (ph != null) {
            onCaptchVerify();
            const formatPh = normalizePhoneNumber(ph);

            const appVerifier = window.recaptchaVerifier;
            signInWithPhoneNumber(auth, formatPh, appVerifier) // Không cần truyền appVerifier ở đây
                .then((confirmationResult) => {
                    window.confirmationResult = confirmationResult;
                    setotpOnSignup(true);
                    toast.success('OTP đã gửi về số điện thoại!');
                })
                .catch((error) => {});
        } else {
            toast.error('Số điện thoại không hợp lệ!');
        }
    }
    function onOTPVerify() {
        if (otp != null && otpOnSignup === true) {
            window.confirmationResult
                .confirm(otp)
                .then(async (res) => {
                    console.log('thanh cong');
                    // Đánh dấu rằng mã OTP đã được xác minh thành công
                    setOtpVerified(true);
                    toast.success('Xác nhận OTP thành công!');
                })
                .catch((err) => {});
        } else {
            toast.error('Mã OTP không đúng!');
        }
    }
    const handleForgotPwd = async (e) => {
        e.preventDefault();

        try {
            const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

            if (!password) {
                toast.error('Vui lòng nhập mật khẩu mới!');
                return;
            }

            if (password.length < 8) {
                toast.error('Mật khẩu tối thiểu 8 ký tự');
                return;
            }

            if (!passRegex.test(password)) {
                toast.error('Mật khẩu ít nhất một chữ cái thường,hoa và một số!');
                return;
            }
            if (password !== confirmPassword) {
                toast.error('Nhập lại mật khẩu không khớp!');
                return;
            }
            if (otpVerified === true) {
                // Gửi dữ liệu đăng ký lên API
                const response = await axios.post('api/v1/users/forgot-password', {
                    username: ph,
                    passwordNew: password,
                });
                if (response) {
                    toast.success('Đổi mật khẩu thành công!');
                    navigate(config.routes.login);
                }
            } else {
                toast.error('Chưa nhấn xác nhận OTP!');
            }
        } catch (err) {
            toast.error('Sdt không tồn tại! Vui lòng nhập lại!');
        }
    };
    return (
        <div className={cx('wrapper')}>
            <div className="Auth-form-container">
                <form className="Auth-form">
                    <div className="Auth-form-content">
                        <h3 className="Auth-form-title fs-1 text-center">Quên mật khẩu</h3>
                        <br />
                        <br />
                        <Toaster toastOptions={{ duration: 2000 }} />
                        <div id="recaptcha-container"></div>
                        <div className="form-group mt-3">
                            <label>Mật khẩu</label>
                            <input
                                type="password"
                                className="form-control form-control-lg mt-1 fs-4 "
                                placeholder="Nhập mật khẩu mới"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label>Xác nhận mật khẩu</label>
                            <input
                                type="password"
                                className="form-control form-control-lg mt-1 fs-4"
                                placeholder="Nhập lại mật khẩu mới"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        {/* Thêm trường nhập mã OTP */}
                        <div className="form-group mt-3 d-flex align-items-center">
                            {/* <input
                                type="text"
                                className="form-control form-control-lg mt-1 fs-4 flex-grow-1 me-2"
                                placeholder="Nhập mã OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            /> */}
                            <OtpInput
                                value={otp}
                                onChange={setOtp}
                                OTPLength={6}
                                otpType="number"
                                disabled={false}
                                autoFocus
                                className="opt-container "
                            ></OtpInput>
                            <button type="button" className={cx('btn-send-otp')} onClick={onSignup}>
                                <span className="fs-4">Lấy OTP</span>
                            </button>
                            <button type="button" className={cx('btn-send-otp')} onClick={onOTPVerify}>
                                <span className="fs-4">Xác nhận OTP</span>
                            </button>
                        </div>

                        <div className="d-grid gap-2 mt-3">
                            <button type="submit" className="btn btn-primary btn-lg" onClick={handleForgotPwd}>
                                <span className="fs-4">Xác nhận </span>
                            </button>
                        </div>
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

export default OtpForgotPassword;
