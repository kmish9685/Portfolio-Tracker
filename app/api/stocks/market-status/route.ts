import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Simulate market status based on Indian market hours (9:15 AM - 3:30 PM IST)
    const now = new Date()
    const istTime = new Date(now.getTime() + 5.5 * 60 * 60 * 1000) // Convert to IST
    const hour = istTime.getHours()
    const minute = istTime.getMinutes()
    const dayOfWeek = istTime.getDay() // 0 = Sunday, 6 = Saturday

    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const isMarketHours = (hour > 9 || (hour === 9 && minute >= 15)) && (hour < 15 || (hour === 15 && minute <= 30))

    const marketStatus = {
      isOpen: !isWeekend && isMarketHours,
      nextOpen: getNextMarketOpen(istTime),
      nextClose: getNextMarketClose(istTime),
      timezone: "Asia/Kolkata",
      currentTime: istTime.toISOString(),
      tradingSession: getTradingSession(hour, minute, isWeekend),
    }

    return NextResponse.json(marketStatus)
  } catch (error) {
    console.error("Market status API error:", error)
    return NextResponse.json({ error: "Failed to get market status" }, { status: 500 })
  }
}

function getNextMarketOpen(currentTime: Date): string {
  const nextOpen = new Date(currentTime)

  // If it's weekend, set to next Monday
  if (currentTime.getDay() === 0) {
    // Sunday
    nextOpen.setDate(currentTime.getDate() + 1)
  } else if (currentTime.getDay() === 6) {
    // Saturday
    nextOpen.setDate(currentTime.getDate() + 2)
  } else if (currentTime.getHours() >= 15 && currentTime.getMinutes() > 30) {
    // After market close, next day
    nextOpen.setDate(currentTime.getDate() + 1)
  }

  nextOpen.setHours(9, 15, 0, 0)
  return nextOpen.toISOString()
}

function getNextMarketClose(currentTime: Date): string {
  const nextClose = new Date(currentTime)

  if (currentTime.getDay() === 0 || currentTime.getDay() === 6) {
    // Weekend - next close is Monday
    nextClose.setDate(currentTime.getDate() + (currentTime.getDay() === 0 ? 1 : 2))
  } else if (currentTime.getHours() >= 15 && currentTime.getMinutes() > 30) {
    // After close - next close is tomorrow
    nextClose.setDate(currentTime.getDate() + 1)
  }

  nextClose.setHours(15, 30, 0, 0)
  return nextClose.toISOString()
}

function getTradingSession(hour: number, minute: number, isWeekend: boolean): string {
  if (isWeekend) return "closed"

  if (hour < 9 || (hour === 9 && minute < 15)) return "pre-market"
  if (hour > 15 || (hour === 15 && minute > 30)) return "after-market"

  return "regular"
}
