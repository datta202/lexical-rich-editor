import { createCommand, type LexicalCommand } from 'lexical'

export type InsertEquationPayload = { equation: string; inline: boolean }

export const INSERT_EQUATION_COMMAND: LexicalCommand<InsertEquationPayload> =
  createCommand('INSERT_EQUATION_COMMAND')
