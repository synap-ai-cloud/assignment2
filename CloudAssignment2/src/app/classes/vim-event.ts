import { VMType } from '../enumerations/vm-type.enum';
import { EventType } from '../enumerations/event-type.enum';

export interface VIMEvent {
    cc_id?: string; // customer
    type: EventType; // request type
    timestamp?: number; // timestamp
    vm_id?: string; // id of subject
    vm_type?: VMType; // current VM type
}
