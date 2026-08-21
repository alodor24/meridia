const globalStyles = {
    "::-webkit-scrollbar-track": {
        backgroundColor: "#e0e0e0",
        borderRadius: "5rem",
    },
    "::-webkit-scrollbar": {
        width: "0.4rem",
        height: "0.4rem",
    },
    "::-webkit-scrollbar-thumb": {
        backgroundColor: "#607d8b",
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
        outline: "2px solid #4f6bff",
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
};

export const NAVBAR_LIGHT = "rgba(255, 255, 255, 0.9)";

export const NAVBAR_DARK = "rgba(14, 19, 26, 0.9)";

export const DRAWER_WIDTH = 240;

export default globalStyles;