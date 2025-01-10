import { useState, useEffect } from "react";
import axios from "axios";

import "./assets/style.css";

import Login from "./components/Login";
import ProductList from "./components/ProductList";
import ProductModal from "./components/ProductModal";

const API_BASE = "https://ec-course-api.hexschool.io/v2";
const API_PATH = "book-rental";

export default function App() {
  // 狀態管理
  const [isAuth, setisAuth] = useState(false);
  const [products, setProducts] = useState([]);
  const [templateData, setTemplateData] = useState({
    id: "",
    imageUrl: "",
    title: "",
    category: "",
    unit: "",
    origin_price: "",
    price: "",
    description: "",
    content: "",
    is_enabled: false,
    imagesUrl: [],
  });
  const [modalType, setModalType] = useState("");

  // 函數：取得產品資料
  const getProductData = async () => {
    try {
      const response = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/products`
      );
      setProducts(response.data.products);
    } catch (err) {
      console.error(
        "取得產品資料失敗:",
        err.response?.data?.message || err.message
      );
    }
  };

  // 函數：新增或更新產品資料
  const updateProductData = async (id) => {
    const url =
      modalType === "edit"
        ? `${API_BASE}/api/${API_PATH}/admin/product/${id}`
        : `${API_BASE}/api/${API_PATH}/admin/product`;

    const productData = {
      data: {
        ...templateData,
        origin_price: Number(templateData.origin_price),
        price: Number(templateData.price),
        is_enabled: templateData.is_enabled ? 1 : 0,
        imagesUrl: templateData.imagesUrl,
      },
    };

    try {
      if (modalType === "edit") {
        await axios.put(url, productData);
        console.log("產品更新成功");
      } else {
        await axios.post(url, productData);
        console.log("產品新增成功");
      }
      setModalType("");
      getProductData();
    } catch (err) {
      console.error(
        modalType === "edit" ? "更新失敗:" : "新增失敗:",
        err.response?.data?.message || err.message
      );
    }
  };

  // 函數：刪除產品資料
  const delProductData = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/${API_PATH}/admin/product/${id}`);
      console.log("產品刪除成功");
      setModalType("");
      getProductData();
    } catch (err) {
      console.error(
        "刪除產品失敗:",
        err.response?.data?.message || err.message
      );
    }
  };

  // 函數：開啟 Modal
  const openModal = (product, type) => {
    setTemplateData({
      id: product.id || "",
      imageUrl: product.imageUrl || "",
      title: product.title || "",
      category: product.category || "",
      unit: product.unit || "",
      origin_price: product.origin_price || "",
      price: product.price || "",
      description: product.description || "",
      content: product.content || "",
      is_enabled: product.is_enabled || false,
      imagesUrl: product.imagesUrl || [],
    });
    setModalType(type);
  };

  // 函數：關閉 Modal
  const closeModal = () => {
    setModalType("");
  };

  // 初始驗證登入狀態
  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common.Authorization = token;

    (async () => {
      try {
        await axios.post(`${API_BASE}/api/user/check`);
        setisAuth(true);
        getProductData();
      } catch (err) {
        console.error("驗證失敗:", err.response?.data?.message || err.message);
        setisAuth(false);
      }
    })();
  }, []);

  return (
    <>
      {isAuth ? (
        <>
          <ProductList
            products={products}
            openModal={openModal}
            setisAuth={setisAuth} // 傳遞登出處理函式
          />
          <ProductModal
            modalType={modalType}
            templateData={templateData}
            handleModalInputChange={(e) => {
              const { id, value, type, checked } = e.target;
              setTemplateData((prevData) => ({
                ...prevData,
                [id]: type === "checkbox" ? checked : value,
              }));
            }}
            handleImageChange={(index, value) => {
              setTemplateData((prevData) => {
                const newImages = [...prevData.imagesUrl];
                newImages[index] = value;

                if (
                  value !== "" &&
                  index === newImages.length - 1 &&
                  newImages.length < 5
                ) {
                  newImages.push("");
                }

                if (
                  newImages.length > 1 &&
                  newImages[newImages.length - 1] === ""
                ) {
                  newImages.pop();
                }

                return { ...prevData, imagesUrl: newImages };
              });
            }}
            handleAddImage={() => {
              setTemplateData((prevData) => ({
                ...prevData,
                imagesUrl: [...prevData.imagesUrl, ""],
              }));
            }}
            handleRemoveImage={() => {
              setTemplateData((prevData) => {
                const newImages = [...prevData.imagesUrl];
                newImages.pop();
                return { ...prevData, imagesUrl: newImages };
              });
            }}
            closeModal={closeModal}
            updateProductData={updateProductData}
            delProductData={delProductData}
          />
        </>
      ) : (
        <Login setisAuth={setisAuth} getProductData={getProductData} />
      )}
    </>
  );
}
