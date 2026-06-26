import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { register, verifyOTP, reset } from '../features/auth/authSlice';
import { UserPlus, Mail } from 'lucide-react';

const Register = () => {
  const [searchParams] = useSearchParams();
  const sponsorParam = searchParams.get('sponsor') || '';
  const positionParam = searchParams.get('position') || 'left';

  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    sponsorUsername: sponsorParam,
    position: positionParam,
  });

  const [otpValue, setOtpValue] = useState('');

  const { username, firstName, email, mobile, password, confirmPassword, sponsorUsername, position } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, registeredEmail, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      alert(message); // Temporary error handling
      dispatch(reset());
    }

    if (user) {
      navigate('/dashboard');
    }
    
    // We do NOT reset here if isSuccess because we need registeredEmail to stay for the OTP screen
  }, [user, isError, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const userData = {
      username,
      firstName,
      email,
      mobile,
      password,
      sponsorUsername,
      position
    };

    dispatch(register(userData));
  };

  const onVerifyOTP = (e) => {
    e.preventDefault();
    if (!otpValue) {
      alert('Please enter OTP');
      return;
    }
    
    dispatch(verifyOTP({ email: registeredEmail, otp: otpValue }));
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen text-white">Loading...</div>;
  }

  // OTP Verification View
  if (registeredEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a] p-4">
        <div className="max-w-md w-full bg-[#242424] rounded-xl shadow-2xl p-8 border border-gray-800">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-600/20 text-green-500 mb-4">
              <Mail size={32} />
            </div>
            <h2 className="text-3xl font-bold text-white">Verify Email</h2>
            <p className="text-gray-400 mt-2">Enter the 6-digit OTP sent to {registeredEmail}</p>
          </div>

          <form onSubmit={onVerifyOTP} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">OTP Code</label>
              <input
                type="text"
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-gray-700 text-white focus:outline-none focus:border-green-500 text-center tracking-widest text-2xl"
                placeholder="XXXXXX"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex justify-center items-center gap-2"
            >
              Verify Account
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a] p-4 py-12">
      <div className="max-w-2xl w-full bg-[#242424] rounded-xl shadow-2xl p-8 border border-gray-800">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600/20 text-blue-500 mb-4">
            <UserPlus size={32} />
          </div>
          <h2 className="text-3xl font-bold text-white">Create an Account</h2>
          <p className="text-gray-400 mt-2">Join our Binary MLM platform today</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Sponsor Username (Optional)</label>
              <input
                type="text"
                name="sponsorUsername"
                value={sponsorUsername}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-gray-700 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Sponsor ID"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Placement Position</label>
              <select
                name="position"
                value={position}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-gray-700 text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="left">Left Leg</option>
                <option value="right">Right Leg</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={username}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-gray-700 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Choose a username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                name="firstName"
                value={firstName}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-gray-700 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-gray-700 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Mobile Number</label>
              <input
                type="tel"
                name="mobile"
                value={mobile}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-gray-700 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Enter mobile number"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-gray-700 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Create a password"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-gray-700 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Confirm password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors mt-8 flex justify-center items-center gap-2"
          >
            <UserPlus size={20} />
            Register Account
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} className="text-blue-500 hover:text-blue-400 font-medium">
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
