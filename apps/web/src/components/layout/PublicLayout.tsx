import { Box } from "@mui/material";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <Box
        component="main"
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default PublicLayout;
