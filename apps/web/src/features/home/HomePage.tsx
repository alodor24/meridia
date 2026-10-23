import Box from "@mui/material/Box";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import HeroSection from "./components/HeroSection";
import ShowcaseSection from "./components/ShowcaseSection";
import FeaturesSection from "./components/FeaturesSection";
import StepsSection from "./components/StepsSection";
import CtaSection from "./components/CtaSection";

const HomePage = () => {
  useDocumentTitle("Inicio");

  return (
    <Box sx={{ overflowX: "hidden" }}>
      <HeroSection />
      <ShowcaseSection />
      <FeaturesSection />
      <StepsSection />
      <CtaSection />
    </Box>
  );
};

export default HomePage;
