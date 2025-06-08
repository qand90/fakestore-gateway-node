const controller = require('../../controllers/productController');
const axios = require('axios');

jest.mock('axios');

describe('Product Controller Unit Tests', () => {
  let mockRes;

  beforeEach(() => {
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  test('getAllProducts returns product list', async () => {
    const mockProducts = [{ id: 1, title: 'Test' }];
    axios.get.mockResolvedValue({ data: mockProducts });

    await controller.getAllProducts({}, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith(mockProducts);
  });

  test('getAllProducts handles error', async () => {
    axios.get.mockRejectedValue(new Error('API fail'));

    await controller.getAllProducts({}, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to fetch products' });
  });

  test('getProductById returns product', async () => {
    axios.get.mockResolvedValue({ data: { id: 1, title: 'Item' } });

    await controller.getProductById({ params: { id: 1 } }, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith({ id: 1, title: 'Item' });
  });

  test('getProductById handles 404', async () => {
    const error = new Error();
    error.response = { status: 404 };
    axios.get.mockRejectedValue(error);

    await controller.getProductById({ params: { id: 999 } }, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Product not found' });
  });
});
