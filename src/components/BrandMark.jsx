export default function BrandMark({ compact = false, light = false }) {
    return (
        <div className={`flex items-center ${compact ? "gap-2" : "gap-3"}`}>
            <div className={`${compact ? "h-10 w-10" : "h-16 w-16"} relative shrink-0 rounded-2xl bg-gradient-to-br from-primary via-blue-600 to-sky shadow-lg ring-2 ring-white/20`}>
                <div className="absolute left-2 right-2 top-2 h-6 rounded-t-full border-[5px] border-sky-200 border-b-0" />
                <div className="absolute bottom-3 left-2 right-1 h-4 -rotate-12 rounded-full border-t-[5px] border-white" />
                <div className="absolute bottom-2 right-2 h-5 w-2 -rotate-12 rounded-full bg-sunshine" />
                <div className="absolute right-3 top-4 h-1 w-5 rotate-45 rounded-full bg-secondary" />
                <div className="absolute right-5 top-5 h-2 w-2 rounded-full bg-secondary" />
            </div>
            <div>
                <p className={`${compact ? "text-xl" : "text-4xl"} font-black leading-none tracking-tight ${light ? "text-white" : "text-primary"}`}>
                    NAMU
                </p>
                <p className={`${compact ? "text-[10px]" : "text-sm"} font-black uppercase tracking-[0.18em] ${light ? "text-gold" : "text-secondary"}`}>
                    Driving School
                </p>
            </div>
        </div>
    );
}
