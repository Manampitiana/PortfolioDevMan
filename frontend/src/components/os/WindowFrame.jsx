// Window chrome miverimberina (traffic-lights + title bar + breadcrumb any an-tampony)
// Azo ampiasaina any amin'ny page hafa (About, Skills, Projects...) rehefa hatao "OS style" ihany koa
export default function WindowFrame({ title, breadcrumb, children, className = '', bodyClassName = '' }) {
  return (
    <div className={`rounded-2xl overflow-hidden bg-neutral-900/90 backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)] ${className}`}>
      <div className="flex items-center gap-2 px-4 h-10 bg-white/[0.04] border-b border-white/10">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        {title && (
          <span className="flex-1 text-center text-xs font-medium text-neutral-300 -ml-8">{title}</span>
        )}
      </div>
      {breadcrumb && (
        <div className="px-4 py-2 text-[11px] font-mono text-neutral-500 border-b border-white/5">
          {breadcrumb}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}
