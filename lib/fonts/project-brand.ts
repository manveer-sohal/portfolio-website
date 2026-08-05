import {
  Fraunces,
  Plus_Jakarta_Sans,
  Source_Sans_3,
} from "next/font/google";

/**
 * Project-brand display fonts — load only on routes that render themed
 * featured cards / case studies (not the global root layout).
 */
export const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const projectBrandFontVariables = [
  fraunces.variable,
  sourceSans.variable,
  plusJakarta.variable,
].join(" ");
