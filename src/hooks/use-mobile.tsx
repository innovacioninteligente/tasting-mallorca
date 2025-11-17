import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Ensure this code only runs on the client
    const checkDevice = () => {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    checkDevice();

    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, [])

  return isMobile
}
