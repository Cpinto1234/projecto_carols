"use client"

import { useEffect } from "react"

export default function ErrorListener() {
  useEffect(() => {
    function handleError(e: ErrorEvent) {
      // Log the error with helpful context
      // e.error may be undefined for some resource failures (Event)
      console.error("[v0] window error event:", e.error ?? e.message, e)
    }

    function handleRejection(e: PromiseRejectionEvent) {
      try {
        console.error("[v0] unhandledrejection:", e.reason)

        // If the rejection reason is a DOM Event (e.g., resource load error),
        // try to extract the failing resource and prevent the default overlay.
        if (e.reason instanceof Event) {
          const target: any = (e.reason as any).target || (e.reason as any).srcElement
          if (target) {
            const info = {
              tagName: target.tagName,
              src: target.src || target.href,
              outerHTML: typeof target.outerHTML === "string" ? target.outerHTML.slice(0, 300) : undefined,
            }
            console.error("[v0] Resource error event info:", info)
          }
          // Prevent the browser/overlay default handling for this rejection
          e.preventDefault()
        }
      } catch (err) {
        // Best-effort logging
        console.error("[v0] Error in rejection handler:", err)
      }
    }

    window.addEventListener("error", handleError)
    window.addEventListener("unhandledrejection", handleRejection)

    return () => {
      window.removeEventListener("error", handleError)
      window.removeEventListener("unhandledrejection", handleRejection)
    }
  }, [])

  return null
}
