"use client";

import * as React from "react";

export type ButtonProps = {
  variant?: "primary" | "outline" | "ghost";
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      type = "button",
      onClick,
      children,
      className,
      ...rest
    },
    ref
  ) {
    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        className={[
          "button",
          `button--${variant}`,
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

export default Button;
