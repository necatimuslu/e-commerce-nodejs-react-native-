const { Order } = require("../models/order");
const { OrderItem } = require("../models/orderItem");

const router = require("express").Router();

router.get("/", async (req, res) => {
  const orderList = await Order.find({})
    .populate("user", "name")
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    });

  if (!orderList)
    return res
      .status(400)
      .json({ success: false, messsage: "Order list bulunamadı" });

  res.status(200).send(orderList);
});

router.get("/:id", async (req, res) => {
  const getOrderById = await Order.findById(req.params.id)
    .populate("user", "name")
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    });

  if (!getOrderById)
    return res
      .status(400)
      .json({ success: false, messsage: "Order  bulunamadı" });

  res.status(200).send(getOrderById);
});

router.post("/", async (req, res) => {
  const orderItemIds = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        product: orderItem.product,
        quantity: orderItem.quantity,
      });
      newOrderItem = await newOrderItem.save();

      return newOrderItem._id;
    })
  );

  const orderItemIdsResolved = await orderItemIds;

  const totalPrices = Promise.all(
    orderItemIdsResolved.map(async (orderItemId) => {
      const orderItemd = await OrderItem.findById(orderItemId).populate(
        "product",
        "price"
      );
      const totalPrice = orderItemd.product.price * orderItemd.quantity;
      return totalPrice;
    })
  );

  const totalPrice = (await totalPrices).reduce((a, b) => a + b, 0);

  let order = new Order({
    orderItems: orderItemIdsResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    country: req.body.country,
    street: req.body.street,
    apartment: req.body.apartment,
    totalPrice: totalPrice,
    status: req.body.status,
    user: req.body.user,
    zip: req.body.zip,
  });

  order = await order.save();
  console.log(order);
  if (!order)
    return res
      .status(400)
      .json({ success: false, messsage: "Order  oluşturulamadı" });

  res.status(201).send(order);
});

router.put("/:id", async (req, res) => {
  const uploadOrder = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    { new: true }
  );

  if (!uploadOrder)
    return res
      .status(400)
      .json({ success: false, messsage: "Order  güncellenmedi" });

  res.status(200).send(uploadOrder);
});

router.delete("/:id", (req, res) => {
  Order.findByIdAndRemove(req.params.id)
    .then(async (order) => {
      if (order) {
        await order.orderItems.map(async (orderItemId) => {
          await OrderItem.findByIdAndRemove(orderItemId);
        });
        return res
          .status(200)
          .json({ success: true, message: "Order silindi" });
      }
      return res
        .status(400)
        .json({ success: false, message: "Order silinemedi" });
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});
router.get("/get/count", async (req, res) => {
  const count = await Order.countDocuments((count) => count);

  if (!count) return res.status(500).json({ success: false });
  res.status(200).send({ count: count });
});

module.exports = router;
