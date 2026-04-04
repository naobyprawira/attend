"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

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
      <Button
        ref={buttonRef}
        size="md"
        fullWidth
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled) {
            setOpen((v) => !v);
          }
        }}
        disabled={disabled}
        className="bg-surface-container-highest border-none rounded-lg px-3.5 text-sm font-normal text-on-surface text-left justify-between hover:bg-surface-container-high"
      >
        <span className="capitalize">{selectedLabel}</span>
        <span className="material-symbols-outlined text-base">{open ? "expand_less" : "expand_more"}</span>
      </Button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-surface-container-lowest border border-outline-variant/10 rounded-lg shadow-lg z-50 overflow-hidden animate-fade-in">
          {options.map((option) => (
            <Button
              key={option.value}
              variant="ghost"
              size="md"
              fullWidth
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={`rounded-none justify-start px-3.5 text-left text-sm font-normal capitalize ${
                value === option.value
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-on-surface hover:bg-surface-container"
              }`}
            >
              {option.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
