'use server'

import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'

// Saari transactions fetch karne ke liye
export async function getTransactions() {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return { success: true, data: transactions }
  } catch (error) {
    console.error('Failed to fetch transactions:', error)
    return { success: false, error: 'Database se data laane mein error aayi hai' }
  }
}

// Nayi transaction add karne ke liye
export async function addTransaction(formData: {
  text: string
  amount: number
  type: string
  category: string
  paymentMode: string
  date: string
}) {
  try {
    const newTransaction = await prisma.transaction.create({
      data: {
        text: formData.text,
        amount: formData.amount,
        type: formData.type,
        category: formData.category,
        paymentMode: formData.paymentMode,
        date: formData.date,
      },
    })
    
    revalidatePath('/') // Page ko refresh karega taaki naya data turant dikhe
    return { success: true, data: newTransaction }
  } catch (error) {
    console.error('Failed to add transaction:', error)
    return { success: false, error: 'Transaction save nahi ho payi' }
  }
}

// Transaction delete karne ke liye
export async function deleteTransaction(id: string) {
  try {
    await prisma.transaction.delete({
      where: { id },
    })
    
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete transaction:', error)
    return { success: false, error: 'Transaction delete nahi ho payi' }
  }
}