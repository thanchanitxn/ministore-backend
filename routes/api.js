const express = require('express');
const rateLimit = require('express-rate-limit');

const apiLimit = rateLimit({
    windowMs: 1000 * 60 * 3 , // 3 minutes
    max: 100,
    message: 'You have exceeded the 100 requests in 3 minutes limit!',
});

const router = express.Router();
const customerController = require('../controllers/customers');

router.post('/customers', apiLimit, customerController.createCustomer);
router.put('/customers/:id',  customerController.updateCustomer);
router.delete('/customers/:id',  customerController.deleteCustomer);
router.get('/customers/:id',  customerController.getCustomer);
router.get('/customers',  customerController.getCustomers);

const productController = require('../controllers/products');
router.post('/products', apiLimit, productController.createProduct);
router.put('/products/:id',  productController.updateProduct);  
router.delete('/products/:id',  productController.deleteProduct);
router.get('/products/:id',  productController.getProduct);
router.get('/products',  productController.getProducts);

const orderController = require('../controllers/orders');
router.post('/orders', apiLimit, orderController.createOrder);
router.put('/orders/:id',  orderController.updateOrder);  
router.delete('/orders/:id',  orderController.deleteOrder);
router.get('/orders/:id',  orderController.getOrder);
router.get('/orders',  orderController.getOrders);

const orderdetailController = require('../controllers/orderdetail');
router.post('/orderdetail', apiLimit, orderdetailController.createOrderdetail);
router.put('/orderdetail/:id',  orderdetailController.updateOrderdetail);  
router.delete('/orderdetail/:id',  orderdetailController.deleteOrderdetail);
router.get('/orderdetail/:id',  orderdetailController.getOrderdetail);
router.get('/orderdetail',  orderdetailController.getOrderdetails);

const paymentController = require('../controllers/payments');
router.post('/payments', apiLimit, paymentController.createPayment);
router.put('/payments/:id',  paymentController.updatePayment);  
router.delete('/payments/:id',  paymentController.deletePayment);
router.get('/payments/:id',  paymentController.getPayment);
router.get('/payments',  paymentController.getPayments);

const userController = require('../controllers/users');
router.post('/users', apiLimit, userController.createUser);
router.put('/users/:id',  userController.updateUser);  
router.delete('/users/:id',  userController.deleteUser);
router.get('/users/:id',  userController.getUser);
router.get('/users',  userController.getUsers);

module.exports = router;
