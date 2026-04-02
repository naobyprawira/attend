"use client";

import { useRef, useState, useEffect } from "react";

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  className?: string;
  disabled?: boolean;
}

export function Select({ value, onChange, options, className = "", disabled = false }: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      // Don't close if clicking the button itself
      if (buttonRef.current && e.target === buttonRef.current) {
        return;
      }
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const selectedLabel = options.find((o) => o.value === value)?.label || "Select...";

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled) {
            setOpen((v) => !v);
          }
        }}
        disabled={disabled}
        className="w-full bg-surface-container-highest dark:bg-dark-surface-container-highest border-none rounded-lg py-2.5 px-3.5 text-sm focus:ring-2 focus:ring-primary/20 transition-all text-on-surface dark:text-dark-on-surface text-left flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-container-high dark:hover:bg-dark-surface-container-high"
      >
        <span className="capitalize">{selectedLabel}</span>
        <span className="material-symbols-outlined text-base">{open ? "expand_less" : "expand_more"}</span>
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-surface-container-lowest dark:bg-dark-surface-container-lowest border border-outline-variant/10 rounded-lg shadow-lg z-50 overflow-hidden animate-fade-in">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={`w-full px-3.5 py-2.5 text-left text-sm transition-all capitalize ${
                value === option.value
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-on-surface dark:text-dark-on-surface hover:bg-surface-container dark:hover:bg-dark-surface-container"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
