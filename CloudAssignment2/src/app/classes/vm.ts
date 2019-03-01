import { VMType } from '../enumerations/vm-type.enum';

export interface VM {
    id?: string;
    running: boolean;
    type: VMType;
}
