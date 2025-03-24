import { useAccessibility } from "./AccessibilityContext";

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