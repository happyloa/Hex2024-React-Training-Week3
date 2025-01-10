import { useEffect, useRef } from "react";
import * as bootstrap from "bootstrap";

export default function ProductModal({
  modalType,
  templateData,
  handleModalInputChange,
  handleImageChange,
  handleAddImage,
  handleRemoveImage,
  closeModal,
  updateProductData,
  delProductData,
}) {
  const modalRef = useRef(null); // Ref 指向 Modal DOM 元素
  const bsModal = useRef(null); // Bootstrap Modal 實例

  useEffect(() => {
    // 初始化 Bootstrap Modal
    if (modalRef.current) {
      bsModal.current = new bootstrap.Modal(modalRef.current, {
        keyboard: false,
      });
    }

    return () => {
      // 清理 Bootstrap Modal 實例
      if (bsModal.current) {
        bsModal.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    // 根據需要顯示或隱藏 Modal
    if (modalType && bsModal.current) {
      bsModal.current.show();
    }
  }, [modalType]);

  return (
    <div
      className="modal fade"
      id="productModal"
      tabIndex="-1"
      aria-labelledby="productModalLabel"
      ref={modalRef}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content border-0">
          <div
            className={`modal-header ${
              modalType === "delete" ? "bg-danger" : "bg-dark"
            } text-white`}>
            <h5 id="productModalLabel" className="modal-title">
              <span>
                {modalType === "delete"
                  ? "刪除產品"
                  : modalType === "edit"
                  ? "編輯產品"
                  : "新增產品"}
              </span>
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={closeModal}></button>
          </div>
          <div className="modal-body">
            {/* 根據 modalType 渲染不同內容 */}
            {modalType === "delete" ? (
              <p className="h4">
                確定要刪除
                <span className="text-danger">{templateData.title}</span>
                嗎?
              </p>
            ) : (
              <div className="row">
                <div className="col-sm-4">
                  <div className="mb-3">
                    <label htmlFor="imageUrl" className="form-label">
                      輸入圖片網址
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="imageUrl"
                      placeholder="請輸入圖片連結"
                      value={templateData.imageUrl}
                      onChange={handleModalInputChange}
                    />
                  </div>
                  <img
                    className="img-fluid mb-3"
                    src={templateData.imageUrl}
                    alt="主圖"
                  />
                  <div>
                    {/* 多圖輸入 */}
                    {templateData.imagesUrl.map((image, index) => (
                      <div key={index} className="mb-2">
                        <input
                          type="text"
                          className="form-control mb-2"
                          value={image}
                          onChange={(e) =>
                            handleImageChange(index, e.target.value)
                          }
                          placeholder={`圖片網址 ${index + 1}`}
                        />
                        {image && (
                          <img
                            src={image}
                            alt={`副圖 ${index + 1}`}
                            className="img-thumbnail mb-2"
                          />
                        )}
                      </div>
                    ))}
                    <div className="d-flex justify-content-between">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={handleAddImage}>
                        新增圖片
                      </button>
                      {templateData.imagesUrl.length > 0 && (
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={handleRemoveImage}>
                          刪除最後一張圖片
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-sm-8">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      標題
                    </label>
                    <input
                      id="title"
                      type="text"
                      className="form-control"
                      placeholder="請輸入標題"
                      value={templateData.title}
                      onChange={handleModalInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="category" className="form-label">
                      分類
                    </label>
                    <input
                      id="category"
                      type="text"
                      className="form-control"
                      placeholder="請輸入分類"
                      value={templateData.category}
                      onChange={handleModalInputChange}
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="origin_price" className="form-label">
                        原價
                      </label>
                      <input
                        id="origin_price"
                        type="number"
                        className="form-control"
                        placeholder="請輸入原價"
                        value={templateData.origin_price}
                        onChange={handleModalInputChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="price" className="form-label">
                        售價
                      </label>
                      <input
                        id="price"
                        type="number"
                        className="form-control"
                        placeholder="請輸入售價"
                        value={templateData.price}
                        onChange={handleModalInputChange}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      產品描述
                    </label>
                    <textarea
                      id="description"
                      className="form-control"
                      placeholder="請輸入產品描述"
                      value={templateData.description}
                      onChange={handleModalInputChange}></textarea>
                  </div>
                  <div className="form-check mb-3">
                    <input
                      id="is_enabled"
                      className="form-check-input"
                      type="checkbox"
                      checked={templateData.is_enabled}
                      onChange={handleModalInputChange}
                    />
                    <label className="form-check-label" htmlFor="is_enabled">
                      是否啟用
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              data-bs-dismiss="modal"
              onClick={closeModal}>
              取消
            </button>
            {modalType === "delete" ? (
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => delProductData(templateData.id)}>
                刪除
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => updateProductData(templateData.id)}>
                確認
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
