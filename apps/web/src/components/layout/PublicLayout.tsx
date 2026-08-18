import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import { PublicNavbar } from "../../features/home/components/PublicNavbar";
import Footer from "@/components/ui/Footer";

export const PublicLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <PublicNavbar />

      <Box component="main" sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {children}
      </Box>

      <Footer />
    </Box>
  );
};
