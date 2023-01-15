import "./styles.css";
import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import { Header, ChipUser } from "./components";
import {
  Sidebar,
  Menu,
  SubMenu,
  MenuItem,
  useProSidebar
} from "react-pro-sidebar";
import {
  Divider,
  Box,
  Typography,
  CssBaseline,
  Tooltip,
  Avatar,
  Stack,
  Chip,
  Paper
} from "@mui/material";
import { ErrorBoundary } from "react-error-boundary";
import styled from "styled-components";
import { Fallback } from "./components/Fallback";
import { Colors } from "./constants/styles";
import { AuthContext } from "./contexts/AuthContext";
import { useStateContext } from "./contexts/ContextProvider";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
// Import Page
import {
  Home,
  LoginCaleg,
  LoginSaksiTps,
  DaftarUser,
  TambahUser,
  UbahUser,
  ProfilCaleg,
  UbahProfilCaleg
} from "./pages/index";

const App = () => {
  const { screenSize, setScreenSize } = useStateContext();
  const { collapseSidebar } = useProSidebar();
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(true);

  const ADMINRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.tipeUser === "ADMIN") {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const CALEGRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.tipeUser === "CALEG") {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const openMenuFunction = () => {
    setOpen(!open);
    collapseSidebar();
  };

  const contentWrapper = {
    minHeight: "100vh",
    width: open && screenSize >= 650 ? "80vw" : "100vw"
  };

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Box>
      <BrowserRouter>
        <CssBaseline />
        <Header />
        <div style={container}>
          {user && (
            <Sidebar
              backgroundColor={Colors.blue50}
              defaultCollapsed={screenSize >= 650 ? false : true}
              collapsedWidth="0px"
            >
              {user.nama ? (
                <Paper elevation={6} sx={userAccount}>
                  <Avatar sx={avatarIcon}>{user.nama.slice(0, 1)}</Avatar>
                  <Box sx={userAccountWrapper}>
                    <Typography variant="subtitle2" sx={userNama}>
                      {user.nama}
                    </Typography>
                    <Typography variant="subtitle2" sx={userTipe}>
                      {user.tipeUser}
                    </Typography>
                  </Box>
                  <Box sx={avatarContainer}>
                    <ChipUser />
                  </Box>
                </Paper>
              ) : (
                <Paper elevation={6} sx={userAccount}>
                  <Avatar sx={avatarIcon}>{user.namaSaksi.slice(0, 1)}</Avatar>
                  <Box sx={userAccountWrapper}>
                    <Typography variant="subtitle2" sx={userNama}>
                      {user.namaSaksi}
                    </Typography>
                    <Typography variant="subtitle2" sx={userTipe}>
                      TPS
                    </Typography>
                  </Box>
                  <Box sx={avatarContainer}>
                    <ChipUser />
                  </Box>
                </Paper>
              )}
              <Menu>
                {user.tipeUser === "ADMIN" && (
                  <Link to="/daftarUser" style={linkText}>
                    <MenuItem
                      rootStyles={{
                        backgroundColor:
                          window.location.pathname === "/user" && "#eaabff"
                      }}
                      icon={<PersonIcon name="user" />}
                    >
                      User
                    </MenuItem>
                  </Link>
                )}
                <Divider />
                {user.tipeUser === "CALEG" && (
                  <Link to="/profilCaleg" style={linkText}>
                    <MenuItem icon={<PersonPinIcon name="caleg" />}>
                      Caleg
                    </MenuItem>
                  </Link>
                )}
                <Divider />
                <Link to="/tps" style={linkText}>
                  <MenuItem icon={<AccountBalanceIcon name="tps" />}>
                    TPS
                  </MenuItem>
                </Link>
                <Divider />
              </Menu>
            </Sidebar>
          )}
          <main>
            {user && (
              <Tooltip title="Menu">
                <MenuIcon
                  onClick={() => openMenuFunction()}
                  sx={sidebarIcon}
                  fontSize="large"
                />
              </Tooltip>
            )}
            <Box sx={contentWrapper}>
              <ErrorBoundary FallbackComponent={Fallback}>
                <Routes>
                  {!user ? (
                    <Route path="/" element={<Home />} />
                  ) : (
                    <Route path="/" />
                  )}
                  <Route path="/loginCaleg" element={<LoginCaleg />} />
                  <Route path="/loginSaksiTps" element={<LoginSaksiTps />} />
                  <Route path="/unauthorized" element={<Home />} />
                  <Route
                    path="/daftarUser"
                    element={
                      <ADMINRoute>
                        <DaftarUser />
                      </ADMINRoute>
                    }
                  />
                  <Route
                    path="/daftarUser/:id"
                    element={
                      <ADMINRoute>
                        <DaftarUser />
                      </ADMINRoute>
                    }
                  />
                  <Route
                    path="/daftarUser/:id/edit"
                    element={
                      <ADMINRoute>
                        <UbahUser />
                      </ADMINRoute>
                    }
                  />
                  <Route
                    path="/daftarUser/tambahUser"
                    element={
                      <ADMINRoute>
                        <TambahUser />
                      </ADMINRoute>
                    }
                  />
                  {/* Caleg */}
                  <Route
                    path="/profilCaleg"
                    element={
                      <CALEGRoute>
                        <ProfilCaleg />
                      </CALEGRoute>
                    }
                  />
                  <Route
                    path="/profilCaleg/:id/edit"
                    element={
                      <CALEGRoute>
                        <UbahProfilCaleg />
                      </CALEGRoute>
                    }
                  />
                </Routes>
              </ErrorBoundary>
            </Box>
          </main>
        </div>
      </BrowserRouter>
    </Box>
  );
};

export default App;

const container = {
  display: "flex",
  height: "100%",
  minHeight: "100vh"
};

const sidebarIcon = {
  backgroundColor: Colors.grey300,
  borderRadius: "20px",
  padding: 1,
  marginLeft: 1,
  marginTop: 1,
  cursor: "pointer"
};

const linkText = {
  textDecoration: "none",
  color: "inherit"
};

const userAccount = {
  display: "flex",
  p: 2
};

const userAccountWrapper = {
  ml: 1
};

const userNama = {
  fontWeight: 600
};

const userTipe = {
  color: "gray"
};

const avatarContainer = {
  ml: 10
};

const avatarIcon = {
  bgcolor: "purple"
};
