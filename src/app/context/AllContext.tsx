"use client";
import { createContext, useContext, ReactNode, useState } from "react";
interface Item {
  id: string;
  // Add other properties as needed
}

// interface ItemsContextType {
//   items: Item[];
//   // addItem: (item: Item) => void;
//   // removeItem: (id: string) => void;
//   // updateItem: (id: string, updatedItem: Partial<Item>) => void;
// }

const ItemsContext = createContext<Item | undefined>(undefined);

export function ItemsProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState("00");

  // setItems({ ...items, id: "sdasd" });
  setItems("fdf");

  // setItems({...item, "dsfdfs"});
  // const addItem = (item: Item) => {
  //   setItems((prevItems) => [...prevItems, item]);
  // };

  // const removeItem = (id: string) => {
  //   setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  // };

  // const updateItem = (id: string, updatedItem: Partial<Item>) => {
  //   setItems((prevItems) =>
  //     prevItems.map((item) =>
  //       item.id === id ? { ...item, ...updatedItem } : item
  //     )
  //   );
  // };

  return (
    <ItemsContext.Provider value={{ items }}>{children}</ItemsContext.Provider>
  );
}
export function useItems() {
  const context = useContext(ItemsContext);
  // if (context === undefined) {
  //   throw new Error("useItems must be used within an ItemsProvider");
  // }
  return context;
}
