import type { Prisma, PrismaClient } from '@prisma/client'

type DbClient = PrismaClient | Prisma.TransactionClient

type LogOutputEventInput = {
  outputId: string
  actorId?: string | null
  eventType: string
  label: string
  note?: string | null
  payload?: Prisma.InputJsonValue
}

export async function logOutputEvent(db: DbClient, input: LogOutputEventInput) {
  return db.outputEvent.create({
    data: {
      outputId: input.outputId,
      actorId: input.actorId,
      eventType: input.eventType,
      label: input.label,
      note: input.note,
      payload: input.payload,
    },
  })
}
