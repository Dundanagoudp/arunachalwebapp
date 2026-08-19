"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { XIcon } from "lucide-react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { TeamMember } from "@/types/team-types"
import { getMediaUrl } from "@/utils/mediaUrl"
import { cn } from "@/lib/utils"

interface TeamMemberModalProps {
  isOpen: boolean
  onClose: () => void
  member: TeamMember | null
  loading?: boolean
}

function normalizeText(value?: string) {
  return (value || "").trim().toLowerCase()
}

function shouldShowReadMore(description: string) {
  const trimmed = description.trim()
  if (trimmed.length > 260) return true
  return trimmed.split("\n").filter(Boolean).length > 5
}

export default function TeamMemberModal({ isOpen, onClose, member, loading }: TeamMemberModalProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsExpanded(false)
      onClose()
    }
  }

  const showDesignation = useMemo(
    () => !!member?.designation && normalizeText(member.designation) !== normalizeText(member.title),
    [member?.designation, member?.title]
  )

  const showDescription = useMemo(
    () =>
      !!member?.description &&
      normalizeText(member.description) !== normalizeText(member.title) &&
      normalizeText(member.description) !== normalizeText(member.designation),
    [member?.description, member?.designation, member?.title]
  )

  const description = member?.description?.trim() || ""
  const canExpand = showDescription && shouldShowReadMore(description)

  const logoCardClassName = cn(
    "flex shrink-0 items-center justify-center rounded-[16px] border border-gray-200/80 bg-white",
    "shadow-[0_4px_20px_-6px_rgba(15,23,42,0.14)]",
    "h-[150px] w-[150px] sm:h-[160px] sm:w-[160px] md:h-[180px] md:w-[180px]"
  )

  const logoImageClassName =
    "relative h-[130px] w-[130px] sm:h-[138px] sm:w-[138px] md:h-[158px] md:w-[158px] overflow-hidden rounded-xl bg-[#FAFAF8]"

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "w-[calc(100%-1.25rem)] max-w-[880px] gap-0 overflow-hidden rounded-[18px] border border-gray-200/80 bg-[#FFFAEE] p-0",
          "shadow-[0_24px_60px_-16px_rgba(15,23,42,0.22)]",
          "duration-300 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "sm:w-[calc(100%-2rem)]"
        )}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>
            {loading ? "Loading team member" : member?.title ?? "Team member details"}
          </DialogTitle>
          <DialogDescription>
            {loading
              ? "Loading team member profile"
              : member?.designation || member?.description || "Team member profile details"}
          </DialogDescription>
        </DialogHeader>

        <DialogClose
          className={cn(
            "absolute right-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-full",
            "border border-gray-200 bg-white/95 text-gray-600 shadow-sm",
            "transition-all hover:border-gray-300 hover:bg-white hover:text-gray-900",
            "focus:outline-none focus:ring-2 focus:ring-[#1A3FA9]/20 focus:ring-offset-2 focus:ring-offset-[#FFFAEE]",
            "sm:right-4 sm:top-4"
          )}
        >
          <XIcon className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>

        <div className="flex max-h-[min(88vh,720px)] flex-col md:flex-row">
          {loading ? (
            <>
              <div className="flex shrink-0 items-center justify-center border-b border-gray-200/70 bg-[#F5F1E8] px-6 py-8 md:w-[42%] md:border-b-0 md:border-r md:px-8 md:py-10">
                <div className={cn(logoCardClassName, "animate-pulse bg-white/80")}>
                  <div className={cn(logoImageClassName, "rounded-xl bg-gray-200/80")} />
                </div>
              </div>
              <div className="flex min-h-0 flex-1 flex-col gap-4 p-6 pt-14 md:w-[58%] md:p-8 md:pt-8">
                <div className="h-8 w-3/5 animate-pulse rounded-lg bg-gray-200" />
                <div className="h-4 w-2/5 animate-pulse rounded bg-gray-100" />
                <div className="mt-2 space-y-2.5">
                  <div className="h-3.5 w-full animate-pulse rounded bg-gray-100" />
                  <div className="h-3.5 w-full animate-pulse rounded bg-gray-100" />
                  <div className="h-3.5 w-11/12 animate-pulse rounded bg-gray-100" />
                  <div className="h-3.5 w-4/5 animate-pulse rounded bg-gray-100" />
                </div>
              </div>
            </>
          ) : member ? (
            <>
              <div className="flex shrink-0 items-center justify-center border-b border-gray-200/70 bg-[#F5F1E8] px-6 py-8 md:w-[42%] md:border-b-0 md:border-r md:px-8 md:py-10">
                <div className={logoCardClassName}>
                  <div className={logoImageClassName}>
                    {member.image_url ? (
                      <Image
                        src={getMediaUrl(member.image_url)}
                        alt={member.title}
                        fill
                        sizes="(max-width: 768px) 130px, 158px"
                        className="object-contain object-center"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-gray-400 font-bilo sm:text-sm">
                        No photo
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex min-h-0 flex-1 flex-col p-6 pt-14 md:w-[58%] md:p-8 md:pt-8">
                <div className="mb-5 shrink-0 pr-10 text-center md:pr-12 md:text-left">
                  <h2
                    className="text-[1.625rem] font-bold leading-tight tracking-tight font-dm-serif sm:text-[1.75rem] md:text-[2rem]"
                    style={{ color: "#1A3FA9" }}
                  >
                    {member.title}
                  </h2>
                  {showDesignation && (
                    <p className="mt-2 text-[15px] font-medium leading-snug text-[#E91E8C] font-bilo sm:text-base">
                      {member.designation}
                    </p>
                  )}
                </div>

                <div className="min-h-0 flex-1">
                  {showDescription ? (
                    <div className="flex h-full min-h-0 flex-col">
                      <div
                        className={cn(
                          "relative transition-[max-height] duration-300 ease-in-out",
                          isExpanded
                            ? "max-h-[min(42vh,340px)] overflow-y-auto pr-1 speaker-modal-scrollbar"
                            : canExpand
                              ? "max-h-[9.75rem] overflow-hidden"
                              : "max-h-none"
                        )}
                      >
                        <div className="max-w-[52ch] space-y-4">
                          {description.split(/\n{2,}/).map((paragraph, index) => (
                            <p
                              key={index}
                              className="whitespace-pre-line text-left text-[15px] leading-[1.7] text-gray-700 font-bilo sm:text-base"
                            >
                              {paragraph.trim()}
                            </p>
                          ))}
                        </div>

                        {!isExpanded && canExpand && (
                          <div
                            aria-hidden
                            className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#FFFAEE] via-[#FFFAEE]/90 to-transparent"
                          />
                        )}
                      </div>

                      {canExpand && (
                        <button
                          type="button"
                          onClick={() => setIsExpanded((prev) => !prev)}
                          className={cn(
                            "mt-4 inline-flex w-fit items-center rounded-[10px] px-4 py-2.5",
                            "text-sm font-semibold text-[#1A3FA9] font-bilo",
                            "border border-[#1A3FA9]/15 bg-[#1A3FA9]/[0.06]",
                            "transition-colors hover:border-[#1A3FA9]/25 hover:bg-[#1A3FA9]/10",
                            "focus:outline-none focus:ring-2 focus:ring-[#1A3FA9]/20 focus:ring-offset-2 focus:ring-offset-[#FFFAEE]"
                          )}
                        >
                          {isExpanded ? "Read Less" : "Read More"}
                        </button>
                      )}
                    </div>
                  ) : (
                    <p className="max-w-[52ch] text-left text-[15px] leading-[1.7] text-gray-500 font-bilo sm:text-base">
                      Profile details will appear here once added by the admin team.
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}
