import { useEffect, useRef, useState } from "react";
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
  const [isLoading, setIsLoading] = useState(false); // 控制 spinner 顯示狀態

  useEffect(() => {
    if (modalRef.current) {
      bsModal.current = new bootstrap.Modal(modalRef.current, {
        backdrop: "static",
        keyboard: false,
      });
    }

    return () => {
      if (bsModal.current) {
        bsModal.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (modalType && bsModal.current) {
      bsModal.current.show();
    }
  }, [modalType]);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      if (modalType === "delete") {
        await delProductData(templateData.id);
      } else {
        await updateProductData(templateData.id);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="modal fade"
      id="productModal"
      tabIndex="-1"
      aria-labelledby="productModalLabel"
      ref={modalRef}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content border-0 shadow-lg">
          <div
            className={`modal-header ${
              modalType === "delete"
                ? "bg-danger text-white"
                : "bg-dark text-white"
            }`}>
            <h5 id="productModalLabel" className="modal-title">
              {modalType === "delete"
                ? "刪除產品"
                : modalType === "edit"
                ? "編輯產品"
                : "新增產品"}
            </h5>
            <button
              type="button"
              className="btn-close bg-light"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={closeModal}
              disabled={isLoading}></button>
          </div>
          <div className="modal-body">
            {modalType === "delete" ? (
              <p className="h5">
                確定要刪除
                <span className="text-danger"> {templateData.title} </span>
                嗎?
              </p>
            ) : (
              <div className="row">
                <div className="col-md-4">
                  {modalType === "edit" && (
                    <div className="mb-3">
                      <label htmlFor="imageUrl" className="form-label fw-bold">
                        圖片網址
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="imageUrl"
                        placeholder="請輸入圖片連結"
                        value={templateData.imageUrl}
                        onChange={handleModalInputChange}
                      />
                      <img
                        className="img-fluid mt-3 border"
                        src={templateData.imageUrl}
                        alt="主圖"
                      />
                    </div>
                  )}
                  <div>
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
                        onClick={handleAddImage}
                        disabled={isLoading}>
                        新增圖片
                      </button>
                      {templateData.imagesUrl.length > 0 && (
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={handleRemoveImage}
                          disabled={isLoading}>
                          刪除最後一張圖片
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-md-8">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label fw-bold">
                      標題
                    </label>
                    <input
                      id="title"
                      type="text"
                      className="form-control"
                      placeholder="請輸入標題"
                      value={templateData.title}
                      onChange={handleModalInputChange}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="category" className="form-label fw-bold">
                      分類
                    </label>
                    <input
                      id="category"
                      type="text"
                      className="form-control"
                      placeholder="請輸入分類"
                      value={templateData.category}
                      onChange={handleModalInputChange}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label
                        htmlFor="origin_price"
                        className="form-label fw-bold">
                        原價
                      </label>
                      <input
                        id="origin_price"
                        type="number"
                        className="form-control"
                        placeholder="請輸入原價"
                        value={templateData.origin_price}
                        onChange={handleModalInputChange}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="price" className="form-label fw-bold">
                        售價
                      </label>
                      <input
                        id="price"
                        type="number"
                        className="form-control"
                        placeholder="請輸入售價"
                        value={templateData.price}
                        onChange={handleModalInputChange}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label fw-bold">
                      產品描述
                    </label>
                    <textarea
                      id="description"
                      className="form-control"
                      placeholder="請輸入產品描述"
                      value={templateData.description}
                      onChange={handleModalInputChange}
                      disabled={isLoading}></textarea>
                  </div>
                  <div className="form-check mb-3">
                    <input
                      id="is_enabled"
                      className="form-check-input"
                      type="checkbox"
                      checked={templateData.is_enabled}
                      onChange={handleModalInputChange}
                      disabled={isLoading}
                    />
                    <label
                      className="form-check-label fw-bold"
                      htmlFor="is_enabled">
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
              onClick={closeModal}
              disabled={isLoading}>
              取消
            </button>
            <button
              type="button"
              className={`btn ${
                modalType === "delete" ? "btn-danger" : "btn-primary"
              }`}
              onClick={handleConfirm}
              disabled={isLoading}>
              {isLoading ? (
                <span
                  className="spinner-border spinner-border-sm text-light"
                  role="status"
                  aria-hidden="true"></span>
              ) : modalType === "delete" ? (
                "刪除"
              ) : (
                "確認"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
