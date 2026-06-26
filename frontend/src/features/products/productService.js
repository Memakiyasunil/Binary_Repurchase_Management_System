const API_URL = '/api/products/';

const getProducts = async () => {
  const response = await fetch(API_URL);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

const productService = {
  getProducts,
};

export default productService;
