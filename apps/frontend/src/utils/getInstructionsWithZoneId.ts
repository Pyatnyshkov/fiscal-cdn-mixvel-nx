import { Instructions } from '@models/general/instructions.model'

export const getInstructionsWithZoneId = (
  instructions: Instructions,
  zoneId: number | undefined
) => {
  const copyInstructions = { ...instructions }
  copyInstructions.responseDelivery.socketio.client.zoneId = zoneId?.toString() || '1'

  return copyInstructions
}
