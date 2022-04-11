const router = require("express").Router();
const multer = require("multer");
const { Category } = require("../models/category");
const { Product } = require("../models/product");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("Invalid image type");
    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  const productList = await Product.find({}).populate("category");

  if (!productList)
    return res
      .status(400)
      .json({ success: false, message: "Product list bulunamadı" });
  res.status(200).send(productList);
});

router.get("/:id", async (req, res) => {
  const getProductById = await Product.findById(req.params.id).populate(
    "category"
  );

  if (!getProductById)
    return res
      .status(400)
      .json({ success: false, message: "Product  bulunamadı" });
  res.status(200).send(getProductById);
});

router.post("/", upload.single("image"), async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Invalid category");

  const fileName = req.file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/uploads/`;

  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: `${basePath}${fileName}`,
    price: req.body.price,
    brand: req.body.brand,
    isFeatured: req.body.isFeatured,
    rating: req.body.rating,
    category: req.body.category,
    countInStock: req.body.countInStock,
  });

  product = await product.save();

  if (!product)
    return res
      .status(500)
      .json({ success: false, message: "Product  oluşturulamadı" });
  res.status(201).send(product);
});

router.put("/:id", upload.single("image"), async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Invalid category");

  const product = await Product.findById(req.params.id);
  if (!product) return res.status(400).send("Invalid product Id");

  const file = req.file;
  let imagePath;

  if (req.file) {
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/uploads/`;
    imagePath = `${basePath}${fileName}`;
  } else {
    imagePath = product.image;
  }

  let updateProduct = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: imagePath,
      price: req.body.price,
      brand: req.body.brand,
      isFeatured: req.body.isFeatured,
      rating: req.body.rating,
      category: req.body.category,
      countInStock: req.body.countInStock,
    },
    { new: true }
  );

  if (!updateProduct)
    return res
      .status(500)
      .json({ success: false, message: "Product  güncellenemedi" });
  res.status(200).send(updateProduct);
});

router.delete("/:id", (req, res) => {
  Product.findByIdAndRemove(req.params.id)
    .then((product) => {
      if (product)
        return res
          .status(200)
          .json({ success: true, message: "Product silindi" });
      else
        return res
          .status(400)
          .json({ success: false, message: "Product silinemedi" });
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

router.put("/gallery-images/:id", upload.any("image"), async (req, res) => {
  let uploadImage = await Product.findByIdAndUpdate(
    req.params.id,
    {
      images: imagePaths,
    },
    { new: true }
  );

  if (!uploadImage)
    return res
      .status(500)
      .json({ success: false, message: "Image  güncellenemedi" });
  res.status(200).send(uploadImage);
});

router.get("/get/count", async (req, res) => {
  const count = await Product.countDocuments((count) => count);

  if (!count) return res.status(400).json({ success: false });

  res.status(200).send({ count: count });
});

router.get("/get/featured/:count", async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  const featured = await Product.find({ isFeatured: true }).limit(count);

  if (!featured) return res.status(400).json({ success: false });
  res.status(200).send(featured);
});

module.exports = router;
