import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

// Add To Cart
export const addToCart = async (item, uid) => {
  await addDoc(collection(db, "cart"), {
    ...item,
    uid,
    quantity: 1,
  });
};

// Get Cart Items
export const getCartItems = async (uid) => {
  const q = query(collection(db, "cart"), where("uid", "==", uid));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Delete Cart Item
export const deleteCartItem = async (id) => {
  await deleteDoc(doc(db, "cart", id));
};

// Increase Quantity
export const increaseQuantity = async (id, quantity) => {
  await updateDoc(doc(db, "cart", id), {
    quantity: quantity + 1,
  });
};

// Decrease Quantity
export const decreaseQuantity = async (id, quantity) => {
  if (quantity <= 1) return;

  await updateDoc(doc(db, "cart", id), {
    quantity: quantity - 1,
  });
};
