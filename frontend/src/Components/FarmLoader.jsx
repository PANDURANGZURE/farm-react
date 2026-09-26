import { useEffect, useRef } from "react"
import gsap from "gsap"

function FarmLoader({ onComplete }) {
  const loaderRef = useRef(null)
  const titleRef = useRef(null)
  const logoRef = useRef(null)
  const subtitleRef = useRef(null)
  const welcomeRef = useRef(null)
  const lineRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline()

      // Initial positions
      gsap.set(welcomeRef.current, {
        y: -30,
        opacity: 0,
      })

      gsap.set(titleRef.current, {
        yPercent: 120,
        opacity: 0,
      })

      gsap.set(logoRef.current, {
        y: 160,
        scale: 0.5,
        opacity: 0,
      })

      gsap.set(subtitleRef.current, {
        y: 30,
        opacity: 0,
      })

      gsap.set(lineRef.current, {
        scaleX: 0,
        transformOrigin: "left center",
      })

      // 1. Welcome text
      timeline.to(welcomeRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power3.out",
      })

      // 2. FARM comes from bottom
      timeline.to(
        titleRef.current,
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.1,
          ease: "power4.out",
        },
        "-=0.15"
      )

      // 3. Logo rises
      timeline.to(
        logoRef.current,
        {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: "back.out(1.6)",
        },
        "-=0.45"
      )

      // 4. Subtitle
      timeline.to(
        subtitleRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=0.35"
      )

      // 5. Bottom line
      timeline.to(
        lineRef.current,
        {
          scaleX: 1,
          duration: 0.7,
          ease: "power2.inOut",
        },
        "-=0.2"
      )

      // 6. Hold
      timeline.to({}, {
        duration: 0.7,
      })

      // 7. Small zoom
      timeline.to(loaderRef.current, {
        scale: 1.02,
        duration: 0.4,
        ease: "power2.inOut",
      })

      
      timeline.to(loaderRef.current, {
        yPercent: -100,
        duration: 0.9,
        ease: "power4.inOut",

        onComplete: () => {
          if (onComplete) {
            onComplete()
          }
        },
      })
    }, loaderRef)

    return () => {
      ctx.revert()
    }
  }, [onComplete])

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[9999] overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-600"
    >
      
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-300/10 blur-[130px]" />

     
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-400/10 blur-[100px]" />

     
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-teal-300/10 blur-[100px]" />

     
      <div className="relative flex h-full flex-col items-center justify-center">

        
        <p
          ref={welcomeRef}
          className="absolute top-12 text-xs font-semibold uppercase tracking-[0.45em] text-emerald-100/50"
        >
          Welcome to
        </p>

        {/* Huge FARM text */}
        <div className="overflow-hidden">
          <h1
            ref={titleRef}
            className="
              whitespace-nowrap
              text-[16vw]
              font-black
              
              tracking-[-0.05em]
              text-[#edf5e2]
              sm:text-[16vw]
              md:text-[15vw]
            "
          >
            Agri Pocket
          </h1>
        </div>

        
        <div
          ref={logoRef}
          className="relative -mt-2 flex h-24 w-24 items-center justify-center"
        >
          
          <div className="absolute inset-0 rounded-full border border-emerald-200/20" />

          
          <div className="absolute inset-3 rounded-full border border-teal-200/20" />

          
          <div className="absolute inset-6 rounded-full bg-white/5 backdrop-blur-sm" />

          
          <span className="relative text-5xl">
            🌾
          </span>
        </div>

        
        <div className="mt-4 overflow-hidden">
          <p
            ref={subtitleRef}
            className="text-xs font-medium uppercase tracking-[0.45em] text-emerald-100/70 sm:text-sm"
          >
            THE FARM Management System
          </p>
        </div>
        

        {/* Bottom progress line */}
        <div className="absolute bottom-12 h-px w-44 bg-white/10">
          <div
            ref={lineRef}
            className="h-full bg-gradient-to-r from-emerald-200 via-green-300 to-teal-200"
          />
        </div>
      </div>

      {/* Decorative leaves */}
      <div className="pointer-events-none absolute left-[8%] top-[38%] text-5xl opacity-10">
        🌿
      </div>

      <div className="pointer-events-none absolute right-[8%] top-[45%] text-5xl opacity-10">
        🌿
      </div>
    </div>
  )
}

export default FarmLoader