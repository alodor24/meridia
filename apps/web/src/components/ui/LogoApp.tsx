import LogoLight from "@/assets/images/logo_light_meridia.svg";
import LogoDark from "@/assets/images/logo_dark_meridia.svg";
import { useUiStore } from "@/stores/uiStore";

interface LogoAppProps {
  width?: number;
}

const LogoApp = ({ width = 120 }: LogoAppProps) => {
  const themeMode = useUiStore((s) => s.themeMode);

  return (
    <img
      src={themeMode === "light" ? LogoLight : LogoDark}
      alt="Logo"
      width={width}
    />
  );
};

export default LogoApp;
