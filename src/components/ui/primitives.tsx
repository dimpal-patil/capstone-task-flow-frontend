import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

/* ---------- Button ---------- */

type Variant =
  "primary" | "secondary" | "danger" | "ghost" | "success" | "warning";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md hover:from-brand-700 hover:to-indigo-700 focus-visible:ring-brand-400",
  secondary:
    "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus-visible:ring-brand-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700",
  danger:
    "text-red-600 hover:bg-red-50 hover:text-red-700 focus-visible:ring-red-300 dark:text-red-400 dark:hover:bg-red-950 dark:hover:text-red-300",
  ghost:
    "text-brand-700 hover:text-brand-900 focus-visible:ring-brand-400 dark:text-brand-400 dark:hover:text-brand-300",
  success:
    "bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-300",
  warning:
    "bg-amber-500 text-white hover:bg-amber-600 focus-visible:ring-amber-300",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-2 text-sm",
  md: "px-5 py-3 text-sm",
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`rounded-xl font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? "w-full" : ""} ${className}`}
    />
  );
}

/* ---------- Input ---------- */

export function Input({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-brand-500 dark:focus:ring-brand-900 ${className}`}
    />
  );
}

/* ---------- Textarea ---------- */

export function Textarea({
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-brand-900 ${className}`}
    />
  );
}

/* ---------- Select ---------- */

export function Select({
  className = "",
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:ring-brand-900 ${className}`}
    />
  );
}

/* ---------- Badge ---------- */

const statusClasses: Record<string, string> = {
  Done: "bg-green-200 text-green-700 dark:bg-green-900 dark:text-green-300",
  "In Progress":
    "bg-brand-200 text-brand-700 dark:bg-brand-900 dark:text-brand-300",
  "To Do": "bg-blue-200 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  Active: "bg-green-200 text-green-700 dark:bg-green-900 dark:text-green-300",
  Archived:
    "bg-violet-200 text-violet-900 dark:bg-violet-900 dark:text-violet-200",
};

const priorityClasses: Record<string, string> = {
  High: "bg-red-200 text-red-700 dark:bg-red-900 dark:text-red-300",
  Medium:
    "bg-yellow-200 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  Low: "bg-sky-200 text-sky-800 dark:bg-sky-950 dark:text-sky-300",
};

interface BadgeProps {
  label: string;
  tone?: "status" | "priority";
  className?: string;
}

export function Badge({ label, tone = "status", className = "" }: BadgeProps) {
  const map = tone === "priority" ? priorityClasses : statusClasses;
  const colors =
    map[label] ??
    "bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-300";

  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${colors} ${className}`}
    >
      {tone === "priority" ? `Priority: ${label}` : label}
    </span>
  );
}

/* ---------- Alerts ---------- */

interface AlertProps {
  message: string;
}

export function ErrorAlert({ message }: AlertProps) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
    >
      {message}
    </p>
  );
}

export function SuccessAlert({ message }: AlertProps) {
  if (!message) return null;
  return (
    <p
      role="status"
      className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300"
    >
      {message}
    </p>
  );
}
