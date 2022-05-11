import express, { json } from "express";
import cart from "../cartDatabase";
import CartItem from "../models/CartItem";

const cartRouter = express.Router();

let nextID = 790;

// build routes
cartRouter.get("/", (req, res) => {
  const { maxPrice, prefix, pageSize } = req.query;
  let filteredArray: CartItem[] = cart;
  if (maxPrice) {
    filteredArray = filteredArray.filter((item) => {
      return item.price <= +maxPrice;
    });
  }
  if (prefix) {
    filteredArray = filteredArray.filter((item) => {
      return item.product
        .toLowerCase()
        .startsWith((prefix as string).toLowerCase());
    });
  }
  if (pageSize) {
    filteredArray = filteredArray.slice(0, +pageSize);
  }
  res.status(200).json(filteredArray);
});

cartRouter.get("/:id", (req, res) => {
  const id: number = +req.params.id;
  const foundItem: CartItem | undefined = cart.find((item) => {
    return item.id === id;
  });
  if (foundItem) {
    res.status(200).json(foundItem);
  } else {
    res.status(404).json({ message: `ID Not Found` });
  }
});

cartRouter.post("/", (req, res) => {
  const newItem: CartItem = req.body;
  newItem.id = nextID++;
  cart.push(newItem);
  res.status(201).json(newItem);
});

cartRouter.put("/:id", (req, res) => {
  const id: number = +req.params.id;
  const updatedItem: CartItem = req.body;
  const index: number = cart.findIndex((item) => {
    return item.id === id;
  });
  if (index >= 0) {
    cart[index] = updatedItem;
    res.status(200).json(updatedItem);
  } else {
    res.status(404).json({ message: `ID Not Found` });
  }
});

cartRouter.delete("/:id", (req, res) => {
  const id: number = +req.params.id;
  const index: number = cart.findIndex((item) => {
    return (item.id = id);
  });
  if (index !== -1) {
    cart.splice(index, 1);
    res.sendStatus(204);
  } else {
    res.status(404).json({ message: `ID Not Found` });
  }
});

// export
export default cartRouter;
