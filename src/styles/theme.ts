// Clases Tailwind compartidas, un solo lugar para el look
// Marca violeta con peligro sutil en outline, lista para dark

export const pageClass =
    "flex min-h-screen items-center justify-center bg-slate-100 px-4 dark:bg-slate-950";

export const cardClass =
    "w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200 dark:border-white/10 dark:bg-slate-900 dark:shadow-black/40";

export const formClass = "flex flex-col gap-4";

export const labelClass =
    "mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200";

export const inputClass =
    "w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-100";

export const primaryBtnClass =
    "w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-500 px-4 py-2.5 font-medium text-white shadow-md shadow-violet-600/20 transition hover:from-violet-500 hover:to-purple-400 active:scale-[.98] disabled:opacity-50 disabled:active:scale-100";

export const dangerBtnClass =
    "flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50";

export const errorClass =
    "mb-4 rounded-md bg-red-100 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300";

export const linkClass = "text-violet-600 underline dark:text-violet-400";

export const smallPrimaryBtnClass =
    "rounded-lg bg-violet-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-violet-700 disabled:opacity-50";

export const smallDangerBtnClass =
    "rounded-lg border border-red-500/60 bg-transparent px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-500/10 disabled:opacity-50 dark:text-red-400";

export const smallGrayBtnClass =
    "rounded-lg bg-slate-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-slate-600 disabled:opacity-50";
