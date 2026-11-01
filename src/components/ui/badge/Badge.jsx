export function CustomBadge({ color = "" , title }){
    return (
        <span
        className={`${color} inline-flex items-center gap-1.5 
        rounded-full font-semibold px-2.5 py-0.5 text-xs`}
        style={{
            background: `color-mix(in srgb, ${color} 16%, transparent)`,
            color: color,
        }}
        title={title}
        >
        {title || "-"}
        </span>
    );
}