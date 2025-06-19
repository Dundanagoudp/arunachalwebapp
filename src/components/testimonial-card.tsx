import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Quote } from "lucide-react"

interface TestimonialCardProps {
  name: string
  designation: string
  quote: string
  avatarSrc?: string
}

export function TestimonialCard({ name, designation, quote, avatarSrc }: TestimonialCardProps) {
  return (
    <Card className="bg-card-bg text-white rounded-lg shadow-lg border-none">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={avatarSrc || "/placeholder.svg"} alt={`${name}'s avatar`} />
            <AvatarFallback>
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg">{name}</h3>
            <p className="text-sm text-gray-300">{designation}</p>
          </div>
        </div>
        <div className="relative">
          <Quote className="absolute -top-2 left-0 w-8 h-8 text-accent-yellow" />
          <p className="text-base leading-relaxed pl-8 pr-4">{quote}</p>
          <Quote className="absolute -bottom-2 right-0 w-8 h-8 text-accent-yellow rotate-180" />
        </div>
      </CardContent>
    </Card>
  )
}
