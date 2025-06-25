import apiClient from "@/apiClient"
import type {
  Event,
  EventDay,
  EventTime,
  CreateEventData,
  AddTimeData,
  EventWithDays,
  ApiResponse,
} from "@/types/events-types"

// Add Event - First step in the flow
export async function addEvent(data: CreateEventData): Promise<ApiResponse<Event>> {
  try {
    
    const response = await apiClient.post("/event/addEvent", data)
    return {
      success: true,
      data: response.data,
      message: "Event created successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to create event",
    }
  }
}

// Get All Events with full details including days and times
export async function getAllEvents(): Promise<ApiResponse<EventWithDays>> {
  try {
    const response = await apiClient.get("/event/totalEvent")
    return {
      success: true,
      data: response.data,
      message: "Events fetched successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch events",
    }
  }
}

// Get Event Days - Second step in the flow
export async function getEventDays(): Promise<ApiResponse<EventDay[]>> {
  try {
    const response = await apiClient.get("/event/getEventDay")
    return {
      success: true,
      data: response.data,
      message: "Event days fetched successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch event days",
    }
  }
}

// get evdnet event/getEvent
export async function getEvent(): Promise<ApiResponse<Event[]>> {
  try {
    const response = await apiClient.get("/event/getEvent")
    return {
      success: true,
      data: response.data,
      message: "Events fetched successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch events",
    }
  }
}

// Add Time to Event Day - Third step in the flow
export async function addTimeToEventDay(data: AddTimeData): Promise<ApiResponse<EventTime>> {
  try {
    const { eventId, eventDay_ref, ...timeData } = data
    const response = await apiClient.post(`/event/addTime/${eventId}/day/${eventDay_ref}`, timeData)
    return {
      success: true,
      data: response.data,
      message: "Time slot added successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to add time slot",
    }
  }
}

// Update Event Day
export async function updateEventDay(eventDayId: string, data: Partial<EventDay>): Promise<ApiResponse<EventDay>> {
  try {
    const response = await apiClient.post(`/event/updateEventDay/${eventDayId}`, data)
    return {
      success: true,
      data: response.data,
      message: "Event day updated successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update event day",
    }
  }
}

// Update Event
export async function updateEvent(eventId: string, data: Partial<Event>): Promise<ApiResponse<Event>> {
  try {
    const response = await apiClient.post(`/event/updateEvent/${eventId}`, data)
    return {
      success: true,
      data: response.data,
      message: "Event updated successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update event",
    }
  }
}

// Update Time
// eventRoute.post("/updateTime/day/:day_ref/time/:timeId",protect,restrictTo("admin","user"),updateTime);
export async function updateTime(dayId: string, timeId: string, data: Partial<EventTime>): Promise<ApiResponse<EventTime>> {
  try {
    const response = await apiClient.post(`/event/updateTime/day/${dayId}/time/${timeId}`, data)
    return {
      success: true,
      data: response.data,
      message: "Time slot updated successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update time slot",
    }
  }
}

// Delete Event
export async function deleteEvent(eventId: string): Promise<ApiResponse<void>> {
  try {
    await apiClient.delete(`/event/deleteEvent/${eventId}`)
    return {
      success: true,
      message: "Event deleted successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete event",
    }
  }
}
