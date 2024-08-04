'use client'

import { useState, useEffect } from 'react'
import {
  AppBar,
  Box,
  Stack,
  Typography,
  Button,
  Modal,
  TextField,
  Card,
  CardContent,
  CardActions,
  Paper,
  Toolbar,
  Container,
} from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { firestore } from '@/firebase'
import '@fontsource/roboto-mono'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

const theme = createTheme({
  typography: {
    fontFamily: 'Roboto Mono, sans-serif',
  },
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
})

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [filteredInventory, setFilteredInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
    setFilteredInventory(inventoryList) // Initialize filtered inventory
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  useEffect(() => {
    updateInventory()
  }, [])

  useEffect(() => {
    // Filter inventory based on search query
    if (searchQuery.trim() === '') {
      setFilteredInventory(inventory)
    } else {
      setFilteredInventory(inventory.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      ))
    }
  }, [searchQuery, inventory])

  return (
    <ThemeProvider theme={theme}>
      {/* Navbar */}
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box
              component="img"
              sx={{
                height: 40,
                mr: 2,
              }}
              alt="PantryPal Logo"
              src="/images/iconwhite.png" // Path to the white icon image
            />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              PantryPal
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>

      <Box
        width="100vw"
        minHeight="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        bgcolor="background.default"
        p={3}
      >
        {/* Modal for Adding Items */}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add Item
            </Typography>
            <Stack width="100%" direction="row" spacing={2}>
              <TextField
                id="outlined-basic"
                label="Item"
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  addItem(itemName)
                  setItemName('')
                  handleClose()
                }}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>

        {/* Search Input */}
        <TextField
          id="search"
          label="Search Inventory"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 3, maxWidth: 800 }}
        />

        {/* Inventory Tracker Header */}
        <Paper elevation={3} sx={{ width: '100%', maxWidth: 800, p: 2, mb: 3 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="relative"
            mb={2} // Margin bottom to separate from the button
          >
            <Box
              component="img"
              sx={{
                height: 150, // Size of the logo
                mr: 2,       // Margin-right to adjust spacing between logo and text
              }}
              alt="PantryPal Logo"
              src="/images/iconblue.png" // Path to the blue icon image
            />
            <Typography variant="h2" fontWeight={700} color="primary">
              PantryPal
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            sx={{ display: 'block', margin: '0 auto' }} // Centering the button
            onClick={handleOpen}
          >
            Add New Item
          </Button>
        </Paper>

        {/* Inventory List */}
        <Stack spacing={2} width="100%" maxWidth={800}>
          {filteredInventory.map(({ name, quantity }) => (
            <Card key={name} sx={{ bgcolor: '#ffffff', borderRadius: '8px' }}>
              <CardContent>
                <Typography variant="h5" fontWeight={700} color="text.primary">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Quantity: {quantity}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="secondary" onClick={() => removeItem(name)}>
                  Remove
                </Button>
              </CardActions>
            </Card>
          ))}
        </Stack>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) => theme.palette.primary.main,
          width: '100%',
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="body1" color="white" align="center">
            © {new Date().getFullYear()} PantryPal. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </ThemeProvider>
  )
}
