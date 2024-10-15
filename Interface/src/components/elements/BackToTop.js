"use client";
import { useEffect, useState } from "react";

export default function BackToTop() {
  const [hasScrolled, setHasScrolled] = useState(false); // Use boolean instead of string

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 100 && !hasScrolled) {
        setHasScrolled(true);
      } else if (window.scrollY <= 100 && hasScrolled) {
        setHasScrolled(false);
      }
    };

    // Add scroll event listener
    window.addEventListener("scroll", onScroll);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [hasScrolled]); // Add hasScrolled as a dependency to avoid unnecessary re-renders

  return (
    <>
      {hasScrolled && (
        <span
          className="scroll-top scroll-to-target open"
          style={{
            position: "fixed",
            zIndex: 2147483647,
            bottom: "20px",
            right: "20px",
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} // Scroll to top when clicked
        >
          <i className="fas fa-angle-up"></i>
        </span>
      )}
    </>
  );
}
