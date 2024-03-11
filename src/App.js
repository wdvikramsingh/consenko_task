import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Button,
  Stack,
  Box,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import ProductList from "../src/products.json";
import categories from "../src/categories.json";
import subcategories from "../src/subCategories.json";

function App() {
  const [category, setCategory] = useState("smartphones");
  const [subcategory, setSubcategory] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editedPrices, setEditedPrices] = useState({});
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Initialize editedPrices with initial product prices
    const initialPrices = {};
    ProductList.products.forEach((product) => {
      initialPrices[product.id] = product.price;
    });
    setEditedPrices(initialPrices);

    // Filter products based on category and subcategory
    let filteredProducts = ProductList.products;
    if (category && subcategory) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.category === category && product.brand === subcategory
      );
    } else if (category) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === category
      );
    }
    setProducts(filteredProducts);
  }, [category, subcategory]);

  useEffect(() => {
    // Select the first subcategory when a category is chosen
    if (category) {
      const defaultSubcategory = getDefaultSubcategory(category);
      setSubcategory(defaultSubcategory);
    }
  }, [category]);

  const getDefaultSubcategory = (selectedCategory) => {
    const categorySubcategories = subcategories.filter(
      (subcat) => subcat.category === selectedCategory
    );
    return categorySubcategories.length > 0
      ? categorySubcategories[0].subCat
      : "";
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCategoryChange = (event, newCategory) => {
    setCategory(newCategory);
  };

  const handleSubcategoryChange = (event, newSubcategory) => {
    setSubcategory(newSubcategory);
  };

  const handleSave = () => {
    console.log("Edited Prices:", editedPrices);
  };

  const handlePriceChange = (productId, price) => {
    setEditedPrices((prevState) => ({
      ...prevState,
      [productId]: price,
    }));
  };

  return (
    <Box
      boxShadow={2}
      m={1}
      p={5}
      style={{ marginTop: "20px", borderRadius: "10px" }}
    >
      <Stack
        direction="row"
        spacing={6}
        alignItems={"center"}
        sx={{ marginTop: "20px", marginBottom: "20px" }}
      >
        <Typography>Categories</Typography>
        <Tabs
          value={category}
          onChange={handleCategoryChange}
          aria-label="Category tabs"
          sx={{ background: "#dbe4f6" }}
        >
          <Tab label="All Categories" value="" />
          {categories.map((categoryItem) => (
            <Tab key={categoryItem} label={categoryItem} value={categoryItem} />
          ))}
        </Tabs>
      </Stack>
      {category && (
        <Stack
          direction="row"
          spacing={2}
          alignItems={"center"}
          sx={{ marginTop: "20px", marginBottom: "20px" }}
        >
          <Typography>Sub Categories</Typography>
          <Tabs
            value={subcategory}
            onChange={handleSubcategoryChange}
            aria-label="Subcategory tabs"
            sx={{ background: "#dbe4f6" }}
          >
            {subcategories
              .filter((subcat) => subcat.category === category)
              .map((subcat) => (
                <Tab
                  key={subcat.subCat}
                  label={subcat.subCat}
                  value={subcat.subCat}
                />
              ))}
          </Tabs>
        </Stack>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead style={{ backgroundColor: "#4a72d6", color: "#fff" }}>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((product) => (
                <TableRow key={product.id} className="tableRow">
                  <TableCell>{product.title}</TableCell>
                  <TableCell>
                    <input
                      type="number"
                      value={editedPrices[product.id]}
                      onChange={(e) =>
                        handlePriceChange(product.id, e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell>{product.discountPercentage}%</TableCell>
                  <TableCell>{product.rating}</TableCell>
                  <TableCell>{product.description}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={products.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
      <Stack
        direction="row"
        spacing={2}
        justifyContent={"end"}
        style={{ marginTop: "10px" }}
      >
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
      </Stack>
    </Box>
  );
}

export default App;
