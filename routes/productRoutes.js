import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// CREATE PRODUCT
router.post("/", async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

// READ ALL PRODUCTS WITH FILTERING, SORTING, PAGINATION
router.get("/", async (req, res) => {
  try {
    const { category, minPrice, maxPrice, sortBy, page = 1, limit = 10 } = req.query;

    const query = {};

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};

      if (minPrice) {
        query.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
      }
    }

    // Sorting
    let sortOption = {};
    if (sortBy === "price_asc") {
      sortOption.price = 1;
    } else if (sortBy === "price_desc") {
      sortOption.price = -1;
    }

    // Pagination
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber);

    res.json(products);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// READ 
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// UPDATE 
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

// DELETE 
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    res.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

export default router;