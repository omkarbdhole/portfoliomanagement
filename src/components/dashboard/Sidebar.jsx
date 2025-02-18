import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
} from '@mui/material'
import {
  Person,
  Code,
  Work,
  Assignment,
  School,
  Logout,
} from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'

const Sidebar = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const menuItems = [
    { text: 'Bio', icon: <Person />, path: '/dashboard' },
    { text: 'Skills', icon: <Code />, path: '/dashboard/skills' },
    { text: 'Experience', icon: <Work />, path: '/dashboard/experience' },
    { text: 'Projects', icon: <Assignment />, path: '/dashboard/projects' },
    { text: 'Education', icon: <School />, path: '/dashboard/education' },
  ]

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Portfolio CMS
          </Typography>
          <IconButton
            color="inherit"
            onClick={handleLogout}
            sx={{ marginLeft: 'auto' }}
          >
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            marginTop: '64px',
          },
        }}
      >
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  )
}

export default Sidebar