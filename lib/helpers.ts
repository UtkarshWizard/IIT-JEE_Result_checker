import { SharedLink } from "./types"

export const calculatePercentage = (marks: number, maxMarks: number): number => {
    return (marks / maxMarks) * 100
}

export const generateShareLink = (hallTicket: string , id: string): SharedLink => {
    const createdAt = new Date()
    const expiresAt = new Date(createdAt.getTime() + 60 * 60 * 1000)
    
    return {
      id,
      hallTicket,
      createdAt,
      expiresAt,
    }
  }
  
export const isLinkExpired = (link: SharedLink): boolean => {
    return new Date() > link.expiresAt
}
  
export const formatTimeRemaining = (expiresAt: Date): string => {
    const now = new Date()
    const diffMs = expiresAt.getTime() - now.getTime()
    
    if (diffMs <= 0) {
      return 'Expired'
    }
    
    const diffMins = Math.floor(diffMs / 60000)
    const diffSecs = Math.floor((diffMs % 60000) / 1000)
    
    return `${diffMins}:${diffSecs < 10 ? '0' + diffSecs : diffSecs}`
  }
  
export const storeSharedLink = (link: SharedLink): void => {
    const storedLinks = getStoredSharedLinks()
    storedLinks.push(link)
    localStorage.setItem('sharedLinks', JSON.stringify(storedLinks))
}

export const getStoredSharedLinks = (): SharedLink[] => {
    const storedLinksJson = localStorage.getItem('sharedLinks')
    if (!storedLinksJson) {
      return []
    }
    
    try {
      return JSON.parse(storedLinksJson).map((link: any) => ({
        ...link,
        createdAt: new Date(link.createdAt),
        expiresAt: new Date(link.expiresAt),
      }))
    } catch (error) {
      console.error('Error parsing shared links from localStorage', error)
      return []
    }
  }

export const getSharedLinkById = (id: string): SharedLink | null => {
    const storedLinks = getStoredSharedLinks()
    const link = storedLinks.find(link => link.id === id)
    return link || null
  }