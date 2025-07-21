// API client helper functions
const API_BASE = process.env.NEXT_PUBLIC_BASE_URL || ""

class ApiClient {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE}/api${endpoint}`
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    const response = await fetch(url, config)

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Network error" }))
      throw new Error(error.error || "Request failed")
    }

    return response.json()
  }

  // Rides
  async getRides(params: Record<string, string> = {}) {
    const query = new URLSearchParams(params).toString()
    return this.request(`/rides?${query}`)
  }

  async createRide(data: any) {
    return this.request("/rides", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getRide(id: string) {
    return this.request(`/rides/${id}`)
  }

  async updateRide(id: string, data: any) {
    return this.request(`/rides/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  async cancelRide(id: string, driverId: string) {
    return this.request(`/rides/${id}?driver_id=${driverId}`, {
      method: "DELETE",
    })
  }

  async requestRide(rideId: string, data: any) {
    return this.request(`/rides/${rideId}/requests`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async respondToRideRequest(rideId: string, data: any) {
    return this.request(`/rides/${rideId}/requests`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  // Study Spots
  async getStudySpots(params: Record<string, string> = {}) {
    const query = new URLSearchParams(params).toString()
    return this.request(`/study-spots?${query}`)
  }

  async checkInToStudySpot(data: any) {
    return this.request("/study-spots/checkin", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async checkOutFromStudySpot(data: any) {
    return this.request("/study-spots/checkout", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Messages
  async getMessages(params: Record<string, string> = {}) {
    const query = new URLSearchParams(params).toString()
    return this.request(`/messages?${query}`)
  }

  async sendMessage(data: any) {
    return this.request("/messages", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async markMessageAsRead(id: string, userId: string) {
    return this.request(`/messages/${id}/read`, {
      method: "PATCH",
      body: JSON.stringify({ userId }),
    })
  }

  // Notifications
  async getNotifications(params: Record<string, string> = {}) {
    const query = new URLSearchParams(params).toString()
    return this.request(`/notifications?${query}`)
  }

  async markNotificationAsRead(id: string, userId: string) {
    return this.request(`/notifications/${id}/read`, {
      method: "PATCH",
      body: JSON.stringify({ userId }),
    })
  }

  async markAllNotificationsAsRead(userId: string) {
    return this.request("/notifications/mark-all-read", {
      method: "PATCH",
      body: JSON.stringify({ userId }),
    })
  }

  // Reviews
  async getReviews(params: Record<string, string> = {}) {
    const query = new URLSearchParams(params).toString()
    return this.request(`/reviews?${query}`)
  }

  async createReview(data: any) {
    return this.request("/reviews", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Vehicles
  async getVehicles(userId: string) {
    return this.request(`/vehicles?user_id=${userId}`)
  }

  async createVehicle(data: any) {
    return this.request("/vehicles", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateVehicle(id: string, data: any) {
    return this.request(`/vehicles/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  async deleteVehicle(id: string, userId: string) {
    return this.request(`/vehicles/${id}?user_id=${userId}`, {
      method: "DELETE",
    })
  }

  // Users
  async getUserProfile(userId: string) {
    return this.request(`/users/profile?user_id=${userId}`)
  }

  async updateUserProfile(data: any) {
    return this.request("/users/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  async searchUsers(params: Record<string, string> = {}) {
    const query = new URLSearchParams(params).toString()
    return this.request(`/users/search?${query}`)
  }

  // File Upload
  async uploadFile(file: File, bucket: string, userId: string) {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("bucket", bucket)
    formData.append("user_id", userId)

    return fetch(`${API_BASE}/api/upload`, {
      method: "POST",
      body: formData,
    }).then((res) => res.json())
  }

  // Stats
  async getStats(universityId?: string) {
    const query = universityId ? `?university_id=${universityId}` : ""
    return this.request(`/stats${query}`)
  }
}

export const apiClient = new ApiClient()
