import { PutUserDto } from './put.user.dto'

// We can use the Partial feature from TypeScript,
// which creates a new type by copying another type and making all its fields optional.
export interface PatchUserDto extends Partial<PutUserDto> {}
