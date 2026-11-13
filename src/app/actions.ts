'use server'

import prisma from './lib/db'
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

// Nayi transaction ya edit karne ke liye
export async function saveTransaction(formData: {
  id?: string
  text: string
  amount: number
  amountINR: number
  type: string
  category: string
  paymentMode: string
  bankAccount: string
  country: string
  currency: string
  symbol: string
  date: string
}) {
  try {
    let result
    if (formData.id) {
      // Update existing transaction
      result = await prisma.transaction.update({
        where: { id: formData.id },
        data: {
          text: formData.text,
          amount: formData.amount,
          amountINR: formData.amountINR,
          type: formData.type,
          category: formData.category,
          paymentMode: formData.paymentMode,
          bankAccount: formData.bankAccount,
          country: formData.country,
          currency: formData.currency,
          symbol: formData.symbol,
        },
      })
    } else {
      // Create new transaction
      result = await prisma.transaction.create({
        data: {
          text: formData.text,
          amount: formData.amount,
          amountINR: formData.amountINR,
          type: formData.type,
          category: formData.category,
          paymentMode: formData.paymentMode,
          bankAccount: formData.bankAccount,
          country: formData.country,
          currency: formData.currency,
          symbol: formData.symbol,
          date: formData.date,
        },
      })
    }

    revalidatePath('/')
    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to save transaction:', error)
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
