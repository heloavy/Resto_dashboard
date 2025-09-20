import express from 'express';
import { supabase } from '../supabaseClient.js';

const router = express.Router();

// Get all menu items
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('menu').select('*');
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
});

// Get a single menu item by ID
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('menu')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  if (!data) {
    return res.status(404).json({ error: 'Menu item not found' });
  }
  res.json(data);
});

// Create a new menu item
router.post('/', async (req, res) => {
  const { name, description, price, category } = req.body;
  const { data, error } = await supabase
    .from('menu')
    .insert([{ name, description, price, category }])
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(201).json(data);
});

// Update a menu item
router.put('/:id', async (req, res) => {
  const { name, description, price, category } = req.body;
  const { data, error } = await supabase
    .from('menu')
    .update({ name, description, price, category })
    .eq('id', req.params.id)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
});

// Delete a menu item
router.delete('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('menu')
    .delete()
    .eq('id', req.params.id)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(204).send();
});

export default router;
