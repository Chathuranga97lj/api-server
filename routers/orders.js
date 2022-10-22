const {Order} = require('../models/order');
const express = require('express');
const {OrderItem} = require('../models/order-item');
const router = express.Router();

// get order list
router.get(`/`, async (req, res) => {
    // use populate to get inside deatils of db, 
    // sorting :-1 means sort by new to old
    const orderList = await Order.find().populate('user', 'name').sort({'dateOrdered':-1});

    if(!orderList) {
        res.status(500).json({success: false})
    }
    res.send(orderList);
})

// get one order
router.get(`/:id`, async (req, res) => {
    // use populate to get inside deatils of db, 
    // sorting :-1 means sort by new to old
    const order = await Order.findById(req.params.id)
        .populate('user', 'name').sort({'dateOrdered':-1})
        .populate({
            path: 'orderItems', populate:{
                path: 'product', populate: 'category'}
        });

    if(!order) {
        res.status(500).json({success: false})
    }
    res.send(order);
})

// place a order
router.post('/', async (req, res) => {
    const orderItemsIds = Promise.all(req.body.orderItems.map(async (orderItem) =>{
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
    }))
    const orderItemsIdsResolved =  await orderItemsIds;
    //console.log(orderItemsIdsResolved); 

    let order = new Order({
        orderItems: orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: req.body.totalPrice,
        user: req.body.user,
    })
    order = await order.save();

    if(!order) 
        return res.status(400).send('The order cannot be created !');
    
    res.send(order);
})

// update orders
router.put('/:id', async (req, res) => {
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
            status: req.body.status
        },
        {new: true} // for get updated data, else it returns old data after put request
    )
    if(!order) 
        return res.status(404).send('The order cannot be created !');
    
    res.send(order);
})

// delete order
router.delete('/:id', (req, res) => {
    Order.findByIdAndRemove(req.params.id).then(async order => {
        if(order) {
            await order.orderItems.map(async orderItem => {
                await OrderItem.findByIdAndRemove(orderItem);
            })
            return res.status(200).json({success: true, message: 'The order was deleted !'})
        } else {
            return res.status(404).json({success: false, message: 'The order is not funded !'})
        }
    }).catch(err => {
        return res.status(500).json({success: false, error: err})
    })
})

module.exports = router;