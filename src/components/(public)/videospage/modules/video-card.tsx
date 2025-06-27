"use client"

import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface VideoCardProps {
  title: string
  channelName: string
  views: string
  uploadTime: string
  duration: string
  thumbnailUrl: string
  channelAvatar: string
  onClick?: () => void
}

export function VideoCard({
  title,
  channelName,
  views,
  uploadTime,
  duration,
  thumbnailUrl,
  channelAvatar,
  onClick,
}: VideoCardProps) {
  return (
    <div className="flex flex-col space-y-3 cursor-pointer group" onClick={onClick}>
      <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
        <Image
          src={thumbnailUrl || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="24" fill="black" fillOpacity="0.6" />
            <polygon points="20,16 34,24 20,32" fill="white" />
          </svg>
        </div>
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1.5 py-0.5 rounded">
          {duration}
        </div>
      </div>
      <div className="flex space-x-2 sm:space-x-3">
        <Avatar className="w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0">
          <AvatarImage src={channelAvatar || "/placeholder.svg"} alt={channelName} />
          <AvatarFallback>{channelName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm sm:text-base line-clamp-2 text-gray-900 group-hover:text-gray-700">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">{channelName}</p>
          <p className="text-xs sm:text-sm text-gray-600">
            {views} • {uploadTime}
          </p>
        </div>
      </div>
    </div>
  )
}
