"use client"

import { useState, useEffect } from "react"

export function useMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return

    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }

    // Initial check
    checkIfMobile()

    // Add event listener
    window.addEventListener("resize", checkIfMobile)

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [breakpoint])

  return isMobile
}

export default useMobile

