const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

//insert a new customer
const createCustomer = async (req, res) => {
    const { first_name, last_name, address, email, phone_number} = req.body;
    try{
        const cust = await prisma.customers.create({
            data: {
                first_name,
                last_name,
                address,
                email,
                phone_number
            }
        });
        res.status(200).json({
            status: 'ok',
            message:`User with id ${cust.customer_id} is created successfully`
        });

    }catch (err){
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong',
            error: err.message
        });
    }
};

//get all customers
const getCustomers = async (req, res) => {
    const custs = await prisma.customers.findMany();
    res.json(custs);
}
//get  one customer by id
const getCustomer = async (req, res) => {
    const {id} = req.params;
    try{
        const cust = await prisma.customers.findUnique({
            where: {
                customer_id: Number (id)
            }
        });
        if(!cust){res.status(404).json({message: 'Customer not found'});
    }else{
        res.status(200).json(cust);}
    }catch(err){
        res.status(500).json(err)
    }
}

//delete a customer by id
const deleteCustomer = async (req, res) => {
    const {id} = req.params;
    try{
        const existingCustomer = await prisma.customers.findUnique({
            where: {
                customer_id: Number(id)
            }
        });
        if(!existingCustomer){
            res.status(404).json({message: 'Customer not found'});
        }
        await prisma.customers.delete({
            where: {
                customer_id: Number(id)
            }
        });
        res.status(200).json({status: 'ok', message: `Customer with id ${id} is deleted successfully`});
    }catch(err){
        console.error('Delete customer error:', err);

    }
}

//update a customer by id
const updateCustomer = async (req, res) => {
    const {first_name, last_name, address, email, phone_number} = req.body;
    const {id} = req.params;
    const data = {};
    if(first_name) data.first_name = first_name;
    if(last_name) data.last_name = last_name;
    if(address) data.address = address;
    if(email) data.email = email;
    if(phone_number) data.phone_number = phone_number;

    if (Object.keys(data).length === 0){
        res.status(400).json({status: 'error' ,message: 'No data to update'});
    }
    try{
        const cust = await prisma.customers.update({
            data,
            where: {
                customer_id: Number(id)
            }
        });
        res.status(200).json({status: 'ok', message: `Customer with id ${cust.customer_id} is updated successfully`,user: cust});
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
    createCustomer,getCustomers,getCustomer,deleteCustomer,updateCustomer
};