import LogoLight from "@/assets/images/logo_light_meridia.svg";
import LogoDark from "@/assets/images/logo_dark_meridia.svg";
import { useUiStore } from "@/stores/uiStore";

const LogoApp = () => {
  const themeMode = useUiStore((s) => s.themeMode);

  return (
    <img
      src={themeMode === "light" ? LogoLight : LogoDark}
      alt="Logo"
      width={120}
    />
  );
};

export default LogoApp;
