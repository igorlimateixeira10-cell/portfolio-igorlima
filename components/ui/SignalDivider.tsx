/**
 * Divisor de seção com um pulso de luz percorrendo — a mesma ideia do
 * `SignalMarquee` (faixa de sinal logo abaixo do Hero) e das linhas de
 * circuito do `RobotHead`/`CoreEmblem`, só que reduzida a uma linha
 * fina, pra marcar transições entre seções sem precisar de outra faixa
 * cheia de texto. Puramente decorativo (`aria-hidden`).
 */
export function SignalDivider() {
  return (
    <div className="signal-divider" aria-hidden>
      <span className="signal-divider__pulse" />
    </div>
  );
}
