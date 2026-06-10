import { create } from 'zustand'

const mockFrameIntervalMs = 50

interface Position {
  x: number
  y: number
}

export interface RelationObject {
  id: string
  relativePosition: Position
}

export interface PositionFrame {
  currentPosition: Position
  relations: RelationObject[]
}

interface RelativePositionState {
  frame: PositionFrame
  activeSubscriberCount: number
  unsubscribeFrameStream: (() => void) | undefined
  startFrameSubscription: () => void
  stopFrameSubscription: () => void
}

const createMockRelation = (
  index: number,
  elapsedSeconds: number,
): RelationObject => {
  const phase = elapsedSeconds * (0.9 + index * 0.18) + index * 1.25

  return {
    id: `relation-${index}`,
    relativePosition: {
      x: Math.cos(phase) * (80 + index * 18),
      y: Math.sin(phase * 0.8) * (60 + index * 14),
    },
  }
}

const createMockPositionFrame = (elapsedSeconds: number): PositionFrame => {
  const relationshipCount =
    3 + Math.floor(((Math.sin(elapsedSeconds * 0.7) + 1) / 2) * 3)
  const relations = Array.from({ length: 5 }, (_, index) =>
    createMockRelation(index, elapsedSeconds),
  ).slice(0, relationshipCount)

  return {
    currentPosition: {
      x: elapsedSeconds * 12,
      y: Math.sin(elapsedSeconds * 0.6) * 24,
    },
    relations,
  }
}

const subscribeMockPositionFrames = (
  onFrame: (frame: PositionFrame) => void,
): (() => void) => {
  const startedAt = performance.now()
  const intervalId = window.setInterval(() => {
    const elapsedSeconds = (performance.now() - startedAt) / 1000

    onFrame(createMockPositionFrame(elapsedSeconds))
  }, mockFrameIntervalMs)

  return () => {
    window.clearInterval(intervalId)
  }
}

export const useRelativePositionStore = create<RelativePositionState>()(
  (set, get) => ({
    frame: createMockPositionFrame(0),
    activeSubscriberCount: 0,
    unsubscribeFrameStream: undefined,
    startFrameSubscription: () => {
      const { activeSubscriberCount, unsubscribeFrameStream } = get()
      const nextSubscriberCount = activeSubscriberCount + 1

      if (unsubscribeFrameStream !== undefined) {
        set({ activeSubscriberCount: nextSubscriberCount })
        return
      }

      set({
        activeSubscriberCount: nextSubscriberCount,
        unsubscribeFrameStream: subscribeMockPositionFrames((frame) => {
          set({ frame })
        }),
      })
    },
    stopFrameSubscription: () => {
      const { activeSubscriberCount, unsubscribeFrameStream } = get()
      const nextSubscriberCount = Math.max(0, activeSubscriberCount - 1)

      if (nextSubscriberCount > 0 || unsubscribeFrameStream === undefined) {
        set({ activeSubscriberCount: nextSubscriberCount })
        return
      }

      unsubscribeFrameStream()
      set({
        activeSubscriberCount: nextSubscriberCount,
        unsubscribeFrameStream: undefined,
      })
    },
  }),
)
