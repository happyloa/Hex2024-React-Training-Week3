import React from "react";

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
  return (
    <div
      className="modal fade"
      id="productModal"
      tabIndex="-1"
      aria-labelledby="productModalLabel"
      aria-hidden="true">
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
              aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {/* Modal Body Content */}
            {modalType === "delete" ? (
              <p className="h4">
                確定要刪除
                <span className="text-danger">{templateData.title}</span>
                嗎?
              </p>
            ) : (
              // ... 省略完整內容，與主程式碼保持一致
              <div>表單內容</div>
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
