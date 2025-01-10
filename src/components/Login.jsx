import { useState } from "react";
import axios from "axios";

const API_BASE = "https://ec-course-api.hexschool.io/v2";

export default function Login({ setisAuth, getProductData }) {
  // 登入表單的狀態管理
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // 管理表單的輸入變更
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // 登入表單提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE}/admin/signin`, formData);

      if (response && response.data) {
        const { token, expired } = response.data;

        // 設定 cookie 與 Axios 授權標頭
        document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
        axios.defaults.headers.common.Authorization = token;

        // 驗證成功後，取得產品資料，並將登入狀態設為 true
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
    <div className="container login">
      <div className="row justify-content-center">
        <h1 className="h3 mb-3 font-weight-normal text-center">請先登入</h1>
        <div className="col-8">
          <form id="form" className="form-signin" onSubmit={handleSubmit}>
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                id="username"
                placeholder="name@example.com"
                value={formData.username}
                onChange={handleInputChange}
                required
                autoFocus
              />
              <label htmlFor="username">Email address</label>
            </div>
            <div className="form-floating">
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="password">Password</label>
            </div>
            <button className="btn btn-lg btn-primary w-100 mt-3" type="submit">
              登入
            </button>
          </form>
        </div>
      </div>
      <footer className="text-center mt-5">
        <p className="text-muted">&copy; 2024~∞ - 六角學院</p>
      </footer>
    </div>
  );
}
