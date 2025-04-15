"use client";

import { Bounce, ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";

export default function ClientToast() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const setMode = () => setTheme(media.matches ? "dark" : "light");

    setMode(); // Initial
    media.addEventListener("change", setMode); // Watch for changes

    return () => media.removeEventListener("change", setMode);
  }, []);

  return (
    <ToastContainer
      theme={theme}
      position="bottom-center"
      autoClose={3000}
      hideProgressBar
      limit={1}
    />
  );
}
