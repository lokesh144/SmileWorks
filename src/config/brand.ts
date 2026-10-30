/**
 * Brand palette taken from the supplied SmileWorks Solutions brand board.
 * CSS tokens live in src/styles/globals.css (@theme) — keep both in sync.
 */
export const brand = {
  colors: {
    charcoal: "#111111",
    gold: "#FFC629",
    white: "#FFFFFF",
    paper: "#F8F8F6",
    stone: "#F2F2EF",
  },
  assets: {
    /** Rounded app-icon mark, works on light and dark surfaces. */
    icon: "/brand/smileworks-icon.png",
    /** Transparent mark for dark backgrounds (white + gold). */
    markOnDark: "/brand/smileworks-mark-light.png",
    /** Transparent mark for light backgrounds (charcoal + gold). */
    markOnLight: "/brand/smileworks-mark-dark.png",
  },
} as const;
