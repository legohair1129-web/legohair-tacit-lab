interface MediaPlaceholderProps {
  label: string;
  kind?: "photo" | "video";
  aspect?: "portrait" | "square" | "wide" | "editorial";
  className?: string;
}

const ASPECT_CLASSES: Record<
  NonNullable<MediaPlaceholderProps["aspect"]>,
  string
> = {
  portrait: "aspect-[9/16]",
  square: "aspect-square",
  wide: "aspect-video",
  editorial: "aspect-[4/5]",
};

/**
 * Stands in for photo/video assets that don't exist yet, styled so the
 * finished composition (crop marks, caption, full-bleed frame) is already
 * legible - not a plain grey box. Always reserves its final aspect ratio
 * up front so nothing shifts (CLS) once real media replaces it here.
 */
export function MediaPlaceholder({
  label,
  kind = "photo",
  aspect = "editorial",
  className = "",
}: MediaPlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`relative overflow-hidden border border-[var(--ng-line)] bg-gradient-to-br from-[var(--ng-ivory-2)] to-[var(--ng-ivory)] ${ASPECT_CLASSES[aspect]} ${className}`}
    >
      {/* crop-mark corners */}
      <span className="absolute top-3 left-3 h-3 w-3 border-t border-l border-[var(--ng-line)]" aria-hidden />
      <span className="absolute right-3 bottom-3 h-3 w-3 border-r border-b border-[var(--ng-line)]" aria-hidden />

      <span
        aria-hidden
        className="absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--ng-line)] text-[10px] opacity-40"
      >
        {kind === "video" ? "▶" : "◇"}
      </span>

      <span className="ng-sans-en absolute bottom-3 left-3 text-[10px] font-medium tracking-[0.18em] uppercase opacity-45">
        {kind === "video" ? "video — " : "photo — "}
        {label}
      </span>
    </div>
  );
}
