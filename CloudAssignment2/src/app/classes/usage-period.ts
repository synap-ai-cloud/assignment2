import { VMType } from '../enumerations/vm-type.enum';
import { VIMEvent } from './vim-event';

export interface UsagePeriod {
    startEvent: VIMEvent; // starting event
    endEvent?: VIMEvent; // null if usage period incomplete
}
