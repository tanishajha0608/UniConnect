/**
 * Centralized university data and utilities
 * This eliminates duplication across multiple files and provides a single source of truth
 */

export interface University {
  id: string
  name: string
  slug: string
  city: string
  state: string
  website?: string
  type?: string
  coordinates?: [number, number]
}

/**
 * Static list of UC campuses we support
 * Single source of truth for all university data
 */
export const UC_CAMPUSES: University[] = [
  { 
    id: "uc-berkeley", 
    name: "University of California, Berkeley", 
    slug: "berkeley", 
    city: "Berkeley", 
    state: "CA", 
    type: "Public",
    website: "https://berkeley.edu"
  },
  { 
    id: "ucla", 
    name: "University of California, Los Angeles", 
    slug: "ucla", 
    city: "Los Angeles", 
    state: "CA", 
    type: "Public",
    website: "https://ucla.edu"
  },
  { 
    id: "uc-san-diego", 
    name: "University of California, San Diego", 
    slug: "ucsd", 
    city: "La Jolla", 
    state: "CA", 
    type: "Public",
    website: "https://ucsd.edu"
  },
  { 
    id: "uc-davis", 
    name: "University of California, Davis", 
    slug: "davis", 
    city: "Davis", 
    state: "CA", 
    type: "Public",
    website: "https://ucdavis.edu"
  },
  { 
    id: "uc-irvine", 
    name: "University of California, Irvine", 
    slug: "irvine", 
    city: "Irvine", 
    state: "CA", 
    type: "Public",
    website: "https://uci.edu"
  },
  { 
    id: "uc-merced", 
    name: "University of California, Merced", 
    slug: "merced", 
    city: "Merced", 
    state: "CA", 
    type: "Public",
    website: "https://ucmerced.edu"
  },
  { 
    id: "uc-riverside", 
    name: "University of California, Riverside", 
    slug: "riverside", 
    city: "Riverside", 
    state: "CA", 
    type: "Public",
    website: "https://ucr.edu"
  },
  { 
    id: "ucsf", 
    name: "University of California, San Francisco", 
    slug: "ucsf", 
    city: "San Francisco", 
    state: "CA", 
    type: "Public",
    website: "https://ucsf.edu"
  },
  { 
    id: "uc-santa-barbara", 
    name: "University of California, Santa Barbara", 
    slug: "ucsb", 
    city: "Santa Barbara", 
    state: "CA", 
    type: "Public",
    website: "https://ucsb.edu"
  },
  { 
    id: "uc-santa-cruz", 
    name: "University of California, Santa Cruz", 
    slug: "ucsc", 
    city: "Santa Cruz", 
    state: "CA", 
    type: "Public",
    website: "https://ucsc.edu"
  }
]

/**
 * Find university by slug
 * @param slug - University slug (e.g., "berkeley", "ucla")
 * @returns University object or null if not found
 */
export function getUniversity(slug: string): University | null {
  return UC_CAMPUSES.find(uni => uni.slug === slug) || null
}

/**
 * Get all university slugs
 * @returns Array of all university slugs
 */
export function getAllUniversitySlugs(): string[] {
  return UC_CAMPUSES.map(uni => uni.slug)
}

/**
 * Validate if a slug corresponds to a valid UC campus
 * @param slug - University slug to validate
 * @returns boolean indicating if slug is valid
 */
export function isValidUniversitySlug(slug: string): boolean {
  return UC_CAMPUSES.some(uni => uni.slug === slug)
} 