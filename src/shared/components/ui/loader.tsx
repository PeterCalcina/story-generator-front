import { cva } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  message?: string;
  variant?: "default" | "white";
  textColor?: "default" | "white";
}

const loaderVariants = cva(
  "animate-spin rounded-full border-2",
  {
    variants: {
      variant: {
        default:
          "border-b-blue-600 border-r-blue-600 border-l-blue-600 border-t-transparent",
        white:
          "border-b-white border-r-white border-l-white border-t-transparent",
      },
      size: {
        sm: "h-4 w-4",
        md: "h-6 w-6",
        lg: "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

const textVariants = cva(
  "text-sm",
  {
    variants: {
      textColor: {
        default: "text-gray-500",
        white: "text-white",
      },
    },
    defaultVariants: {
      textColor: "default",
    },
  }
);

export function Loader({
  className,
  size = "md",
  variant = "default",
  message = "Cargando...",
  textColor = "default",
  ...props
}: LoaderProps) {
  return (
    <div className="flex items-center gap-2 justify-center">
      <div
        className={cn(loaderVariants({ variant, size }), className)}
        {...props}
      >
        <span className="sr-only"></span>
      </div>
      <span className={cn(textVariants({ textColor }))}>{message}</span>
    </div>
  );
}
