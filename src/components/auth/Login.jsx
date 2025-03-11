import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Avatar,
  Slide,
  Fade,
} from "@mui/material";
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  Security as SecurityIcon,
} from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import { motion } from "framer-motion";

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
    py: 3,
    position: "relative",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      animation: "gradientMove 15s linear infinite",
    },
  },
  card: {
    borderRadius: 3,
    overflow: "hidden",
    backdropFilter: "blur(10px)",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
    position: "relative",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "4px",
      background: "linear-gradient(90deg, #3B82F6, #2563EB)",
    },
  },
  header: {
    bgcolor: "primary.main",
    py: 4,
    px: 3,
    textAlign: "center",
    color: "white",
    background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
  },
  avatar: {
    width: { xs: 100, sm: 120, md: 140 },
    height: { xs: 100, sm: 120, md: 140 },
    mx: "auto",
    mb: 3,
    border: "4px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
    animation: "pulse 2s infinite",
  },
  form: {
    "& .MuiTextField-root": {
      mb: 2,
    },
  },
  textField: {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      transition: "all 0.2s ease-in-out",
      "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 1)",
        transform: "translateY(-1px)",
      },
      "&.Mui-focused": {
        backgroundColor: "rgba(255, 255, 255, 1)",
        transform: "translateY(-1px)",
        boxShadow: "0 4px 12px rgba(37, 99, 235, 0.1)",
      },
    },
  },
  submitButton: {
    mt: 3,
    mb: 2,
    py: 1.5,
    borderRadius: 2,
    background: "linear-gradient(90deg, #3B82F6, #2563EB)",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 6px 20px rgba(37, 99, 235, 0.3)",
    },
  },
};

// Add animation variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const formVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const fieldVariants = {
  initial: { opacity: 0, x: -20 },
  animate: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
    },
  }),
};

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageUrl] = useState(
    "https://ogcljpmtozblkwdvycro.supabase.co/storage/v1/object/sign/Portfolio/profile_sandesh.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJQb3J0Zm9saW8vcHJvZmlsZV9zYW5kZXNoLmpwZyIsImlhdCI6MTczODY0ODg4MSwiZXhwIjozMTcwOTg2NDg4ODF9.uwmEeA_cM1yqhr_18BseS7ibcaN6KquLyCUeoBTEqM0"
  ); // Replace with your image URL

  // Rate limiting
  const [attempts, setAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState(null);

  useEffect(() => {
    const savedLockout = localStorage.getItem("loginLockout");
    if (savedLockout && new Date(savedLockout) > new Date()) {
      setLockoutUntil(new Date(savedLockout));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Security checks
    if (lockoutUntil && new Date() < lockoutUntil) {
      const timeLeft = Math.ceil((lockoutUntil - new Date()) / 1000 / 60);
      toast.error(
        `Too many attempts. Please try again in ${timeLeft} minutes.`
      );
      return;
    }

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Signing in...");

    try {
      await login(email, password);
      setAttempts(0);
      toast.success("Login successful!", { id: loadingToast });
      navigate("/dashboard");
    } catch (error) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 5) {
        const lockout = new Date(Date.now() + 15 * 60 * 1000);
        setLockoutUntil(lockout);
        localStorage.setItem("loginLockout", lockout.toISOString());
        toast.error(
          "Too many failed attempts. Please try again in 15 minutes.",
          { id: loadingToast }
        );
      } else {
        toast.error(`Login failed. ${5 - newAttempts} attempts remaining.`, {
          id: loadingToast,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <Box sx={styles.container}>
        <Container maxWidth="sm">
          <motion.div variants={formVariants}>
            <Card sx={styles.card}>
              <Box sx={styles.header}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                  }}
                >
                  <Avatar
                    src={imageUrl}
                    alt="Profile"
                    sx={styles.avatar}
                    imgProps={{
                      loading: "lazy",
                      onError: (e) => {
                        e.target.src =
                          "https://via.placeholder.com/140?text=Profile";
                      },
                    }}
                  />
                </motion.div>
                <Typography variant="h4" gutterBottom>
                  Portfolio Management
                </Typography>
                <Typography variant="subtitle1">
                  Secure access to your content management system
                </Typography>
              </Box>

              <CardContent sx={{ p: 4 }}>
                <form onSubmit={handleSubmit} sx={styles.form}>
                  <motion.div custom={0} variants={fieldVariants}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      variant="outlined"
                      margin="normal"
                      required
                      autoFocus
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={styles.textField}
                    />
                  </motion.div>

                  <motion.div custom={1} variants={fieldVariants}>
                    <TextField
                      fullWidth
                      label="Password"
                      variant="outlined"
                      margin="normal"
                      required
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock color="primary" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={styles.textField}
                    />
                  </motion.div>

                  <motion.div custom={2} variants={fieldVariants}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      disabled={loading}
                      startIcon={
                        loading ? <CircularProgress size={20} /> : <LoginIcon />
                      }
                      sx={styles.submitButton}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {loading ? "Signing in..." : "Sign In"}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </Container>
      </Box>
    </motion.div>
  );
};

export default Login;
