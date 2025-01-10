import React, { useEffect, useRef } from "react";
import * as bootstrap from "bootstrap";

function ProductModal({
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
      aria-hidden="true"
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
                {/* 表單內容 */}
                {/* 主圖片、標題、分類、描述等表單欄位 */}
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

export default ProductModal;
