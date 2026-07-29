import "./PrimaryButton.css";
import type { ReactNode } from "react";

type PrimaryButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

function PrimaryButton({
  children,
  onClick,
  type = "button",
  disabled = false,
}: PrimaryButtonProps) {
  return (
    <button
      className="primary-button"
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default PrimaryButton;