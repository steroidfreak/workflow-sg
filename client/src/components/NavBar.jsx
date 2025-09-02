import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MenuIcon from '@mui/icons-material/Menu'
import { Link as RouterLink } from 'react-router-dom'

export default function NavBar() {
    const pages = [
        { label: 'Services', to: '/services' },
        { label: 'Demos', to: '/demos' },
        { label: 'About', to: '/about' },
        { label: 'Contact', to: '/contact' }
    ]

    const [anchorEl, setAnchorEl] = React.useState(null)
    const openMenu = (e) => setAnchorEl(e.currentTarget)
    const closeMenu = () => setAnchorEl(null)

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography
                    variant="h6"
                    component={RouterLink}
                    to="/"
                    sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
                >
                    Workflow.sg
                </Typography>

                {/* Desktop links */}
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                    {pages.map((page) => (
                        <Button
                            key={page.to}
                            color="inherit"
                            component={RouterLink}
                            to={page.to}
                            sx={{ textTransform: 'none' }}
                        >
                            {page.label}
                        </Button>
                    ))}
                </Box>

                {/* Mobile menu */}
                <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                    <IconButton color="inherit" onClick={openMenu}>
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={closeMenu}
                        keepMounted
                    >
                        {pages.map((page) => (
                            <MenuItem
                                key={page.to}
                                component={RouterLink}
                                to={page.to}
                                onClick={closeMenu}
                            >
                                {page.label}
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    )
}
