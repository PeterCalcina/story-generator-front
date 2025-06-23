import * as React from "react";
import { cn } from "@/shared/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const CarouselContext = React.createContext<{
  current: number;
  setCurrent: (idx: number) => void;
  count: number;
  align: "start" | "center";
  loop: boolean;
  itemWidth: number;
  setItemWidth: (w: number) => void;
} | null>(null);

interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  opts?: {
    align?: "start" | "center";
    loop?: boolean;
    initial?: number;
  };
  children: React.ReactNode;
}

const CarouselRoot = React.forwardRef<HTMLDivElement, CarouselProps>(
  ({ className, opts, children, ...props }, ref) => {
    const [current, setCurrent] = React.useState(opts?.initial ?? 0);
    const [itemWidth, setItemWidth] = React.useState(0);

    let count = 0;
    React.Children.forEach(children, (child: any) => {
      if (child?.type?.displayName === "CarouselContent") {
        count = React.Children.count(child.props.children);
      }
    });

    return (
      <CarouselContext.Provider
        value={{
          current,
          setCurrent,
          count,
          align: opts?.align ?? "center",
          loop: opts?.loop ?? false,
          itemWidth,
          setItemWidth,
        }}
      >
        <div ref={ref} className={cn("relative", className)} {...props}>
          {children}
        </div>
      </CarouselContext.Provider>
    );
  }
);
CarouselRoot.displayName = "CarouselRoot";

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const ctx = React.useContext(CarouselContext);
  if (!ctx) throw new Error("CarouselContent must be used within Carousel");
  const { align, setItemWidth } = ctx;
  const basis = align === "center" ? "justify-center" : "justify-start";

  const contentRef = React.useRef<HTMLDivElement>(null);

  const firstItemRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    const measureWidths = () => {
      if (firstItemRef.current) {
        setItemWidth(firstItemRef.current.offsetWidth);
      }
    };

    measureWidths();

    window.addEventListener("resize", measureWidths);
    return () => window.removeEventListener("resize", measureWidths);
  }, [children, setItemWidth]);

  return (
    <div
      ref={ref || contentRef}
      className={cn(
        "flex overflow-x-hidden touch-pan-x w-full mx-auto",
        basis,
        className
      )}
      {...props}
    >
      {React.Children.map(children, (child, index) => {
        if (index === 0 && React.isValidElement(child)) {
          return React.cloneElement(child, {
            ref: firstItemRef,
            ...child.props as any,
          });
        }
        return child;
      })}
    </div>
  );
});
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const ctx = React.useContext(CarouselContext);
  if (!ctx) throw new Error("CarouselItem must be used within Carousel");
  const { itemWidth, current } = ctx;

  const translate = itemWidth ? -(current * itemWidth) : 0;

  return (
    <div
      ref={ref}
      className={cn(
        "flex-shrink-0 transition-transform duration-500",
        className
      )}
      style={{
        transform: `translateX(${translate}px)`,
      }}
      {...props}
    >
      {children}
    </div>
  );
});
CarouselItem.displayName = "CarouselItem";

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const ctx = React.useContext(CarouselContext);
  if (!ctx) throw new Error("CarouselPrevious must be used within Carousel");
  const { current, setCurrent, count, loop } = ctx;

  const isAtStart = current === 0;

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "absolute -left-5 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow hover:bg-gray-100 border-blue-400 border-2 transition cursor-pointer",
        {
          "opacity-50 cursor-not-allowed": !loop && isAtStart,
        },
        className
      )}
      onClick={() => {
        if (current > 0) {
          setCurrent(current - 1);
        } else if (loop) {
          setCurrent(count - 1);
        }
      }}
      disabled={!loop && isAtStart}
      aria-label="Anterior"
      {...props}
    >
      <ChevronLeftIcon className="w-6 h-6" />
    </button>
  );
});
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const ctx = React.useContext(CarouselContext);
  if (!ctx) throw new Error("CarouselNext must be used within Carousel");
  const { current, setCurrent, count, loop } = ctx;

  const isAtEnd = current === count - 2;

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "absolute -right-5 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow hover:bg-gray-100 border-blue-400 border-2 transition cursor-pointer",
        {
          "opacity-50 cursor-not-allowed": !loop && isAtEnd,
        },
        className
      )}
      onClick={() => {
        if (current < count - 2) {
          setCurrent(current + 1);
        } else if (loop) {
          setCurrent(0);
        }
      }}
      disabled={!loop && isAtEnd}
      aria-label="Siguiente"
      {...props}
    >
      <ChevronRightIcon className="w-6 h-6" />
    </button>
  );
});
CarouselNext.displayName = "CarouselNext";

export const Carousel = {
  Root: CarouselRoot,
  Content: CarouselContent,
  Item: CarouselItem,
  Previous: CarouselPrevious,
  Next: CarouselNext,
};