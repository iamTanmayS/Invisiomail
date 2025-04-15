"use client"
import React, { useEffect, useRef, useState, memo } from "react"
import { motion } from "framer-motion"
import { twMerge } from "tailwind-merge"
import { cn } from "@/lib/utils"

const glowAnimations = `
  @keyframes textGlow {
    0%, 100% { 
      text-shadow: 0 0 15px rgba(167, 139, 250, 0.8), 0 0 30px rgba(236, 72, 153, 0.5), 0 0 45px rgba(251, 191, 36, 0.3);
    }
    50% { 
      text-shadow: 0 0 20px rgba(167, 139, 250, 0.9), 0 0 35px rgba(236, 72, 153, 0.7), 0 0 50px rgba(251, 191, 36, 0.5);
    }
  }
`

const TextRevealCard = ({ text, revealText, children, className }) => {
  const [widthPercentage, setWidthPercentage] = useState(0)
  const cardRef = useRef(null)
  const [left, setLeft] = useState(0)
  const [localWidth, setLocalWidth] = useState(0)
  const [isMouseOver, setIsMouseOver] = useState(false)

  useEffect(() => {
    if (cardRef.current) {
      const { left, width: localWidth } = cardRef.current.getBoundingClientRect()
      setLeft(left)
      setLocalWidth(localWidth)
    }
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (cardRef.current) {
        const { left, width: localWidth } = cardRef.current.getBoundingClientRect()
        setLeft(left)
        setLocalWidth(localWidth)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  function mouseMoveHandler(event) {
    event.preventDefault()
    const { clientX } = event
    if (cardRef.current) {
      const relativeX = clientX - left
      setWidthPercentage((relativeX / localWidth) * 100)
    }
  }

  function mouseLeaveHandler() {
    setIsMouseOver(false)
    setWidthPercentage(0)
  }
  
  function mouseEnterHandler() {
    setIsMouseOver(true)
  }
  
  function touchMoveHandler(event) {
    event.preventDefault()
    const touch = event.touches[0]
    if (touch && cardRef.current) {
      const clientX = touch.clientX
      const relativeX = clientX - left
      setWidthPercentage((relativeX / localWidth) * 100)
    }
  }

  const rotateDeg = (widthPercentage - 50) * 0.1
  
  return (
    <>
      <style>{glowAnimations}</style>
      <div
        onMouseEnter={mouseEnterHandler}
        onMouseLeave={mouseLeaveHandler}
        onMouseMove={mouseMoveHandler}
        onTouchStart={mouseEnterHandler}
        onTouchEnd={mouseLeaveHandler}
        onTouchMove={touchMoveHandler}
        ref={cardRef}
        className={cn(
          "w-[40rem] p-4 relative overflow-hidden",
          className,
        )}
      >
        {children}

        <div className="h-40 relative flex items-center overflow-hidden">
          {/* Base/unrevealed text layer */}
          <div className="absolute inset-0 flex items-center">
            <p className="text-base sm:text-[3rem] py-10 font-bold text-gray-500/80 relative z-10 w-full">
              {text}
            </p>
          </div>
          
          {/* Divider line that moves with cursor */}
          <motion.div
            animate={{
              left: `${widthPercentage}%`,
              rotate: `${rotateDeg}deg`,
              opacity: widthPercentage > 0 ? 1 : 0,
            }}
            transition={isMouseOver ? { duration: 0 } : { duration: 0.4 }}
            className="h-40 w-[4px] bg-gradient-to-b from-purple-400 via-pink-500 to-amber-400 absolute z-50 will-change-transform shadow-[0_0_15px_2px_rgba(236,72,153,0.6)]"
          ></motion.div>

          {/* Revealed text layer with solid background */}
          <motion.div
            style={{
              width: "100%",
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
            }}
            animate={
              isMouseOver
                ? {
                    clipPath: `inset(0 ${100 - widthPercentage}% 0 0)`,
                  }
                : {
                    clipPath: `inset(0 100% 0 0)`,
                  }
            }
            initial={{ clipPath: `inset(0 100% 0 0)` }}
            transition={isMouseOver ? { duration: 0 } : { duration: 0.4 }}
            className="z-20 will-change-transform"
          >
            {/* Solid background to hide unrevealed text */}
            <div className="absolute inset-0 bg-[#1d1c20] z-20"></div>
            
            {/* Revealed text */}
            <p
              style={{
                animation: "textGlow 3s infinite",
              }}
              className="text-base sm:text-[3rem] py-10 font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-400 to-amber-300 relative z-30 w-full"
            >
              {revealText}
            </p>
          </motion.div>

          {/* Background effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/5 via-pink-900/5 to-amber-900/5 blur-xl"></div>
            <MemoizedStars />
          </div>
        </div>
      </div>
    </>
  )
}

export const TextRevealCardTitle = ({
  children,
  className,
}) => {
  return <h2 className={twMerge("text-white text-lg mb-2", className)}>{children}</h2>
}

export const TextRevealCardDescription = ({
  children,
  className,
}) => {
  return <p className={twMerge("text-[#a9a9a9] text-sm", className)}>{children}</p>
}

const Stars = () => {
  const randomMove = () => Math.random() * 4 - 2
  const randomOpacity = () => Math.random()
  const random = () => Math.random()
  const randomSize = () => Math.random() * 3 + 1
  const randomColor = () => {
    const colors = ["#FFD700", "#FF69B4", "#00BFFF", "#7FFF00", "#FF6347"]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(80)].map((_, i) => (
        <motion.span
          key={`star-${i}`}
          animate={{
            top: `calc(${random() * 100}% + ${randomMove()}px)`,
            left: `calc(${random() * 100}% + ${randomMove()}px)`,
            opacity: randomOpacity(),
            scale: [1, 1.5, 0],
          }}
          transition={{
            duration: random() * 10 + 20,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            top: `${random() * 100}%`,
            left: `${random() * 100}%`,
            width: `${randomSize()}px`,
            height: `${randomSize()}px`,
            backgroundColor: randomColor(),
            boxShadow: `0 0 10px 2px ${randomColor()}`,
            borderRadius: "50%",
            zIndex: 1,
          }}
          className="inline-block"
        ></motion.span>
      ))}
    </div>
  )
}

export const MemoizedStars = memo(Stars)
