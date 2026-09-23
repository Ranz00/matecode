// Marca MateCode en gradiente púrpura
// Solo identidad, sin título de vista

interface LogoProps {
    size?: "sm" | "md" | "lg";
}

export function Logo({ size = "md" }: LogoProps) {
    const textSize = size === "sm" ? "text-xl" : size === "lg" ? "text-3xl" : "text-2xl";
    return (
        <span className={`font-extrabold tracking-tight bg-gradient-to-r from-violet-600 to-purple-400 bg-clip-text text-transparent ${textSize}`}>
            MateCode
        </span>
    );
}
