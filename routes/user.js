const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { User } = require("../models/user");
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
  const userList = await User.find({});

  if (!userList)
    return res
      .status(400)
      .json({ success: false, message: "User list bulunamadı" });

  res.status(200).send(userList);
});

router.get("/:id", async (req, res) => {
  const getUserById = await User.findById(req.params.id);

  if (!getUserById)
    return res
      .status(400)
      .json({ success: false, message: "User  bulunamadı" });

  res.status(200).send(getUserById);
});

router.post("/register", async (req, res) => {
  let user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    apartment: req.body.apartment,
    city: req.body.city,
    country: req.body.country,
    zip: req.body.zip,
    phone: req.body.phone,
    street: req.body.street,
    isAdmin: req.body.isAdmin,
  });

  user = await user.save();

  if (!user)
    return res
      .status(500)
      .json({ success: false, message: "User  oluşturlamadı" });

  res.status(201).send(user);
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user)
    return res.status(400).json({ success: false, message: "User bulunamadı" });

  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    const token = jwt.sign(
      {
        userId: user._id,
        isAdmin: user.isAdmin,
      },
      "deneme",
      { expiresIn: "1d" }
    );
    return res.status(200).json({ email: user.email, token: token });
  }
  return res.status(500).json({ success: false, message: "Password is wrong" });
});

router.put("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(400).send("Invalid user Id");

  let newPassword;
  if (req.body.password) {
    newPassword = bcrypt.hashSync(req.body.password, 10);
  } else {
    newPassword = user.password;
  }

  const updateUser = await User.findById(
    req.params.id,
    {
      username: req.body.username,
      email: req.body.email,
      password: newPassword,
      apartment: req.body.apartment,
      city: req.body.city,
      country: req.body.country,
      zip: req.body.zip,
      phone: req.body.phone,
      street: req.body.street,
      isAdmin: req.body.isAdmin,
    },
    { new: true }
  );

  if (!updateUser)
    return res
      .status(500)
      .json({ success: false, message: "User  güncellenmedi" });

  res.status(201).send(updateUser);
});

router.delete("/:id", (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then((user) => {
      if (user)
        return res.status(200).json({ success: true, message: "User silindi" });
      else
        return res
          .status(400)
          .json({ success: false, message: "User silinemedi" });
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

router.get("/get/count", async (req, res) => {
  const count = await User.countDocuments((count) => count);

  if (!count) return res.status(400).json({ success: false });
  res.status(200).send({ count: count });
});

module.exports = router;
