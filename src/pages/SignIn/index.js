import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './SignIn.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import config from '~/config';
import { Link, useNavigate } from 'react-router-dom';
import OtpInput from 'otp-input-react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { toast, Toaster } from 'react-hot-toast';
import { auth } from './firebase';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useDispatch } from 'react-redux';
import { registerUser } from '~/redux/apiRequest';

const cx = classNames.bind(styles);

function SignIn() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState(null);
    const [name, setName] = useState(null);
    const [password, setPassword] = useState(null);
    const [otp, setOtp] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otpVerified, setOtpVerified] = useState(false);
    const [otpOnSignup, setotpOnSignup] = useState(false);

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
    function onSignup() {
        if (userName !== null) {
            onCaptchVerify();

            const formatPh = normalizePhoneNumber(userName);
            const appVerifier = window.recaptchaVerifier;
            signInWithPhoneNumber(auth, formatPh, appVerifier) // Không cần truyền appVerifier ở đây
                .then((confirmationResult) => {
                    window.confirmationResult = confirmationResult;
                    setotpOnSignup(true);
                    toast.success('OTP đã được gửi về số điện thoại!');
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

    const handleSignupOTP = async () => {
        try {
            const nameRegex = /^[^\d]{3,20}$/;

            const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

            if (!name || !userName || !password) {
                toast.error('Vui lòng nhập đầy đủ thông tin!');
                return;
            }

            if (!nameRegex.test(name)) {
                toast.error('Tên không chứa số, 3-20 ký tự!');
                return;
            }

            if (userName.length < 11) {
                toast.error('Số điện thoại không hợp lệ!');
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
                toast.error('Mật khẩu không khớp!');
                return;
            }

            if (otpVerified === true) {
                const newUser = {
                    name: name,
                    username: normalizePhoneNumber(userName),
                    password: password,
                };

                const error = await registerUser(newUser, dispatch, navigate);

                if (error) {
                    toast.error('Số điện thoại đã tồn tại!');
                    return;
                } else {
                    toast.success('Đăng ký thành công!');
                }
            } else {
                toast.error('Chứa nhấn xác nhận OTP!');
            }
        } catch (err) {}
    };

    return (
        <div className={cx('wrapper')}>
            <div className="Auth-form-container">
                <form className="Auth-form">
                    <div className="Auth-form-content">
                        <h3 className="Auth-form-title fs-1 text-center">Đăng ký</h3>
                        <br />
                        <br />

                        <div className="form-group mt-3">
                            <Toaster toastOptions={{ duration: 2000 }} />
                            <div id="recaptcha-container"></div>
                            <label>Tên</label>
                            <input
                                type="text"
                                className="form-control form-control-lg mt-1 fs-4"
                                placeholder="Nhập tên người dùng"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="form-group mt-3">
                            <label>Số điện thoại</label>

                            <PhoneInput
                                country={'vn'}
                                value={userName}
                                onChange={setUserName}
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
                        <div className="form-group mt-3">
                            <label>Xác nhận mật khẩu</label>
                            <input
                                type="password"
                                className="form-control form-control-lg mt-1 fs-4"
                                placeholder="Nhập lại mật khẩu"
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
                            <button type="button" className="btn btn-primary btn-lg" onClick={handleSignupOTP}>
                                <span className="fs-4">Đăng ký</span>
                            </button>
                        </div>
                        <br />
                        <Link to={config.routes.otpSignIn} className={cx('link')}>
                            <p className="forgot-password text-center mt-2 text-decoration-none text-primary fs-5">
                                Trang chủ
                            </p>
                        </Link>

                        <Link to={config.routes.login} className={cx('link')}>
                            <p className="forgot-password text-center mt-2 text-decoration-none text-primary fs-5">
                                Đăng nhập
                            </p>
                        </Link>
                        <Link to={config.routes.forgotPassword} className={cx('link')}>
                            <p className="forgot-password text-center mt-2 text-decoration-none text-primary fs-5">
                                Quên mật khẩu?
                            </p>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignIn;
