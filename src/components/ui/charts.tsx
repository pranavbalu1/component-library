import * as React from 'react';
import { ArrowUpRight, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ==========================================================================
   COLOR MAPPER HELPER
   ========================================================================== */
function parseColorStyle(colorClass: string) {
  if (colorClass.startsWith('#') || colorClass.startsWith('rgb')) {
    return {
      bg: colorClass,
      textStyle: { color: colorClass },
      borderStyle: { borderColor: colorClass },
    };
  }

  const arbitraryMatch = colorClass.match(/bg-\[(#[a-fA-F0-9]+|rgb\(.*?\))\]/);
  if (arbitraryMatch) {
    const value = arbitraryMatch[1];
    return {
      bg: value,
      textStyle: { color: value },
      borderStyle: { borderColor: value },
    };
  }

  const colorMap: Record<string, string> = {
    'bg-rose-500': '#f43f5e',
    'bg-emerald-400': '#34d399',
    'bg-cyan-400': '#22d3ee',
    'bg-blue-500': '#3b82f6',
    'bg-purple-500': '#a855f7',
  };

  const hex = colorMap[colorClass] || '#e6ff4b';
  return {
    bg: hex,
    textStyle: { color: hex },
    borderStyle: { borderColor: hex },
  };
}

/* ==========================================================================
   1. STACKED BAR GRAPH
   ========================================================================== */
export interface StackSegment {
  key: string;
  label?: string;
  value: number;
  color: string;
}

export interface StackedColumn {
  label: string;
  segments: StackSegment[];
}

export interface StackedBarGraphProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  data: StackedColumn[];
  timeframeData?: Record<string, StackedColumn[]>;
  legend?: { label: string; color: string }[];
  timeframeOptions?: string[];
  defaultTimeframe?: string;
  onTimeframeChange?: (timeframe: string) => void;
  cornerRadius?: string | number;
  onActionClick?: () => void;
}

export function StackedBarGraph({
  className,
  title = 'Budget',
  data = [],
  timeframeData,
  legend = [
    { label: 'Income', color: 'bg-[#e6ff4b]' },
    { label: 'Spent', color: 'bg-[#b0cc29]' },
    { label: 'Scheduled', color: 'bg-[#6d8218]' },
    { label: 'Savings', color: 'bg-[#42500d]' },
  ],
  timeframeOptions = ['Monthly', 'Quarterly', 'Yearly'],
  defaultTimeframe = 'Monthly',
  onTimeframeChange,
  cornerRadius = 4,
  onActionClick,
  ...props
}: StackedBarGraphProps) {
  const [selectedTimeframe, setSelectedTimeframe] =
    React.useState(defaultTimeframe);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const [selectedIndex, setSelectedIndex] = React.useState<number>(1);
  const [hoveredColIndex, setHoveredColIndex] = React.useState<number | null>(
    null,
  );

  const [cursorPos, setCursorPos] = React.useState<{
    x: number;
    y: number;
  } | null>(null);
  const [hoveredSegment, setHoveredSegment] = React.useState<{
    key: string;
    value: number;
    color: string;
  } | null>(null);

  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const activeData = React.useMemo(() => {
    if (timeframeData && timeframeData[selectedTimeframe]) {
      return timeframeData[selectedTimeframe];
    }
    return data;
  }, [data, timeframeData, selectedTimeframe]);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const maxStackValue = React.useMemo(() => {
    if (!activeData.length) return 6000;
    const highestTotal = Math.max(
      ...activeData.map((col) =>
        col.segments.reduce((acc, s) => acc + s.value, 0),
      ),
    );
    return Math.max(highestTotal * 1.25, 1000);
  }, [activeData]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleTimeframeSelect = (option: string) => {
    setSelectedTimeframe(option);
    setIsDropdownOpen(false);
    setSelectedIndex(0);
    onTimeframeChange?.(option);
  };

  const getRadiusStyle = (position: 'top' | 'bottom' | 'middle' | 'single') => {
    const r =
      typeof cornerRadius === 'number' ? `${cornerRadius}px` : cornerRadius;

    if (position === 'single') return { borderRadius: r };
    if (position === 'top') return { borderRadius: `${r} ${r} 2px 2px` };
    if (position === 'bottom') return { borderRadius: `2px 2px ${r} ${r}` };
    return { borderRadius: '2px' };
  };

  return (
    <div
      className={cn(
        'relative w-full rounded-3xl bg-[#121214] border border-border/40 p-6 text-foreground select-none flex flex-col justify-between',
        className,
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setHoveredSegment(null);
        setHoveredColIndex(null);
        setCursorPos(null);
      }}
      {...props}
    >
      {/* Tooltip */}
      {hoveredSegment &&
        cursorPos &&
        (() => {
          const segColorProps = parseColorStyle(hoveredSegment.color);
          return (
            <div
              className="pointer-events-none absolute z-50 bg-zinc-900/95 backdrop-blur-md border text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-2xl transition-all duration-75 -translate-x-1/2 -translate-y-12 flex items-center gap-2"
              style={{
                left: `${cursorPos.x}px`,
                top: `${cursorPos.y}px`,
                borderColor: segColorProps.bg,
              }}
            >
              <span
                className="size-2 rounded-full shrink-0"
                style={{ backgroundColor: segColorProps.bg }}
              />
              <span className="capitalize text-zinc-300 font-medium">
                {hoveredSegment.key}:
              </span>
              <span style={segColorProps.textStyle}>
                ${hoveredSegment.value.toLocaleString()}
              </span>
            </div>
          );
        })()}

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold tracking-tight text-white">{title}</h3>
        <div className="flex items-center gap-2">
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors"
            >
              <span>{selectedTimeframe}</span>
              <ChevronDown
                className={cn(
                  'size-3.5 transition-transform duration-200',
                  isDropdownOpen && 'rotate-180',
                )}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 z-50 rounded-2xl bg-zinc-900 border border-zinc-800 p-1.5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                {timeframeOptions.map((option) => {
                  const isSelected = option === selectedTimeframe;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleTimeframeSelect(option)}
                      className={cn(
                        'w-full flex items-center justify-between text-left text-xs px-2.5 py-1.5 rounded-xl transition-colors',
                        isSelected
                          ? 'bg-zinc-800 text-white font-semibold'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50',
                      )}
                    >
                      <span>{option}</span>
                      {isSelected && (
                        <Check className="size-3.5 text-[#e6ff4b]" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {onActionClick && (
            <button
              type="button"
              onClick={onActionClick}
              className="size-8 rounded-full bg-zinc-800/80 hover:bg-zinc-700 flex items-center justify-center text-white transition-transform active:scale-95"
            >
              <ArrowUpRight className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Bar Chart */}
      <div className="relative flex items-stretch gap-4 h-60 pt-6 my-2">
        <div className="flex flex-col justify-between text-[11px] font-medium text-zinc-500 py-1 pr-1 shrink-0">
          <span>{Math.round(maxStackValue / 1000)}k</span>
          <span>{Math.round((maxStackValue * 0.66) / 1000)}k</span>
          <span>{Math.round((maxStackValue * 0.33) / 1000)}k</span>
          <span>0</span>
        </div>

        <div className="flex-1 flex items-end justify-between gap-3 h-full px-2">
          {activeData.map((col, colIdx) => {
            const isSelected = selectedIndex === colIdx;
            const isHoveredCol = hoveredColIndex === colIdx;
            const totalVal = col.segments.reduce((acc, s) => acc + s.value, 0);
            const totalHeightPercent = Math.min(
              (totalVal / maxStackValue) * 100,
              100,
            );

            const topSegment = col.segments[col.segments.length - 1];
            const topColorStyle = topSegment
              ? parseColorStyle(topSegment.color)
              : parseColorStyle('#e6ff4b');

            const showHighlight =
              isHoveredCol || (isSelected && hoveredColIndex === null);

            return (
              <div
                key={colIdx}
                onClick={() => setSelectedIndex(colIdx)}
                onMouseEnter={() => setHoveredColIndex(colIdx)}
                className="group relative flex-1 flex flex-col items-center justify-end h-full cursor-pointer"
              >
                {showHighlight && (
                  <div
                    className="absolute flex flex-col items-center z-20 animate-in fade-in zoom-in-95 duration-150 transition-all pointer-events-none"
                    style={{ bottom: `calc(${totalHeightPercent}% + 22px)` }}
                  >
                    <span
                      className="text-xs font-extrabold tracking-tight whitespace-nowrap drop-shadow-md"
                      style={topColorStyle.textStyle}
                    >
                      ${totalVal.toLocaleString()}
                    </span>
                    <span
                      className="size-2 rounded-full border-2 border-[#121214] mt-1 shadow-sm"
                      style={{ backgroundColor: topColorStyle.bg }}
                    />
                  </div>
                )}

                <div
                  className="w-full max-w-[52px] flex flex-col justify-end transition-all duration-300"
                  style={{ height: `${totalHeightPercent}%` }}
                >
                  <div className="w-full h-full flex flex-col-reverse gap-[2px]">
                    {col.segments.map((seg, segIdx) => {
                      const segmentPercent =
                        totalVal > 0 ? (seg.value / totalVal) * 100 : 0;
                      const isTop = segIdx === col.segments.length - 1;
                      const isBottom = segIdx === 0;
                      const pos =
                        isTop && isBottom
                          ? 'single'
                          : isTop
                            ? 'top'
                            : isBottom
                              ? 'bottom'
                              : 'middle';

                      return (
                        <div
                          key={segIdx}
                          onMouseEnter={(e) => {
                            e.stopPropagation();
                            setHoveredSegment({
                              key: seg.key,
                              value: seg.value,
                              color: seg.color,
                            });
                          }}
                          className={cn(
                            'w-full transition-all duration-200 cursor-pointer hover:brightness-125',
                            seg.color,
                          )}
                          style={{
                            height: `${segmentPercent}%`,
                            ...getRadiusStyle(pos),
                          }}
                        />
                      );
                    })}
                  </div>
                </div>

                <span
                  className={cn(
                    'text-xs font-medium mt-3 transition-colors shrink-0',
                    isSelected || isHoveredCol
                      ? 'text-white font-bold'
                      : 'text-zinc-500',
                  )}
                >
                  {col.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Legend */}
      {legend && (
        <div className="flex items-center justify-center gap-4 flex-wrap pt-3 border-t border-zinc-800/60 mt-2 text-xs">
          {legend.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className={cn('size-2 rounded-full', item.color)} />
              <span className="text-zinc-400 font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   2. SEMI-GAUGE GRAPH
   ========================================================================== */
export interface SpendingCategory {
  label: string;
  percentage: number;
  color: string;
}

export interface SemiGaugeGraphProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  amount: string | number;
  categories?: SpendingCategory[];
  onActionClick?: () => void;
}

export function SemiGaugeGraph({
  className,
  title = 'Top spending',
  amount = '$789',
  categories = [
    { label: 'Auto & Transport', percentage: 40, color: '#00bdf9' },
    { label: 'Food', percentage: 25, color: '#e6ff4b' },
    { label: 'Clothes', percentage: 20, color: '#03d791' },
    { label: 'Other', percentage: 15, color: '#ffffff' },
  ],
  onActionClick,
  ...props
}: SemiGaugeGraphProps) {
  const [activeIndex, setActiveIndex] = React.useState<number>(0);

  const cx = 100;
  const cy = 95;
  const r = 70;
  const innerR = 42;

  let currentAngle = Math.PI;

  const getCoordinates = (radius: number, angleRad: number) => ({
    x: cx + radius * Math.cos(angleRad),
    y: cy - radius * Math.sin(angleRad),
  });

  return (
    <div
      className={cn(
        'w-full rounded-3xl bg-[#121214] border border-border/40 p-6 text-foreground select-none flex flex-col justify-between',
        className,
      )}
      {...props}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-bold tracking-tight text-white">{title}</h3>
        {onActionClick && (
          <button
            type="button"
            onClick={onActionClick}
            className="size-8 rounded-full bg-zinc-800/80 hover:bg-zinc-700 flex items-center justify-center text-white transition-transform active:scale-95"
          >
            <ArrowUpRight className="size-4" />
          </button>
        )}
      </div>

      {/* Upward Arching Arc */}
      <div className="relative flex flex-col items-center justify-center my-2 h-44">
        <svg
          viewBox="0 0 200 115"
          className="w-full max-w-[220px] overflow-visible"
        >
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            fill="none"
            stroke="#27272a"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {categories.map((cat, idx) => {
            const gap = 0.05;
            const segAngle = (cat.percentage / 100) * Math.PI;
            const startAngle = currentAngle - gap / 2;
            const endAngle = currentAngle - segAngle + gap / 2;

            currentAngle -= segAngle;
            const isHovered = activeIndex === idx;

            if (isHovered) {
              const outerStart = getCoordinates(r + 6, startAngle);
              const outerEnd = getCoordinates(r + 6, endAngle);
              const innerStart = getCoordinates(innerR, startAngle);
              const innerEnd = getCoordinates(innerR, endAngle);

              const wedgeD = [
                `M ${outerStart.x} ${outerStart.y}`,
                `A ${r + 6} ${r + 6} 0 0 1 ${outerEnd.x} ${outerEnd.y}`,
                `L ${innerEnd.x} ${innerEnd.y}`,
                `A ${innerR} ${innerR} 0 0 0 ${innerStart.x} ${innerStart.y}`,
                `Z`,
              ].join(' ');

              return (
                <path
                  key={idx}
                  d={wedgeD}
                  fill={cat.color}
                  fillOpacity="0.22"
                  stroke={cat.color}
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setActiveIndex(idx)}
                />
              );
            }

            const start = getCoordinates(r, startAngle);
            const end = getCoordinates(r, endAngle);
            const arcD = `M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${end.x} ${end.y}`;

            return (
              <path
                key={idx}
                d={arcD}
                fill="none"
                stroke={cat.color}
                strokeWidth="3.5"
                strokeLinecap="round"
                className="cursor-pointer hover:stroke-white transition-all duration-200"
                onMouseEnter={() => setActiveIndex(idx)}
              />
            );
          })}
        </svg>

        {/* Amount Centerpiece */}
        <div className="absolute bottom-2 text-center pointer-events-none">
          <span className="text-3xl font-extrabold tracking-tight text-white">
            {typeof amount === 'number' ? `$${amount}` : amount}
          </span>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="space-y-2 mt-2 pt-2 border-t border-zinc-800/60 max-h-40 overflow-y-auto pr-1">
        {categories.map((cat, idx) => {
          const isSelected = activeIndex === idx;

          return (
            <div
              key={idx}
              onMouseEnter={() => setActiveIndex(idx)}
              className={cn(
                'flex items-center justify-between text-xs px-1.5 py-1 rounded-lg cursor-pointer transition-colors',
                isSelected ? 'bg-zinc-800/60' : 'hover:bg-zinc-800/30',
              )}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="size-2 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span
                  className={cn(
                    'font-medium transition-colors',
                    isSelected ? 'text-white font-bold' : 'text-zinc-300',
                  )}
                >
                  {cat.label}
                </span>
              </div>
              <span
                className={cn(
                  'font-bold transition-colors',
                  isSelected ? 'text-white' : 'text-zinc-400',
                )}
              >
                {cat.percentage}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
