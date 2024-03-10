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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
  Box,
} from "@mui/material";
import ProductList from "../src/products.json";
import categories from "../src/categories.json";
import subcategories from "../src/subCategories.json";

function App() {
  const [category, setCategory] = useState("");
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    setCategory(selectedCategory);
    const firstSubcategory = subcategories.find(
      (subcat) => subcat.category === selectedCategory
    );
    setSubcategory(firstSubcategory ? firstSubcategory.subCat : "");
  };

  const handleSubcategoryChange = (event) => {
    setSubcategory(event.target.value);
  };

  const handleSave = () => {
    console.log("Edited Prices:", editedPrices);
    // You can send the edited prices to an API endpoint or perform any other action here
  };

  const handlePriceChange = (productId, price) => {
    setEditedPrices((prevState) => ({
      ...prevState,
      [productId]: price,
    }));
  };

  return (
    <Box style={{ margin: "20px" }}>
      <Stack direction="row" spacing={2} style={{ marginTop: "100px" }}>
        <FormControl style={{ marginBottom: "16px", width: "200px" }}>
          <InputLabel>Category</InputLabel>
          <Select value={category} onChange={handleCategoryChange}>
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {category && (
          <FormControl style={{ marginBottom: "16px", width: "200px" }}>
            <InputLabel>Subcategory</InputLabel>
            <Select value={subcategory} onChange={handleSubcategoryChange}>
              <MenuItem value="">All Subcategories</MenuItem>
              {subcategories
                .filter((subcat) => subcat.category === category)
                .map((subcat) => (
                  <MenuItem key={subcat.subCat} value={subcat.subCat}>
                    {subcat.subCat}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        )}
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead style={{ backgroundColor: "#f0f0f0" }}>
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
                <TableRow key={product.id}>
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
