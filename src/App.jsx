import "./styles.css";
import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import { Header } from "./components";
import {
  Sidebar,
  Menu,
  SubMenu,
  MenuItem,
  useProSidebar
} from "react-pro-sidebar";
import { Divider, Box, Typography, CssBaseline, Tooltip } from "@mui/material";
import { ErrorBoundary } from "react-error-boundary";
import { Fallback } from "./components/Fallback";
import { Colors } from "./constants/styles";
import { AuthContext } from "./contexts/AuthContext";
import { useStateContext } from "./contexts/ContextProvider";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
// Import Page
import { Home, LoginCaleg, LoginSaksiTps } from "./pages/index";

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
    alert(window.location.pathname);
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
              {/* <Box>
                <Typography>AA</Typography>
              </Box> */}
              <Menu>
                {user.tipeUser === "ADMIN" && (
                  <Link to="/user" style={linkText}>
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
                {user.tipeUser && (
                  <Link to="/caleg" style={linkText}>
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
