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
  const [formData, setFormData] = useState({ username: "", password: "" });
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

  // 函數：登錄相關
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
      const { token, expired } = response.data;
      document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
      axios.defaults.headers.common.Authorization = `${token}`;
      getProductData();
      setisAuth(true);
    } catch (error) {
      alert("登入失敗: " + error.response.data.message);
    }
  };

  const checkAdmin = async () => {
    try {
      await axios.post(`${API_BASE}/api/user/check`);
      getProductData();
      setisAuth(true);
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  // 函數：產品相關
  const getProductData = async () => {
    try {
      const response = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/products`
      );
      setProducts(response.data.products);
    } catch (err) {
      console.error(err.response.data.message);
    }
  };

  const updateProductData = async (id) => {
    let product;
    if (modalType === "edit") {
      product = `product/${id}`;
    } else {
      product = `product`;
    }

    const url = `${API_BASE}/api/${API_PATH}/admin/${product}`;

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
      let response;
      if (modalType === "edit") {
        response = await axios.put(url, productData);
        console.log("更新成功", response.data);
      } else {
        response = await axios.post(url, productData);
        console.log("新增成功", response.data);
      }
      setModalType(""); // 關閉 Modal
      getProductData();
    } catch (err) {
      if (modalType === "edit") {
        console.error("更新失敗", err.response.data.message);
      } else {
        console.error("新增失敗", err.response.data.message);
      }
    }
  };

  const delProductData = async (id) => {
    try {
      const response = await axios.delete(
        `${API_BASE}/api/${API_PATH}/admin/product/${id}`
      );
      console.log("刪除成功", response.data);
      setModalType(""); // 關閉 Modal
      getProductData();
    } catch (err) {
      console.error("刪除失敗", err.response.data.message);
    }
  };

  // 函數：Modal 操作
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

  const closeModal = () => {
    setModalType("");
  };

  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common.Authorization = token;
    checkAdmin();
  }, []);

  return (
    <>
      {isAuth ? (
        <>
          <ProductList products={products} openModal={openModal} />
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
        <Login
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
      )}
    </>
  );
}
