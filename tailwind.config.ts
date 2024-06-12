import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
      spacing: {
        "1.25": "0.3rem",
      },
      screens: {
        xs: "390px", // Adds the 'xs' breakpoint at 390px
      },
    },
  },
  plugins: [],
} satisfies Config;
