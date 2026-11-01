const toneVariables = (tone: string) => ({
  '--tier-fg': `{colors.matrix.${tone}.fg}`,
  '--tier-surface': `{colors.matrix.${tone}.surface}`,
  '--tier-border': `{colors.matrix.${tone}.border}`,
  '--tier-hover': `{colors.matrix.${tone}.hover}`,
})

export const matrixToneStyles = {
  ...toneVariables('a'),
  ...Object.fromEntries(
    ['top', 's', 'aplus', 'a', 'percent', 'pvp'].map((tone) => [`&[data-tone="${tone}"]`, toneVariables(tone)]),
  ),
}
