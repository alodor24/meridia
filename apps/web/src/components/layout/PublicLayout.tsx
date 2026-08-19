import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export const PublicLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />

      <Box component="main" sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {children}
      </Box>

      <Footer />
    </Box>
  );
};
