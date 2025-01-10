import { useState } from "react";
import axios from "axios";

const API_BASE = "https://ec-course-api.hexschool.io/v2";

export default function Login({ setisAuth, getProductData }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE}/admin/signin`, formData);

      if (response && response.data) {
        const { token, expired } = response.data;

        document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
        axios.defaults.headers.common.Authorization = token;

        await getProductData();
        setisAuth(true);
        alert("登入成功！");
      } else {
        throw new Error("登入回應格式錯誤，缺少必要的 data 屬性");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "無法處理登入請求，請稍後再試";
      alert("登入失敗: " + errorMessage);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div
        className="card shadow-lg p-4"
        style={{ maxWidth: "400px", width: "100%" }}>
        <div className="card-body">
          <h1 className="card-title text-center mb-4 fw-bold">登入系統</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label fw-bold">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="username"
                placeholder="請輸入電子郵件"
                value={formData.username}
                onChange={handleInputChange}
                required
                autoFocus
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-bold">
                密碼
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="請輸入密碼"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              登入
            </button>
          </form>
        </div>
        <footer className="text-center mt-4">
          <small className="text-muted">
            &copy; 2024~∞ - 六角學院
            <br />
            第三週作業 - 熟練 React.js by aaron
          </small>
        </footer>
      </div>
    </div>
  );
}
