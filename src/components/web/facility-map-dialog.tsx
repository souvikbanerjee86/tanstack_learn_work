import React, { useMemo, useState } from 'react'
import { Globe2, Layers, MapPin, Search, X } from 'lucide-react'
import { INDIA_MAP_REGIONS } from './india-map-data'
import type { IndiaStateRegion } from './india-map-data';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface FacilityMapDialogProps {
  locationString?: string | null
  jobTitle?: string
  jobId?: string
  trigger?: React.ReactNode
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function FacilityMapDialog({
  locationString,
  jobTitle,
  jobId,
  trigger,
  isOpen: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: FacilityMapDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const [hoveredRegion, setHoveredRegion] = useState<IndiaStateRegion | null>(
    null,
  )
  const [stateSearch, setStateSearch] = useState('')

  const isControlled = controlledOpen !== undefined
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen
  const setIsOpen = isControlled ? controlledOnOpenChange : setUncontrolledOpen

  // Parse location string into normalized list
  const activeLocations = useMemo(() => {
    if (!locationString) return []
    return locationString
      .split(/[,/|]+/)
      .map((s) => s.trim())
      .filter(Boolean)
  }, [locationString])

  const activeLocationsSet = useMemo(() => {
    return new Set(activeLocations.map((loc) => loc.toLowerCase()))
  }, [activeLocations])

  // Helper to check if a region is active
  const isRegionActive = (region: IndiaStateRegion) => {
    const stateLower = region.state.toLowerCase()
    const slugLower = region.slug.toLowerCase()

    if (
      activeLocationsSet.has(stateLower) ||
      activeLocationsSet.has(slugLower)
    ) {
      return true
    }

    // Check partial containment for variations (e.g. "Delhi" -> "NCT of Delhi")
    for (const loc of activeLocationsSet) {
      if (
        loc.length > 2 &&
        (stateLower.includes(loc) || loc.includes(stateLower))
      ) {
        return true
      }
    }
    return false
  }

  const activeRegions = useMemo(() => {
    return INDIA_MAP_REGIONS.filter(isRegionActive)
  }, [activeLocationsSet])

  // Filtered regions for sidebar list
  const filteredActiveRegions = useMemo(() => {
    if (!stateSearch.trim()) return activeRegions
    const q = stateSearch.toLowerCase()
    return activeRegions.filter(
      (r) =>
        r.state.toLowerCase().includes(q) || r.type.toLowerCase().includes(q),
    )
  }, [activeRegions, stateSearch])

  return (
    <>
      {trigger ? (
        <span
          onClick={(e) => {
            e.stopPropagation()
            setIsOpen?.(true)
          }}
          className="inline-flex cursor-pointer"
        >
          {trigger}
        </span>
      ) : null}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className={cn(
            'w-[95vw] sm:max-w-5xl md:max-w-6xl lg:max-w-7xl xl:max-w-310',
            'max-h-[92vh] flex flex-col p-0 overflow-hidden',
            'border border-zinc-200/80 dark:border-zinc-800',
            'bg-white/98 dark:bg-zinc-950/98 backdrop-blur-2xl shadow-2xl rounded-2xl sm:rounded-3xl gap-0',
          )}
        >
          {/* Header */}
          <div className="p-4 sm:p-6 pb-4 border-b border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40 shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pr-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl sm:rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-sm shrink-0">
                  <Globe2 className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle className="text-lg sm:text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 flex flex-wrap items-center gap-2">
                    Facility Deployment Map
                    {jobId && (
                      <Badge
                        variant="outline"
                        className="text-[10px] font-mono font-bold bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                      >
                        {jobId}
                      </Badge>
                    )}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-zinc-600 dark:text-zinc-400 font-medium mt-0.5">
                    {jobTitle ? (
                      <span>
                        Active locations for{' '}
                        <strong className="text-zinc-900 dark:text-zinc-100 font-bold">
                          {jobTitle}
                        </strong>
                      </span>
                    ) : (
                      'Active regional deployment hubs highlighted with green boundaries.'
                    )}
                  </DialogDescription>
                </div>
              </div>

              {/* Status summary pill */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <Badge
                  variant="outline"
                  className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 font-bold text-xs px-3 py-1 rounded-xl flex items-center gap-1.5 shadow-xs"
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.9)] animate-pulse" />
                  {activeLocations.length} Active Hub
                  {activeLocations.length === 1 ? '' : 's'}
                </Badge>
              </div>
            </div>

            {/* Active Locations Horizontal Pills Strip */}
            {activeLocations.length > 0 && (
              <div className="flex items-center gap-2 pt-3 overflow-x-auto scrollbar-none pb-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400 shrink-0 flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-emerald-500" />
                  Hubs:
                </span>
                <div className="flex items-center gap-1.5 flex-nowrap sm:flex-wrap">
                  {activeLocations.map((loc) => (
                    <Badge
                      key={loc}
                      className="font-bold text-[11px] whitespace-nowrap bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-lg flex items-center gap-1.5 transition-all shadow-xs"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {loc}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Map & Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto min-h-0">
            {/* SVG Interactive Map Canvas */}
            <div className="lg:col-span-8 p-3 sm:p-6 flex flex-col items-center justify-center bg-zinc-50/40 dark:bg-zinc-950/40 relative min-h-85 sm:min-h-115 lg:min-h-140">
              {/* Map Glow Filter Definition */}
              <svg className="w-0 h-0 absolute pointer-events-none">
                <defs>
                  <filter
                    id="emerald-glow"
                    x="-20%"
                    y="-20%"
                    width="140%"
                    height="140%"
                  >
                    <feDropShadow
                      dx="0"
                      dy="0"
                      stdDeviation="4"
                      floodColor="#10b981"
                      floodOpacity="0.8"
                    />
                  </filter>
                  <filter
                    id="emerald-glow-hover"
                    x="-30%"
                    y="-30%"
                    width="160%"
                    height="160%"
                  >
                    <feDropShadow
                      dx="0"
                      dy="0"
                      stdDeviation="7"
                      floodColor="#10b981"
                      floodOpacity="1"
                    />
                  </filter>
                </defs>
              </svg>

              {/* Map SVG container */}
              <div className="w-full max-w-155 aspect-1000/1100 relative flex items-center justify-center">
                <svg
                  viewBox="0 0 1000 1100"
                  className="w-full h-full drop-shadow-md select-none transition-all duration-300"
                  role="img"
                  aria-label="India Regional Facility Map"
                >
                  {INDIA_MAP_REGIONS.map((region) => {
                    const active = isRegionActive(region)
                    const isHovered = hoveredRegion?.id === region.id

                    return (
                      <path
                        key={region.id}
                        d={region.d}
                        onMouseEnter={() => setHoveredRegion(region)}
                        onMouseLeave={() => setHoveredRegion(null)}
                        className={cn(
                          'transition-all duration-300 cursor-pointer outline-none',
                          active
                            ? isHovered
                              ? 'fill-emerald-500/40 stroke-emerald-400 stroke-4 filter-[url(#emerald-glow-hover)]'
                              : 'fill-emerald-500/25 stroke-emerald-500 dark:stroke-emerald-400 stroke-[2.5] filter-[url(#emerald-glow)]'
                            : isHovered
                              ? 'fill-zinc-300/80 dark:fill-zinc-800 stroke-zinc-500 dark:stroke-zinc-400 stroke-[1.5]'
                              : 'fill-zinc-200/60 dark:fill-zinc-900/60 stroke-zinc-300 dark:stroke-zinc-700/80 stroke-[0.8]',
                        )}
                      >
                        <title>
                          {region.state} ({region.type})
                          {active ? ' - Active Facility Hub' : ''}
                        </title>
                      </path>
                    )
                  })}
                </svg>
              </div>

              {/* Floating Hover Info Card */}
              {hoveredRegion && (
                <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:min-w-70 p-3 rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-zinc-200 dark:border-zinc-700 shadow-2xl pointer-events-none animate-in fade-in zoom-in-95 duration-150 z-20">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-black text-xs text-zinc-900 dark:text-zinc-50 tracking-tight">
                      {hoveredRegion.state}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[9px] font-black uppercase tracking-wider px-2 py-0.5',
                        isRegionActive(hoveredRegion)
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 font-bold'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700',
                      )}
                    >
                      {isRegionActive(hoveredRegion)
                        ? 'Active Hub'
                        : hoveredRegion.type}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1 font-medium">
                    {isRegionActive(hoveredRegion)
                      ? 'Operational deployment hub assigned to this position.'
                      : 'Unassigned region for this requisition.'}
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar Hub List & Legend */}
            <div className="lg:col-span-4 p-4 sm:p-6 border-t lg:border-t-0 lg:border-l border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 flex flex-col justify-between gap-5 overflow-y-auto">
              <div className="space-y-4">
                {/* Search & Header */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                      Assigned States & UTs
                    </span>
                    <Badge
                      variant="secondary"
                      className="text-[10px] font-bold bg-zinc-200/70 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
                    >
                      {activeRegions.length} / 36 Identified
                    </Badge>
                  </div>

                  {/* Filter Search Input */}
                  {activeRegions.length > 3 && (
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                      <Input
                        value={stateSearch}
                        onChange={(e) => setStateSearch(e.target.value)}
                        placeholder="Filter active states..."
                        className="pl-8 pr-8 h-8 text-xs rounded-xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700"
                      />
                      {stateSearch && (
                        <button
                          onClick={() => setStateSearch('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-zinc-400 hover:text-zinc-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* State list */}
                <div className="space-y-2 max-h-55 sm:max-h-75 lg:max-h-90 overflow-y-auto pr-1">
                  {filteredActiveRegions.length > 0 ? (
                    filteredActiveRegions.map((region) => (
                      <div
                        key={region.id}
                        onMouseEnter={() => setHoveredRegion(region)}
                        onMouseLeave={() => setHoveredRegion(null)}
                        className={cn(
                          'p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2',
                          hoveredRegion?.id === region.id
                            ? 'bg-emerald-500/15 border-emerald-500/50 shadow-sm dark:bg-emerald-950/40'
                            : 'bg-white/80 dark:bg-zinc-900/60 border-zinc-200/80 dark:border-zinc-800 hover:bg-emerald-500/5 dark:hover:bg-zinc-800/60',
                        )}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.9)] shrink-0" />
                          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                            {region.state}
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono shrink-0">
                          {region.type === 'Union Territory' ? 'UT' : 'State'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-5 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 text-center space-y-1">
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                        {stateSearch
                          ? 'No matching states found.'
                          : 'No specific state boundaries identified for this location.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Legend & Guide */}
              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/90 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800 space-y-2 text-xs shadow-xs shrink-0">
                <span className="font-black text-[10px] uppercase tracking-widest text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-emerald-500" />
                  Map Guide
                </span>
                <div className="flex items-center gap-2.5">
                  <div className="h-4 w-4 rounded-md border-2 border-emerald-500 bg-emerald-500/25 shadow-[0_0_8px_rgba(16,185,129,0.5)] shrink-0" />
                  <span className="text-zinc-700 dark:text-zinc-300 text-[11px]">
                    <strong className="text-zinc-900 dark:text-zinc-100 font-bold">
                      Green Outline:
                    </strong>{' '}
                    Active Facility Hub
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="h-4 w-4 rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-200/50 dark:bg-zinc-800/50 shrink-0" />
                  <span className="text-zinc-600 dark:text-zinc-400 text-[11px]">
                    <strong className="text-zinc-800 dark:text-zinc-200">
                      Neutral Gray:
                    </strong>{' '}
                    Other Regions
                  </span>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
