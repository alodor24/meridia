const globalStyles = {
  "::-webkit-scrollbar-track": {
    backgroundColor: "#e0e0e0",
    borderRadius: "5rem",
  },
  "::-webkit-scrollbar": {
    width: "0.3rem",
    height: "0.4rem",
  },
  "::-webkit-scrollbar-thumb": {
    backgroundColor: "#90a4ae",
    borderRadius: "5rem",
  },
  "::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "#42a5f5",
  },
  "::selection": {
    backgroundColor: "#42a5f5",
    color: "#fff",
  },
  ":focus-visible": {
    outline: "2px solid #0050de",
    outlineOffset: 2,
  },
  "@media (prefers-reduced-motion: reduce)": {
    "*": {
      animationDuration: "0.01ms !important",
      animationIterationCount: "1 !important",
      transitionDuration: "0.01ms !important",
      scrollBehavior: "auto !important",
    },
  },
  ".MuiButton-root": {
    borderRadius: "3rem !important",
  },
};

export const NAVBAR_LIGHT = "rgba(255, 255, 255, 0.9)";

export const NAVBAR_DARK = "rgba(14, 19, 26, 0.9)";

export const DRAWER_WIDTH = 260;

export const DRAWER_COLLAPSED_WIDTH = 80;

export const SHADOW = "0px 5px 15px 0px rgba(31, 40, 54, 0.2)";

export default globalStyles;
