const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

//insert a new product
const createOrderdetail = async (req, res) => {
    const {order_id,product_id, quantity, unit_price} = req.body;
    try{
        const cust = await prisma.orderdetail.create({
            data: {
                order_id,
                product_id,
                quantity,
                unit_price
            }
        });
        res.status(200).json({
            status: 'ok',
            message:`Product with id ${cust.orderdetail_id} is created successfully`
        });

    }catch (err){
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong',
            error: err.message
        });
    }
};

//get all products
const getOrderdetails = async (req, res) => {
    const custs = await prisma.orderdetail.findMany();
    res.json(custs);
}
//get  one product by id
const getOrderdetail = async (req, res) => {
    const {id} = req.params;
    try{
        const cust = await prisma.orderdetail.findUnique({
            where: {
                orderdetail_id: Number (id)
            }
        });
        if(!cust){res.status(404).json({message: 'Product not found'});
    }else{
        res.status(200).json(cust);}
    }catch(err){
        res.status(500).json(err)
    }
}

//delete a product by id
const deleteOrderdetail = async (req, res) => {
    const {id} = req.params;
    try{
        const existingOrderdetail = await prisma.orderdetail.findUnique({
            where: {
                orderdetail_id: Number(id)
            }
        });
        if(!existingOrderdetail){
            res.status(404).json({message: 'Product not found'});
        }
        await prisma.orderdetail.delete({
            where: {
                orderdetail_id: Number(id)
            }
        });
        res.status(200).json({status: 'ok', message: `product with id ${id} is deleted successfully`});
    }catch(err){
        console.error('Delete product error:', err);

    }
}

//update a customer by id
const updateOrderdetail = async (req, res) => {
    const {order_id,product_id, quantity, unit_price} = req.body;
    const {id} = req.params;
    const data = {};
    if (order_id) data.order_id = order_id;
    if (product_id) data.product_id = product_id;
    if (quantity) data.quantity = quantity;
    if (unit_price) data.unit_price = unit_price;

    if (Object.keys(data).length === 0){
        res.status(400).json({status: 'error' ,message: 'No data to update'});
    }
    try{
        const cust = await prisma.orderdetail.update({
            data,
            where: {
                orderdetail_id: Number(id)
            }
        });
        res.status(200).json({status: 'ok', message: `Product with id ${cust.orderdetail_id} is updated successfully`,orderdetail: cust});
    }catch(err){
        if (err.code == 'P2002') {
            res.status(404).json({
                status: 'error',
                message: 'Email already exists'
            });
        } else if (err.code == 'P2025') {
            res.status(404).json({
                status: 'error',
                message: `Product with id ${id} not found`
            });
        } else {
            console.error('Update product error:', err);
            res.status(500).json({
                status: 'error',
                message: 'Error while updating the product'
            });
        }
    }
}
module.exports = {
    createOrderdetail,getOrderdetails,getOrderdetail,deleteOrderdetail,updateOrderdetail
};