// Packages
import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  useTheme,
  useMediaQuery,
  Avatar,
} from "@mui/material";
import { Menu as MenuIcon, Logout as LogoutIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

// Components & Services
import { supabase } from "../config/supabase";

const Header = ({ handleDrawerToggle, user }) => {
  const [bioData, setBioData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  useEffect(() => {
    fetchBioData();
  }, []);

  const fetchBioData = async () => {
    try {
      const { data: bioInfo, error: bioError } = await supabase
        .from("bio")
        .select("*")
        .single();

      if (bioError) throw bioError;
      setBioData(bioInfo);

      if (bioInfo?.image) {
        const { data: imageData, error: imageError } = await supabase.storage
          .from("bio-images")
          .download(bioInfo.image);

        if (imageError) throw imageError;

        const imageUrl = URL.createObjectURL(imageData);
        setProfileImage(imageUrl);
      }
    } catch (error) {
      console.error("Error fetching bio:", error);
    }
  };

  // Replace the existing handleLogout function with this optimized version
  const handleLogout = async () => {
    // Start navigation immediately
    navigate("/login");

    // Clean up local state
    setBioData(null);
    setProfileImage(null);

    // Perform logout in the background
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        // If logout fails, redirect back to the protected route
        console.error("Error logging out:", error.message);
        navigate("/");
        // Show error toast if you have toast setup
        toast?.error("Logout failed, please try again");
      }
    } catch (error) {
      console.error("Error logging out:", error.message);
      navigate("/");
    }
  };

  const getUserDisplayName = () => {
    if (bioData?.name) {
      return bioData.name;
    }
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    return user?.email?.split("@")[0] || "User";
  };

  const getUserAvatar = () => {
    return (
      profileImage ||
      bioData?.image ||
      user?.user_metadata?.avatar_url ||
      `https://ui-avatars.com/api/?name=${getUserDisplayName()}&background=0D8ABC&color=fff`
    );
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background:
          "linear-gradient(to right, rgba(255, 255, 255, 0.95), rgba(249, 250, 251, 0.95))",
        backdropFilter: "blur(20px)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.03)",
        borderBottom: "1px solid rgba(241, 245, 249, 0.9)",
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 56, sm: 64, md: 70 },
          px: { xs: 1, sm: 2, md: 3 },
        }}
      >
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            mr: { xs: 1, sm: 2 },
            display: { sm: "none" },
            color: "#1E293B",
            padding: { xs: 1, sm: 1.5 },
            "&:hover": {
              background: "rgba(30, 41, 59, 0.04)",
              transform: "scale(1.05)",
            },
            transition: "all 0.2s ease-in-out",
          }}
        >
          <MenuIcon sx={{ fontSize: { xs: "1.5rem", sm: "1.75rem" } }} />
        </IconButton>

        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            background: "linear-gradient(135deg, #0F172A 0%, #334155 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 800,
            fontSize: {
              xs: "0.75rem", // Smaller font size for mobile
              sm: "1.1rem",
              md: "1.35rem",
            },
            letterSpacing: { xs: "-0.01em", sm: "-0.02em" },
            display: "flex",
            alignItems: "center",
            gap: { xs: 1, sm: 2 },
            position: "relative",
            maxWidth: "100%", // Allow full width
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            "&:after": {
              content: '""',
              position: "absolute",
              bottom: -2,
              left: 0,
              width: { xs: "60%", sm: "40%" },
              height: "2px",
              background:
                "linear-gradient(90deg, #0F172A 0%, transparent 100%)",
              borderRadius: "2px",
            },
          }}
        >
          {/* Remove conditional rendering and show full text */}
          <Box
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Omkar Dhole Portfolio Management
          </Box>
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1, sm: 2, md: 3 },
            ml: "auto",
          }}
        >
          {user && (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 1, sm: 2 },
                  background:
                    "linear-gradient(to right, rgba(30, 41, 59, 0.04), rgba(30, 41, 59, 0.02))",
                  padding: { xs: "6px 12px", sm: "8px 16px" },
                  borderRadius: { xs: "12px", sm: "16px" },
                  transition: "all 0.3s ease",
                  border: "1px solid rgba(241, 245, 249, 0.9)",
                  "&:hover": {
                    background:
                      "linear-gradient(to right, rgba(30, 41, 59, 0.06), rgba(30, 41, 59, 0.04))",
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
                  },
                }}
              >
                <Avatar
                  src={getUserAvatar()}
                  alt={getUserDisplayName()}
                  sx={{
                    width: { xs: 32, sm: 38, md: 42 },
                    height: { xs: 32, sm: 38, md: 42 },
                    border: "3px solid white",
                    bgcolor: "#0D8ABC",
                    boxShadow: "0 2px 12px rgba(13,138,188,0.25)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.08) rotate(5deg)",
                      boxShadow: "0 4px 16px rgba(13,138,188,0.35)",
                    },
                  }}
                />
                {!isMobile && (
                  <Box
                    sx={{
                      minWidth: { sm: 80, md: 100 },
                      display: { xs: "none", sm: "block" },
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: "#1E293B",
                        fontWeight: 600,
                        lineHeight: 1.2,
                        fontSize: { xs: "0.8rem", sm: "0.875rem", md: "1rem" },
                      }}
                    >
                      {getUserDisplayName()}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#64748B",
                        display: "block",
                        fontSize: { xs: "0.7rem", sm: "0.75rem", md: "0.8rem" },
                      }}
                    >
                      {bioData?.title || user.email}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Button
                variant="outlined"
                startIcon={!isMobile && <LogoutIcon />}
                onClick={() => {
                  setIsLoggingOut(true);
                  handleLogout();
                }}
                disabled={isLoggingOut}
                sx={{
                  borderColor: "rgba(226, 232, 240, 0.8)",
                  color: "#64748B",
                  borderRadius: { xs: "10px", sm: "12px" },
                  px: { xs: 1.5, sm: 2, md: 3 },
                  py: { xs: 0.75, sm: 1 },
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  "&:hover": {
                    borderColor: "#CBD5E1",
                    backgroundColor: "#F8FAFC",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                  },
                  textTransform: "none",
                  transition: "all 0.3s ease",
                  minWidth: { xs: 38, sm: "auto" },
                  height: { xs: 38, sm: 42 },
                  fontSize: { xs: "0.85rem", sm: "0.9rem", md: "0.95rem" },
                  fontWeight: 500,
                  opacity: isLoggingOut ? 0.7 : 1,
                  cursor: isLoggingOut ? "not-allowed" : "pointer",
                }}
              >
                {isMobile ? (
                  <LogoutIcon sx={{ fontSize: "1.25rem" }} />
                ) : isLoggingOut ? (
                  "Logging out..."
                ) : (
                  "Logout"
                )}
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
