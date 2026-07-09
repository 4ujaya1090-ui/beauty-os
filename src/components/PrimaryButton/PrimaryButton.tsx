import "./PrimaryButton.css";
import type { ReactNode } from "react";

type PrimaryButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
};

function PrimaryButton({
  children,
  onClick,
  type = "button",
}: PrimaryButtonProps) {
  return (
    <button
      className="primary-button"
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}

export default PrimaryButton;