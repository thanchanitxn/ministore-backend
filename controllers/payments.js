const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

//insert a new payment
const createPayment = async (req, res) => {
    const {order_id,payment_method, payment_date, amount, remark,payment_status} = req.body;
    try{
        const cust = await prisma.payments.create({
            data: {
                order_id,
                payment_method,
                payment_date: new Date(payment_date),
                amount,
                remark,
                payment_status
            }
        });
        res.status(200).json({
            status: 'ok',
            message:`Product with id ${cust.payment_id} is created successfully`
        });

    }catch (err){
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong',
            error: err.message
        });
    }
};

//get all payments
const getPayments = async (req, res) => {
    const custs = await prisma.payments.findMany();
    res.json(custs);
}
//get  one payment by id
const getPayment = async (req, res) => {
    const {id} = req.params;
    try{
        const cust = await prisma.payments.findUnique({
            where: {
                payment_id: Number (id)
            }
        });
        if(!cust){res.status(404).json({message: 'Product not found'});
    }else{
        res.status(200).json(cust);}
    }catch(err){
        res.status(500).json(err)
    }
}

//delete a payment by id
const deletePayment = async (req, res) => {
    const {id} = req.params;
    try{
        const existingPayment = await prisma.payments.findUnique({
            where: {
               payment_id: Number(id)
            }
        });
        if(!existingPayment){
            res.status(404).json({message: 'Product not found'});
        }
        await prisma.payments.delete({
            where: {
               payment_id: Number(id)
            }
        });
        res.status(200).json({status: 'ok', message: `product with id ${id} is deleted successfully`});
    }catch(err){
        console.error('Delete product error:', err);

    }
}

//update a payment by id
const updatePayment = async (req, res) => {
    const {order_id,payment_method, payment_date, amount, remark,payment_status} = req.body;
    const {id} = req.params;
    const data = {};
    if (order_id) data.order_id = order_id;
    if (payment_method) data.payment_method = payment_method;
    if (payment_date) data.payment_date = new Date(payment_date);
    if (amount) data.amount = amount;
    if (remark) data.remark = remark;
    if (payment_status) data.payment_status = payment_status;

    if (Object.keys(data).length === 0){
        res.status(400).json({status: 'error' ,message: 'No data to update'});
    }
    try{
        const cust = await prisma.payments.update({
            data,
            where: {
                payment_id: Number(id)
            }
        });
        res.status(200).json({status: 'ok', message: `Product with id ${cust.payment_id} is updated successfully`,payment: cust});
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
    createPayment,getPayments,getPayment,deletePayment,updatePayment
};