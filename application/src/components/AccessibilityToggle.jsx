/**
 * HowToPlay.jsx - A component to toggle accessibility options
 *
 * @file Represents the toggle button and state
 * @author Carina Jose
 * @author Amreet Dhillon
 * @author Genki Asahi 
 * @author Yap Wen Xing
 * @author Dany Kelzi
 * @version 1.1.2
 * @since 17-03-2025
 */

import { useAccessibility } from "./AccessibilityContext";

/**
 * AccessibilityToggle Component 
 * 
 * This component handles the toggle to and from accessibility mode
 * 
 * @component
 * @returns {JSX.Element} A react component representing the toggle button.
 */

export default function AccessibilityBtn() {
  const { isAccessible, setIsAccessible } = useAccessibility();

  const toggleAccessibility = () => {
    setIsAccessible((prev) => !prev);
  };

  return (
    <button
      onClick={toggleAccessibility}
      className="p-2 rounded bg-blue-500 text-white"
    >
      {isAccessible ? "Disable Accessibility Mode" : "Enable Accessibility Mode"}
    </button>
  );
}