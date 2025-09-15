import { Progress } from "@ark-ui/react/progress";
import { twJoin, twMerge } from "tailwind-merge";

// TODO: cva for size and variant
const sizeMap = {
    sm: { size: "32px", thickness: "4px", circleClass: "size-8", strokeWidth: 2, pingThickness: "2px" },
    md: { size: "48px", thickness: "7px", circleClass: "size-12", strokeWidth: 3, pingThickness: "3px" },
    lg: { size: "64px", thickness: "10px", circleClass: "size-16", strokeWidth: 4, pingThickness: "5px" },
};

interface SpinnerProps extends Progress.CircleProps {
    className?: string;
    variant?: "default" | "ping";
    size?: keyof typeof sizeMap;
}

export default function Spinner({
    className,
    variant = "default",
    size = "lg",
}: SpinnerProps) {
    const { size: cssSize, thickness, circleClass, strokeWidth, pingThickness } = sizeMap[size];

    return (
        <Progress.Root
            value={null}
            className={twJoin("flex flex-col items-center", variant === "ping" && "p-2")}
        >
            <Progress.Circle
                className={twMerge(
                    `${circleClass} animate-spin [--size:${cssSize}] [--thickness:${thickness}] overflow-visible`,
                    className
                )}
            >
                <Progress.CircleTrack
                    className="stroke-foreground/20"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                {variant === "ping" &&
                    <Progress.CircleRange
                        className={`stroke-primary animate-ping [--thickness:${pingThickness}]`}
                        strokeWidth={strokeWidth - 1}
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray="20"
                    />
                }
                <Progress.CircleRange
                    className="stroke-primary"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray="40"
                />
            </Progress.Circle>
        </Progress.Root>
    );
}
