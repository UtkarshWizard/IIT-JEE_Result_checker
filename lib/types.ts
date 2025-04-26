export interface Student {
    id: string
    hallTicket: string
    name: string
    gender: string
    state: string
    physicsMarks: number
    chemistryMarks: number
    mathMarks: number
    totalMarks: number
    rank: number
    passed: boolean
  }

export interface SharedLink {
    id: string
    hallTicket: string
    createdAt: Date
    expiresAt: Date
 }