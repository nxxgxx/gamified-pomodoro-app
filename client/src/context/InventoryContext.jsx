/*The Inventory Context shares the Inventory State between the Pokemon and Capture Components. It allows the Capture Moment to directly add 
pokemon to the inventory database, and the inventory can immediately update itself from the database while remaining aligned with the client.*/

import { createContext, useContext, useEffect, useState } from "react";
import { fetchGetWithAuth, fetchPostWithAuth } from "../security/fetchWithAuth";

const InventoryContext = createContext();

export function useInventory() {
  return useContext(InventoryContext);
}

export function InventoryProvider({ children }) {
  const [inventory, setInventory] = useState([]);
  const [selectedInventoryId, setSelectedInventoryId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const data = await fetchGetWithAuth(`${process.env.REACT_APP_API_URL}/inventory`)
      setInventory(data.inventory);
      setSelectedInventoryId(data.selected_inventory_id);
    } catch (err) {
      console.error("Failed to fetch inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const addToInventory = (pokemon) => {
    setInventory((prev) => [...prev, pokemon]);
  };

  const selectPokemon = async (inventory_id) => {
    try {
      setLoading(true);
      await fetchPostWithAuth(`${process.env.REACT_APP_API_URL}/inventory/select/${inventory_id}`);
      await fetchInventory(); // Refresh inventory. Automatically sets loading to false
    } catch (err) {
      console.error("Failed to select pokemon:", err);
      setLoading(false);
    }
  };


  return (
    <InventoryContext.Provider value={{ inventory, selectedInventoryId, fetchInventory, addToInventory, selectPokemon, loading }}>
      {children}
    </InventoryContext.Provider>
  );
}
