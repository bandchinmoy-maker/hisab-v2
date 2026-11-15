'use server'

import prisma from './lib/db'
import { auth } from '@clerk/nextjs/server'

const LENS_IDS = ['gita', 'stoic', 'buddhist', 'reason']

async function currentUserId() {
  const { userId } = await auth()
  return userId
}

export async function saveCheckIn(input: { mood: number; note?: string }) {
  try {
    const userId = await currentUserId()
    if (!userId) return { success: false, error: 'Please log in' }
    const mood = Math.round(Number(input.mood))
    if (!(mood >= 1 && mood <= 5)) return { success: false, error: 'Invalid mood' }
    await prisma.checkIn.create({
      data: { userId, mood, note: String(input.note || '').slice(0, 280) },
    })
    return { success: true }
  } catch (error) {
    console.error('Failed to save check-in:', error)
    return { success: false, error: 'Could not save' }
  }
}

export async function getCheckIns(days = 7) {
  try {
    const userId = await currentUserId()
    if (!userId) return { success: false, error: 'Please log in' }
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    const rows = await prisma.checkIn.findMany({
      where: { userId, createdAt: { gte: since } },
      orderBy: { createdAt: 'asc' },
    })
    return {
      success: true,
      data: rows.map((r) => ({ id: r.id, mood: r.mood, note: r.note, createdAt: r.createdAt.toISOString() })),
    }
  } catch (error) {
    console.error('Failed to load check-ins:', error)
    return { success: false, error: 'Could not load' }
  }
}

export async function saveReflection(input: { topic: string; lens: string; answers: string[] }) {
  try {
    const userId = await currentUserId()
    if (!userId) return { success: false, error: 'Please log in' }
    if (!LENS_IDS.includes(input.lens)) return { success: false, error: 'Invalid lens' }
    const answers = (Array.isArray(input.answers) ? input.answers : []).slice(0, 6).map((a) => String(a).slice(0, 1000))
    await prisma.reflection.create({
      data: { userId, topic: String(input.topic || '').slice(0, 300), lens: input.lens, answers: JSON.stringify(answers) },
    })
    return { success: true }
  } catch (error) {
    console.error('Failed to save reflection:', error)
    return { success: false, error: 'Could not save' }
  }
}

export async function getReflections(limit = 20) {
  try {
    const userId = await currentUserId()
    if (!userId) return { success: false, error: 'Please log in' }
    const rows = await prisma.reflection.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: Math.min(Math.max(limit, 1), 500),
    })
    return {
      success: true,
      data: rows.map((r) => ({
        id: r.id,
        topic: r.topic,
        lens: r.lens,
        answers: JSON.parse(r.answers || '[]') as string[],
        createdAt: r.createdAt.toISOString(),
      })),
    }
  } catch (error) {
    console.error('Failed to load reflections:', error)
    return { success: false, error: 'Could not load' }
  }
}

// Privacy: lets a user erase all their check-ins and reflections
export async function deleteAllJournalData() {
  try {
    const userId = await currentUserId()
    if (!userId) return { success: false, error: 'Please log in' }
    await prisma.checkIn.deleteMany({ where: { userId } })
    await prisma.reflection.deleteMany({ where: { userId } })
    return { success: true }
  } catch (error) {
    console.error('Failed to delete journal data:', error)
    return { success: false, error: 'Could not delete' }
  }
}
