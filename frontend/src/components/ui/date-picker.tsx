import React, { useState } from 'react'
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import * as Popover from '@radix-ui/react-popover'
import { cn } from '@/utils'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

interface Props {
  value: string // YYYY-MM-DD
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

const DatePicker: React.FC<Props> = ({ value, onChange, placeholder = 'Pick a date', className }) => {
  const parsed = value ? new Date(value + 'T00:00:00') : null
  const today = new Date()

  const [viewYear, setViewYear] = useState(parsed?.getFullYear() ?? today.getFullYear())
  const [viewMonth, setViewMonth] = useState(parsed?.getMonth() ?? today.getMonth())
  const [open, setOpen] = useState(false)

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay()

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const selectDay = (day: number) => {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    onChange(dateStr)
    setOpen(false)
  }

  const displayValue = parsed
    ? parsed.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  const isSelected = (day: number) =>
    !!parsed && parsed.getDate() === day && parsed.getMonth() === viewMonth && parsed.getFullYear() === viewYear

  const isToday = (day: number) =>
    today.getDate() === day && today.getMonth() === viewMonth && today.getFullYear() === viewYear

  const cells: (number | null)[] = Array.from(
    { length: firstDayOfMonth + daysInMonth },
    (_, i) => (i < firstDayOfMonth ? null : i - firstDayOfMonth + 1)
  )
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cn(
            'flex h-10 w-full items-center justify-between rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
            !displayValue && 'text-muted-foreground',
            className
          )}
        >
          <span>{displayValue ?? placeholder}</span>
          <CalendarIcon className="h-4 w-4 opacity-50 flex-shrink-0" />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="z-[200] w-[272px] rounded-2xl border border-slate-200 bg-white p-3 shadow-xl"
          align="start"
          sideOffset={6}
        >
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={prevMonth}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-sm font-bold">{MONTHS[viewMonth]} {viewYear}</span>
            <button
              type="button"
              onClick={nextMonth}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map(d => (
              <div key={d} className="h-8 flex items-center justify-center text-[11px] font-semibold text-muted-foreground">
                {d}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7">
            {cells.map((day, i) => (
              <div key={i} className="h-8 flex items-center justify-center">
                {day !== null && (
                  <button
                    type="button"
                    onClick={() => selectDay(day)}
                    className={cn(
                      'w-8 h-8 rounded-full text-sm transition-colors',
                      isSelected(day)
                        ? 'bg-primary text-white font-bold'
                        : isToday(day)
                        ? 'border border-primary text-primary font-semibold hover:bg-primary/10'
                        : 'hover:bg-muted text-foreground'
                    )}
                  >
                    {day}
                  </button>
                )}
              </div>
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

export default DatePicker
