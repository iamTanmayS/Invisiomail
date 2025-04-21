// NavbarComponents/animations.js
export const navbarVariants = {
  hidden: { y: -100, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      mass: 1
    }
  }
};

export const dropdownVariants = {
  hidden: { 
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: { duration: 0.2 }
  },
  visible: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30,
      mass: 1,
      staggerChildren: 0.05
    }
  },
  exit: { 
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: { duration: 0.2, ease: "easeInOut" }
  }
};

export const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3 }
  }
};

export const buttonVariants = {
  initial: { scale: 1 },
  hover: { 
    y: -2,
    scale: 1.05,
    transition: { duration: 0.2 }
  },
  tap: { 
    scale: 0.95,
    transition: { duration: 0.1 }
  }
};