import { useState } from "react";
import axiosInstance from "../../api/axios";
import { useNavigate } from "react-router-dom";


const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthday, setBirthday] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [gender, setGender] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.post("/auth/register", {
        email,
        fullname,
        password,
        gender,
        shippingAddress,
      });
      console.log("Register success:", res.data);
      localStorage.setItem("token", res.data.token);
      navigate("/home");
    }
    catch (err: any) {
      console.error("Register failed", err);
      setError("he ehe he ehhehe");
    }
  };

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-600 to-purple-700">
        <div className="flex w-full max-w-6xl bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Banner bên trái */}
          <div className="hidden md:flex flex-1 bg-gradient-to-br from-sky-400 to-red-500 items-center justify-center">
            <h2 className="text-4xl font-bold text-white text-center">
              ĐỨC BO ĐẸP TRAI
            </h2>
          </div>

          <div className="w-full md:w-1/2 p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Đăng ký</h2>

            <form onSubmit={handleRegister} className="space-y-4">
              <input
                type="text"
                placeholder="Email hoặc Số điện thoại"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />

              <input
                type="text"
                placeholder="Họ và tên"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />

              <input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />


              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="border p-2 rounded-md"
              >
                <option value="FeMale">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>

              <input
                type="text"
                placeholder="Địa chỉ giao hàng"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />

              <button
                type="submit"
                className="w-full bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Đăng ký
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
