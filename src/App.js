import React, { useEffect, useState } from "react";
import "./App.css";
import emailJs from "@emailjs/browser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [email, setEmail] = useState("");
  const [isOtpSend, setIsOtpSend] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEmailChanged, setIsEmailChanged] = useState(false);
  const [prevEmail, setPrevEmail] = useState("");

  const validateEmail = () => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (emailRegex.test(email)) {
      return true;
    } else {
      setEmailError(true);
      return false;
    }
  };

  const handleEmailChange = (e) => {
    if (isOtpSend && prevEmail !== e.target.value) {
      setIsEmailChanged(true);
    } else {
      setIsEmailChanged(false);
    }
    setEmail(e.target.value);
    setEmailError("");
  };

  useEffect(() => {
    let interval = null;
    if (timer > 0 && isOtpSend) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer, isOtpSend]);

  const sendOtp = (e) => {
    e.preventDefault();
    if (validateEmail()) {
      emailJs
        .sendForm(
          "service_iid7wb8",
          "template_dlexqla",
          e.target,
          "_jCC7YPt8xkIiXKRX"
        )
        .then(() => {
          setPrevEmail(email);
          setTimer(30);
          setIsEmailChanged(false);
          // startTimer();
          toast.success("OTP sent");
          setIsOtpSend(true);
        })
        .catch(() => {
          toast.error("some error");
        });
    }
  };

  // const handleResendOTP = (e) => {
  //   if (timer === 0) {
  //     sendOtp(e);
  //   }
  // };

  useEffect(() => {
    if (otp.length === 6) {
      if (Number(otp) === 123456) {
        if (email) {
          toast.success("Logged in");
          setIsLoggedIn(true);
        } else {
          toast.warn("Email is not find");
        }
      } else {
        toast.error("OTP is wrong");
      }
    }
  }, [otp, email]);

  return (
    <>
      <ToastContainer />
      {isLoggedIn ? (
        <div>
          <h1>Logged In</h1>
        </div>
      ) : (
        <div className="login_root">
          <div className="login_main">
            <h1>Otp-login</h1>
            <form
              className="login_form w_100"
              onSubmit={(e) => {
                e.preventDefault();
                if (timer === 0) {
                  sendOtp(e);
                } else if (isEmailChanged) {
                  sendOtp(e);
                }
              }}
            >
              <div className="login_form_main">
                <input
                  type="email"
                  name="user_email"
                  value={email}
                  onChange={(e) => handleEmailChange(e)}
                  className="login_form_input"
                  placeholder="abc@xyz.com"
                />
                {emailError && (
                  <span className="error-message">
                    Please enter a valid email
                  </span>
                )}
              </div>
              {!isEmailChanged && isOtpSend ? (
                <>
                  <div className="login_form_main">
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="login_form_input"
                      placeholder="12345"
                    />
                  </div>
                  {timer === 0 ? (
                    <button
                      type="submit"
                      // onClick={(e) => handleResendOTP(e)}
                      className="otpBtn"
                    >
                      Resend
                    </button>
                  ) : (
                    <p className="timer">
                      <span style={{ fontSize: 12, fontWeight: "400" }}>
                        Resend after
                      </span>{" "}
                      00 : {timer.toString().padStart(2, 0)}
                    </p>
                  )}
                </>
              ) : (
                <button type="submit" className="otpBtn">
                  Send Otp
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default App;
