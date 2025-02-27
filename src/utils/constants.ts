import { SUPABASE_URL } from './supabase'

import { CircleInterface } from 'types/circle'

export const circlePageStatus = {
  CIRCLE_LIST: 0,
  ADD_AUTOMATICALLY: 1,
  ADD_MANUALLY: 2,
  ENLIGHTEN_ME: 3,
}

export const edenUrl = 'https://app.0xeden.com'

export const Paths = {
  SIGNUP: `${edenUrl}/signup`,
}

export const supabaseSotrageUrl = `${SUPABASE_URL}/storage/v1/object/public`

export const circleLoadingMessages = [
  'Summoning your ape',
  'Your ape is eating bananas',
  'Doing the hard work',
  'Digging through the page',
  'Ape trying to make sense of the page',
  'Imagining',
  // 'Almost there',
  'Hang on',
]

export enum CircleGenerationStatus {
  INITIALIZED = 'initialized',
  GENERATING = 'generating',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
}

export type TLinkSectionItems = {
  item: CircleInterface
  index?: number
  isLinkCommentBox: boolean
}
