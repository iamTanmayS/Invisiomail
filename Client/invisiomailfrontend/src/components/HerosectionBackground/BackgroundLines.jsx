import React from "react";
import { SVG } from "./SVG";
import "../../Styles/backgroundlines.css"
const BackgroundLines = ({ children, svgOptions }) => {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* SVG Background with improved visibility options */}
      <SVG 
        svgOptions={{
          duration: 30,
          strokeWidth: 1.5,
          opacity: 1,
          pathCount: 15,
          animate: true,
          ...svgOptions
        }} 
      />
      
     
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default BackgroundLines;