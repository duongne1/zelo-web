import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './OtpSignIn.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import config from '~/config';
import { Link, useLocation, useNavigate } from 'react-router-dom';
const cx = classNames.bind(styles);

function OTPSignIn() {
    const [otpInput, setOtpInput] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const otp = location.state && location.state.otp;

    // Xử lý sự kiện nhập mã OTP
    const handleOtpInputChange = (event) => {
        setOtpInput(event.target.value);
    };

    // Xử lý sự kiện khi nhấn nút "Xác nhận"
    const handleSubmit = (event) => {
        event.preventDefault();
        // Kiểm tra mã OTP nhập vào có khớp với mã OTP truyền từ trang trước không
        if (otpInput === otp) {
            // Nếu đúng, chuyển hướng trang
            navigate(config.routes.home);
        } else {
            // Nếu sai, có thể hiển thị thông báo lỗi hoặc thực hiện các hành động khác
            console.log('Mã OTP không đúng');
        }
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
                            <label>Xác nhận OTP</label>
                            <input
                                type="text"
                                className="form-control form-control-lg mt-1 fs-4"
                                placeholder="Nhập mã OTP "
                                value={otpInput}
                                onChange={handleOtpInputChange}
                            />
                        </div>

                        <div className="d-grid gap-2 mt-3">
                            <button type="submit" className="btn btn-primary btn-lg" onClick={handleSubmit}>
                                <span className="fs-4">Xác nhận</span>
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

export default OTPSignIn;
