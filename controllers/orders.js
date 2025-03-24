const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

//insert a new order
const createOrder = async (req, res) => {
    const { order_id, customer_id, order_date, order_status, total_amount} = req.body;
    try{
        const cust = await prisma.orders.create({
            data: {
                order_id,
                customer_id,
                order_date: new Date(order_date), //ปรับวันที่ตอน insert
                order_status,
                total_amount
            }
        });
        res.status(200).json({
            status: 'ok',
            message:`User with id ${cust.order_id} is created successfully`
        });

    }catch (err){
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong',
            error: err.message
        });
    }
};

//get all orders
const getOrders = async (req, res) => {
    const custs = await prisma.orders.findMany();
    res.json(custs);
}
//get  one order by id
const getOrder = async (req, res) => {
    const {id} = req.params;
    try{
        const cust = await prisma.orders.findUnique({
            where: {
                order_id: Number (id)
            }
        });
        if(!cust){res.status(404).json({message: 'Customer not found'});
    }else{
        res.status(200).json(cust);}
    }catch(err){
        res.status(500).json(err)
    }
}

//delete a order by id
const deleteOrder = async (req, res) => {
    const {id} = req.params;
    try{
        const existingOrder = await prisma.orders.findUnique({
            where: {
                order_id: Number(id)
            }
        });
        if(!existingOrder){
            res.status(404).json({message: 'Customer not found'});
        }
        await prisma.orders.delete({
            where: {
                order_id: Number(id)
            }
        });
        res.status(200).json({status: 'ok', message: `Customer with id ${id} is deleted successfully`});
    }catch(err){
        console.error('Delete customer error:', err);

    }
}

//update order by id
const updateOrder = async (req, res) => {
    const {order_id, customer_id, order_date, order_status, total_amount} = req.body;
    const {id} = req.params;
    const data = {};
    if (order_id) data.order_id = order_id;
    if (customer_id) data.customer_id = customer_id;
    if (order_date) data.order_date = new Date(order_date); //ปรับวันที่ตอน update
    if (order_status) data.order_status = order_status;
    if (total_amount) data.total_amount = total_amount;

    if (Object.keys(data).length === 0){
        res.status(400).json({status: 'error' ,message: 'No data to update'});
    }
    try{
        const cust = await prisma.orders.update({
            data,
            where: {
                order_id: Number(id)
            }
        });
        res.status(200).json({status: 'ok', message: `Customer with id ${cust.order_id} is updated successfully`,order: cust});
    }catch(err){
        if (err.code == 'P2002') {
            res.status(404).json({
                status: 'error',
                message: 'Email already exists'
            });
        } else if (err.code == 'P2025') {
            res.status(404).json({
                status: 'error',
                message: `Customer with id ${id} not found`
            });
        } else {
            console.error('Update customer error:', err);
            res.status(500).json({
                status: 'error',
                message: 'Error while updating the customer'
            });
        }
    }
}
module.exports = {
    createOrder,getOrders,getOrder,deleteOrder,updateOrder
};