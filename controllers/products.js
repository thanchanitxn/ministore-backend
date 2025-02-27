const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

//insert a new product
const createProduct = async (req, res) => {
    const {product_id, name, description, price, category, image_url} = req.body;
    try{
        const cust = await prisma.products.create({
            data: {
                product_id,
                name,
                description,
                price,
                category,
                image_url
            }
        });
        res.status(200).json({
            status: 'ok',
            message:`Product with id ${cust.product_id} is created successfully`
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
const getProducts = async (req, res) => {
    const custs = await prisma.products.findMany();
    res.json(custs);
}
//get  one product by id
const getProduct = async (req, res) => {
    const {id} = req.params;
    try{
        const cust = await prisma.products.findUnique({
            where: {
                product_id: Number (id)
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
const deleteProduct = async (req, res) => {
    const {id} = req.params;
    try{
        const existingProduct = await prisma.products.findUnique({
            where: {
                product_id: Number(id)
            }
        });
        if(!existingProduct){
            res.status(404).json({message: 'Product not found'});
        }
        await prisma.products.delete({
            where: {
                product_id: Number(id)
            }
        });
        res.status(200).json({status: 'ok', message: `product with id ${id} is deleted successfully`});
    }catch(err){
        console.error('Delete product error:', err);

    }
}

//update a customer by id
const updateProduct = async (req, res) => {
    const {product_id, name, description, price, category, image_url} = req.body;
    const {id} = req.params;
    const data = {};
    if (product_id) data.product_id = product_id;
    if (name) data.name = name;
    if (description) data.description = description;
    if (price) data.price = price;
    if (category) data.category = category;
    if (image_url) data.image_url = image_url;

    if (Object.keys(data).length === 0){
        res.status(400).json({status: 'error' ,message: 'No data to update'});
    }
    try{
        const cust = await prisma.products.update({
            data,
            where: {
                product_id: Number(id)
            }
        });
        res.status(200).json({status: 'ok', message: `Product with id ${cust.product_id} is updated successfully`,product: cust});
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
    createProduct,getProducts,getProduct,deleteProduct,updateProduct
};