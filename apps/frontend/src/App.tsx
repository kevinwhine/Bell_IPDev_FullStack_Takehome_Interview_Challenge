import { useEffect, useState } from 'react';
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { Product, ProductType, ProductId } from './types/product.tyes';
import { Alert, FormControl, InputLabel, MenuItem, Select, Card, CardContent, CardActions, Button } from '@mui/material';
import Grid from '@mui/material/Grid';


const API_BASE_URL = 'http://localhost:3000/api';

function App() {
  const [storeName, setStoreName] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlistIds, setWishlistIds] = useState<Set<number>>(new Set());
  const [filterType, setFilterType] = useState<ProductType | 'All'>('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cannot implement a Suspense based approach unless we create a wrapper and not use useEffect/fetch.  For time constraints using useEffect/fetch
  useEffect(() => {
    console.log('useEffect: ENTERED');

    // Configure an AbortController to cancel fetch requests if the component unmounts
    const controller = new AbortController();
    const { signal } = controller;

    const fetchData = async () => {
      try {
          // No timeout based on the requirements, but we could implement one by using setTimeout to call controller.abort() after a certain duration.
          const [storeRes, productsRes] = await Promise.all([
            fetch(`${API_BASE_URL}/store-name`, { signal }),
            fetch(`${API_BASE_URL}/products`, { signal }),
          ]);
          if (!storeRes.ok || !productsRes.ok) {
            throw new Error('Failed to load data');
          }
          // Could impllement Zod schema validation here to ensure the API responses match our expected types, but for simplicity we'll assume they do.
          const storeJson = await storeRes.json();
          const productsJson = await productsRes.json();
          setStoreName(storeJson.name);
          setProducts(productsJson);
      } catch (e) {
        // WARN: Strict Mode aborts the first fetch — ignore it
        if ((e as Error).name === 'AbortError') {
          console.log('Fetch aborted (Strict Mode double-mount)');
          return;
        }

        // Any *real* error still shows
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // Send back a cleanup function to abort fetch requests if the component unmounts before they complete.
    return  () => {

      if (loading) {
        console.log('Cleaning up fetch request');
        controller.abort()
      }
    };
  },
  [loading]);


  const handleAddToWishlist = async (id: ProductId) => {
    try {
      setError(null);
      const res = await fetch(`${API_BASE_URL}/wishlist/${id}`, { method: 'POST' });
      if (res.status === 409) {
        setError('Item is already in your wishlist.');
        return;
      }
      if (!res.ok) {
        throw new Error('Failed to add to wishlist');
      }
      setWishlistIds(prev => new Set(prev).add(id));
    } catch (e) {
      setError((e as Error).message);
    }
  };


  const filteredProducts = products.filter(p => {
    if (filterType !== 'All' && p.type !== filterType) return false;
    return true;
  });

return (
  <>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">{storeName || 'Product Catalog'}</Typography>
      </Toolbar>
    </AppBar>
    <Container sx={{ mt: 4 }}>
      {error && <Alert severity="error">{error}</Alert>}

      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <FormControl size="small">
          <InputLabel id="type-filter-label">Type</InputLabel>
          <Select
            labelId="type-filter-label"
            label="Type"
            value={filterType}
            onChange={e => setFilterType(e.target.value as ProductType | 'All')}
          >
            {/* Need to Localise */}
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Books">Books</MenuItem>
            <MenuItem value="Electronics">Electronics</MenuItem>
            <MenuItem value="Clothing">Clothing</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {
      // Ok for production but may want want to implement pagination or infinite scrolling here instead of rendering all products at once, but for simplicity we'll render them all.
      // useTransition could be used here to keep the UI responsive while rendering a large number of products, but we'll assume the product list is small enough that this isn't necessary.
      // Suspense and React.lazy could be used to code-split the product cards if they were more complex, but for simplicity we'll keep them in the main bundle.
      }
      {loading ? (
        <Typography>Loading products…</Typography>
      ) : (
        // Better to build a separate ProductCard component for each product, but for simplicity we'll just render them inline here.
        <Grid container columns={12} spacing={2}>
          {filteredProducts.map(product => {
            const inWishlist = wishlistIds.has(product.id);
            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{product.name}</Typography>
                    <Typography color="text.secondary">{product.type}</Typography>
                    <Typography>£{product.price.toFixed(2)}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      variant="contained"
                      disabled={inWishlist}
                      onClick={() => handleAddToWishlist(product.id)}
                    >
                      {/* Need to Localise */}
                      {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  </>
);
}

export default App;
