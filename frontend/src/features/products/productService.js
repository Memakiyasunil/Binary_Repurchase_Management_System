const API_URL = 'http://localhost:5000/api/products/';

const getProducts = async () => {
  const response = await fetch(API_URL);
  
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'Something went wrong');
  }

  const data = await response.json();
  return data;
};

const productService = {
  getProducts,
};

export default productService;
