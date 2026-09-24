// Marca MateCode bicolor
// Mate en violeta humo, Code en verde menta claro. Solo identidad.

interface LogoProps {
    size?: "sm" | "md" | "lg";
}

export function Logo({ size = "md" }: LogoProps) {
    const textSize = size === "sm" ? "text-xl" : size === "lg" ? "text-3xl" : "text-2xl";
    return (
        <span className={`font-extrabold tracking-tight ${textSize}`}>
            <span className="bg-gradient-to-r from-violet-600 to-purple-400 bg-clip-text text-transparent">Mate</span>
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Code</span>
        </span>
    );
}
