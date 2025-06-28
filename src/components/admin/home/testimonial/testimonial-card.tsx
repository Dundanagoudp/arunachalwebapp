"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Quote } from "lucide-react"
import type { Testimonial } from "@/types/testimonial-types"

interface TestimonialCardProps {
  testimonial: Testimonial
  onEdit: (testimonial: Testimonial) => void
  onDelete: (id: string) => void
}

export function TestimonialCard({ testimonial, onEdit, onDelete }: TestimonialCardProps) {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex flex-col h-full">
          {/* Quote Icon */}
          <div className="flex justify-between items-start mb-4">
            <Quote className="w-8 h-8 text-primary/20" />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(testimonial)} className="h-8 w-8 p-0">
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(testimonial._id)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Testimonial Text */}
          <blockquote className="text-sm text-muted-foreground mb-4 flex-1 italic">"{testimonial.name}"</blockquote>

          {/* Customer Info */}
          <div className="flex items-center gap-3 mt-auto">
            <Avatar className="w-10 h-10">
              <AvatarImage src={testimonial.image_url || "/placeholder.svg"} alt={testimonial.about} />
              <AvatarFallback>
                {testimonial.about
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{testimonial.about}</p>
              <Badge variant="secondary" className="text-xs">
                {testimonial.description}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
