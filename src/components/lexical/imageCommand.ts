import { createCommand, type LexicalCommand } from 'lexical'

export type InsertImagePayload = { src: string; altText: string }

export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> =
  createCommand('INSERT_IMAGE_COMMAND')
