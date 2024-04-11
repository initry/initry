"use client";
import * as React from "react";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import "@/app/globals.css";
import { Container, useTheme } from "@mui/system";
import Link from "next/link";
import GitHubIcon from "@mui/icons-material/GitHub";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";

const drawerWidth = 200;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const links = [{ tooltip: "Dashboard", link: "/" }];

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          color="default"
          elevation={0}
          position="fixed"
          open={open}
          sx={{ height: "50px", justifyContent: "center" }}
        >
          <Toolbar>
            {/*<IconButton*/}
            {/*    color="inherit"*/}
            {/*    aria-label="open drawer"*/}
            {/*    onClick={handleDrawerOpen}*/}
            {/*    edge="start"*/}
            {/*    sx={{*/}
            {/*        marginRight: 5,*/}
            {/*        ...(open && {display: 'none'}),*/}
            {/*    }}*/}
            {/*>*/}
            {/*    <MenuIcon/>*/}
            {/*</IconButton>*/}
            <Box
              sx={{
                display: "flex",
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography variant="h6" noWrap component="div">
                  <Link href="/">initry</Link>
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  verticalAlign: "center",
                  gap: "10px",
                }}
              >
                <Box>
                  <Link
                    href="https://initry.io"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LibraryBooksIcon sx={{ opacity: "50%" }} />
                  </Link>
                </Box>
                <Box>
                  <Link
                    href="https://github.com/initry/initry"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GitHubIcon sx={{ opacity: "50%" }} />
                  </Link>
                </Box>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>
        {/*<Drawer variant="permanent" open={open}>*/}
        {/*    <DrawerHeader>*/}
        {/*        <IconButton onClick={handleDrawerClose}>*/}
        {/*            {theme.direction === 'rtl' ? <ChevronRightIcon/> : <ChevronLeftIcon/>}*/}
        {/*        </IconButton>*/}
        {/*    </DrawerHeader>*/}

        {/*    <List>*/}
        {/*        {links.map((item, index) => {*/}
        {/*            return (*/}
        {/*                <Link href={item.link}>*/}
        {/*                <ListItem key={index} disablePadding sx={{display: 'block'}}>*/}
        {/*                    <ListItemButton*/}
        {/*                        sx={{*/}
        {/*                            minHeight: 48,*/}
        {/*                            justifyContent: open ? 'initial' : 'center',*/}
        {/*                            px: 2.5,*/}
        {/*                        }}*/}
        {/*                    >*/}
        {/*                        <ListItemIcon*/}
        {/*                            sx={{*/}
        {/*                                minWidth: 0,*/}
        {/*                                mr: open ? 3 : 'auto',*/}
        {/*                                justifyContent: 'center',*/}
        {/*                            }}*/}
        {/*                        >*/}
        {/*
                {/*                            {index % 2 === 0 ? <Dashboard/> : ''}*/}
        {/*                        </ListItemIcon>*/}
        {/*                        <ListItemText primary={index} sx={{opacity: open ? 1 : 0}}/>*/}
        {/*                    </ListItemButton>*/}
        {/*                </ListItem>*/}
        {/*                </Link>*/}
        {/*            )})}*/}
        {/*    </List>*/}
        {/*</Drawer>*/}
        {/*<DrawerHeader/>*/}
        <Container sx={{ paddingTop: "60px" }} maxWidth={false}>
          {children}
        </Container>
      </Box>
    </>
  );
};
