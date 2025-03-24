const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

//insert a new user
const createUser = async (req, res) => {
    const { UserName, Password, Status, Role} = req.body;
    try{
        const cust = await prisma.users.create({
            data: {
                UserName,
                Password,
                Status,
                Role
            }
        });
        res.status(200).json({
            status: 'ok',
            message:`User with id ${cust.UserID} is created successfully`
        });

    }catch (err){
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong',
            error: err.message
        });
    }
};

//get all users
const getUsers = async (req, res) => {
    const custs = await prisma.users.findMany();
    res.json(custs);
}
//get  user by id
const getUser = async (req, res) => {
    const {id} = req.params;
    try{
        const cust = await prisma.users.findUnique({
            where: {
                UserID: Number (id)
            }
        });
        if(!cust){res.status(404).json({message: 'Customer not found'});
    }else{
        res.status(200).json(cust);}
    }catch(err){
        res.status(500).json(err)
    }
}

//delete a user by id
const deleteUser = async (req, res) => {
    const {id} = req.params;
    try{
        const existingCustomer = await prisma.users.findUnique({
            where: {
                UserID: Number(id)
            }
        });
        if(!existingCustomer){
            res.status(404).json({message: 'Customer not found'});
        }
        await prisma.users.delete({
            where: {
                UserID: Number(id)
            }
        });
        res.status(200).json({status: 'ok', message: `Customer with id ${id} is deleted successfully`});
    }catch(err){
        console.error('Delete customer error:', err);

    }
}

//update a user by id
const updateUser = async (req, res) => {
    const { UserName, Password, Status, Role} = req.body;
    const {id} = req.params;
    const data = {};
    if (UserName) data.UserName = UserName;
    if (Password) data.Password = Password;
    if (Status) data.Status = Status;
    if (Role) data.Role = Role;

    if (Object.keys(data).length === 0){
        res.status(400).json({status: 'error' ,message: 'No data to update'});
    }
    try{
        const cust = await prisma.users.update({
            data,
            where: {
                UserID: Number(id)
            }
        });
        res.status(200).json({status: 'ok', message: `Customer with id ${cust.UserID} is updated successfully`,user: cust});
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
    createUser,getUsers,getUser,deleteUser,updateUser
};