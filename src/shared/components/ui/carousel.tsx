import * as React from "react";
import { cn } from "@/shared/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  opts?: {
    align?: "start" | "center";
    loop?: boolean;
    initial?: number;
  };
  children: React.ReactNode;
}

const CarouselContext = React.createContext<{
  current: number;
  setCurrent: (idx: number) => void;
  count: number;
  align: "start" | "center";
  loop: boolean;
  itemWidth: number;
  setItemWidth: (w: number) => void;
} | null>(null);

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
  const sentinelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (sentinelRef.current) {
      setItemWidth(sentinelRef.current.offsetWidth);
    }
  }, [children, setItemWidth]);

  return (
    <div
      ref={ref}
      className={cn(
        "flex overflow-x-hidden touch-pan-x w-full",
        basis,
        className
      )}
      {...props}
    >
      <div
        ref={sentinelRef}
        className={cn(
          "flex-shrink-0",
          (children as any)?.[0]?.props?.className
        )}
        style={{
          visibility: "hidden",
          position: "absolute",
          pointerEvents: "none",
        }}
      >
        {React.isValidElement((children as any)?.[0])
          ? (children as any)[0].props.children
          : null}
      </div>
      {React.Children.map(children, (child) => child)}
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
  const translate = itemWidth ? -(current * itemWidth) : `-${current * 100}%`;
  return (
    <div
      ref={ref}
      className={cn("flex-shrink-0  transition-transform duration-500", className)}
      style={{
        transform: itemWidth
          ? `translateX(${translate}px)`
          : `translateX(${translate})`,
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
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "absolute -left-5 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow hover:bg-gray-100 border-blue-400 border-2 transition cursor-pointer",
        className
      )}
      onClick={() => {
        if (current > 0) setCurrent(current - 1);
        else if (loop) setCurrent(count - 1);
      }}
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
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "absolute -right-5 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow hover:bg-gray-100 border-blue-400 border-2 transition cursor-pointer",
        className
      )}
      onClick={() => {
        if (current < count - 2) setCurrent(current + 1);
        else if (loop) setCurrent(0);
      }}
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
