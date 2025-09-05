/**
 * Common utility functions used across the application
 * This centralizes repeated logic and improves maintainability
 */

/**
 * Get occupancy color based on percentage
 * @param occupancy - Current occupancy percentage
 * @returns CSS class for occupancy color
 */
export function getOccupancyColor(occupancy: number): string {
  if (occupancy < 40) return "bg-green-500"
  if (occupancy < 70) return "bg-yellow-500"
  return "bg-red-500"
}

/**
 * Get occupancy text description
 * @param occupancy - Current occupancy percentage
 * @returns Human-readable occupancy description
 */
export function getOccupancyText(occupancy: number): string {
  if (occupancy < 40) return "Low"
  if (occupancy < 70) return "Moderate"
  return "High"
}

/**
 * Calculate available spots based on capacity and occupancy
 * @param capacity - Total capacity
 * @param occupancy - Current occupancy percentage
 * @returns Number of available spots
 */
export function getAvailableSpots(capacity: number, occupancy: number): number {
  return Math.floor(capacity * (1 - occupancy / 100))
}

/**
 * Format price with currency symbol
 * @param amount - Price amount
 * @param currency - Currency symbol (default: $)
 * @returns Formatted price string
 */
export function formatPrice(amount: number, currency: string = "$"): string {
  return `${currency}${amount.toFixed(2)}`
}

/**
 * Calculate savings percentage between original and discounted price
 * @param originalPrice - Original price
 * @param discountedPrice - Discounted price
 * @returns Savings percentage
 */
export function calculateSavings(originalPrice: number, discountedPrice: number): number {
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
}

/**
 * Format date for display
 * @param dateString - Date string (YYYY-MM-DD)
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  })
}

/**
 * Format time for display
 * @param timeString - Time string (HH:MM)
 * @returns Formatted time string
 */
export function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

/**
 * Get amenity icon based on amenity name
 * @param amenity - Amenity name
 * @returns Icon name for the amenity
 */
export function getAmenityIcon(amenity: string): string {
  const iconMap: Record<string, string> = {
    'wifi': 'Wifi',
    'power_outlets': 'Zap',
    'coffee': 'Coffee',
    'food': 'Coffee',
    'group_tables': 'Users',
    'individual_desks': 'Users',
    'whiteboards': 'Zap',
    'presentation_screens': 'Zap',
    'natural_light': 'Zap',
    '24_7_access': 'Clock',
    'silent': 'Volume2',
    'quiet': 'Volume2',
    'moderate_noise': 'Volume2',
    'loud': 'Volume2'
  }
  
  const normalizedAmenity = amenity.toLowerCase().replace(/\s+/g, '_')
  return iconMap[normalizedAmenity] || 'Zap'
}

/**
 * Validate email format
 * @param email - Email address to validate
 * @returns Boolean indicating if email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate phone number format
 * @param phone - Phone number to validate
 * @returns Boolean indicating if phone number is valid
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/
  return phoneRegex.test(phone)
}

/**
 * Debounce function to limit function calls
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
} 