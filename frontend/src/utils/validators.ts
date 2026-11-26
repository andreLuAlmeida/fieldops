export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '')
}

export function validEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function validCpf(value: string): boolean {
  const digits = onlyDigits(value)

  if (digits.length !== 11 || /^(\d)\1+$/.test(digits)) {
    return false
  }

  function calculate(base: string) {
    const sum = [...base].reduce(
      (total, digit, index) =>
        total + Number(digit) * (base.length + 1 - index),
      0,
    )

    const result = (sum * 10) % 11

    return result === 10 ? 0 : result
  }

  const base = digits.slice(0, 9)
  const first = calculate(base)
  const second = calculate(base + first)

  return digits === base + first + second
}

export function validCnpj(value: string): boolean {
  const digits = onlyDigits(value)

  if (digits.length !== 14 || /^(\d)\1+$/.test(digits)) {
    return false
  }

  function calculate(base: string) {
    const weights = base.length === 12
      ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
      : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

    const sum = [...base].reduce(
      (total, digit, index) =>
        total + Number(digit) * weights[index],
      0,
    )

    const rest = sum % 11
    return rest < 2 ? 0 : 11 - rest
  }

  const base = digits.slice(0, 12)
  const first = calculate(base)
  const second = calculate(base + first)

  return digits === base + first + second
}
