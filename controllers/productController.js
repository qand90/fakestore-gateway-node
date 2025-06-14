const axios = require('axios');
const FAKESTORE_API = process.env.FAKESTORE_API || 'https://fakestoreapi.com';

exports.createProduct = async (req, res) => {
  try {
    const response = await axios.post(`${FAKESTORE_API}/products`, req.body);
    res.status(201).json({ message: 'Product created', product: response.data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create product' });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const response = await axios.get(`${FAKESTORE_API}/products`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

exports.getProductById = async (req, res) => {
  try {

     await new Promise(resolve => setTimeout(resolve, 1000));
     
    const response = await axios.get(`${FAKESTORE_API}/products/${req.params.id}`);
    res.json(response.data);
  } catch (err) {
    if (err.response?.status === 404) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};
