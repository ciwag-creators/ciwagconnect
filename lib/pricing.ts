export function getPrice(level: string, basePrice: number) {

  if (level === "super_agent") {
    return basePrice * 1.02
  }

  if (level === "agent") {
    return basePrice * 1.05
  }

  return basePrice * 1.1
}