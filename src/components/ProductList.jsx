import React from "react";

export default function ProductList({ products, openModal }) {
  // 渲染產品列表，並提供新增、編輯、刪除的功能按鈕
  return (
    <div className="container">
      {/* 建立新產品按鈕 */}
      <div className="text-end mt-4">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => openModal({}, "new")} // 點擊後開啟新增產品的 Modal
        >
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
            <th width="120">編輯</th>
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
                    onClick={() => openModal(product, "edit")} // 點擊後開啟編輯產品的 Modal
                  >
                    編輯
                  </button>
                  {/* 刪除按鈕 */}
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => openModal(product, "delete")} // 點擊後開啟刪除產品的 Modal
                  >
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
