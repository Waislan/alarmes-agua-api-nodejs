export function durationToMs(expr: string): number {
  const match = expr.trim().match(/^(\d+)(ms|s|m|h|d)$/i);
  if (!match) {
    throw new Error(`Formato de duração inválido: ${expr}`);
  }
  const n = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();
  switch (unit) {
    case 'ms':
      return n;
    case 's':
      return n * 1000;
    case 'm':
      return n * 60 * 1000;
    case 'h':
      return n * 60 * 60 * 1000;
    case 'd':
      return n * 24 * 60 * 60 * 1000;
    default:
      throw new Error(`Unidade desconhecida: ${unit}`);
  }
}

export function addDuration(from: Date, expr: string): Date {
  return new Date(from.getTime() + durationToMs(expr));
}
