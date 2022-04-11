const { Category } = require("../models/category");

const router = require("express").Router();

router.get("/", async (req, res) => {
  const categoryList = await Category.find({});

  if (!categoryList)
    return res
      .status(400)
      .json({ success: false, message: "Category list bulunamadu" });

  res.status(200).send(categoryList);
});

router.get("/:id", async (req, res) => {
  const getByCategoryId = await Category.findById(req.params.id);

  if (!getByCategoryId)
    return res
      .status(400)
      .json({ success: false, message: "Category list bulunamadu" });

  res.status(200).send(getByCategoryId);
});

router.post("/", async (req, res) => {
  let category = new Category({
    name: req.body.name,
    color: req.body.color,
    icon: req.body.icon,
    image: req.body.image,
  });
  category = await category.save();

  if (!category)
    return res
      .status(400)
      .json({ success: false, message: "Category oluşturulmadı" });

  res.status(201).send(category);
});

router.put("/:id", async (req, res) => {
  let updateCategory = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      color: req.body.color,
      icon: req.body.icon,
      image: req.body.image,
    },
    { new: true }
  );

  if (!updateCategory)
    return res
      .status(400)
      .json({ success: false, message: "Category güncellenemedi" });

  res.status(200).send(updateCategory);
});

router.delete("/:id", (req, res) => {
  Category.findByIdAndRemove(req.params.id)
    .then((category) => {
      if (category)
        return res
          .status(200)
          .json({ success: true, message: "Category silindi" });
      else
        return res
          .status(400)
          .json({ success: false, message: "Category silinemedi" });
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

router.get("/get/count", async (req, res) => {
  const count = await Category.countDocuments((count) => count);

  if (!count) return res.status(400).json({ success: false });

  res.status(200).send({ count: count });
});

module.exports = router;
