import React from "react";
import axios from "axios";

export default function ProductList({ products, openModal, setisAuth }) {
  // 處理登出按鈕點擊事件
  const handleLogout = async () => {
    try {
      // 呼叫 API 執行登出
      await axios.post("https://ec-course-api.hexschool.io/v2/logout");
      // 清除驗證狀態
      document.cookie =
        "hexToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      setisAuth(false);
      alert("登出成功！");
    } catch (error) {
      console.error(
        "登出失敗:",
        error.response?.data?.message || error.message
      );
      alert("登出失敗，請稍後再試！");
    }
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-end align-items-center gap-2 mt-4">
        {/* 登出按鈕 */}
        <button
          type="button"
          className="btn btn-danger btn-sm"
          onClick={handleLogout}>
          登出
        </button>
        {/* 建立新產品按鈕 */}
        <button
          type="button"
          className="btn btn-outline-primary btn-sm"
          onClick={() => openModal({}, "new")}>
          建立新的產品
        </button>
      </div>

      {/* 產品清單表格 */}
      <table className="table mt-4">
        <thead>
          <tr>
            <th width="120">分類</th>
            <th>產品名稱</th>
            <th width="120">原價</th>
            <th width="120">售價</th>
            <th width="100">是否啟用</th>
            <th width="120">操作</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.category}</td>
              <td>{product.title}</td>
              <td className="text-end">{product.origin_price}</td>
              <td className="text-end">{product.price}</td>
              <td>
                {product.is_enabled ? (
                  <span className="text-success">啟用</span>
                ) : (
                  <span>未啟用</span>
                )}
              </td>
              <td>
                <div className="btn-group">
                  {/* 編輯按鈕 */}
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => openModal(product, "edit")}>
                    編輯
                  </button>
                  {/* 刪除按鈕 */}
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => openModal(product, "delete")}>
                    刪除
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
