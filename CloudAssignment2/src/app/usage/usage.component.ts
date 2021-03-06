import { Component, OnInit } from '@angular/core';
import { VMService } from '../services/vm.service';
import { Observable, interval, of, combineLatest } from 'rxjs';
import { UsagePeriod } from '../classes/usage-period';
import { VIMEvent } from '../classes/vim-event';
import { map, groupBy, mergeMap } from 'rxjs/operators';
import { VMType } from '../enumerations/vm-type.enum';
import { EventType } from '../enumerations/event-type.enum';

@Component({
  selector: 'app-usage',
  templateUrl: './usage.component.html',
  styleUrls: ['./usage.component.css']
})
export class UsageComponent implements OnInit {

  usagePeriods: Observable<UsagePeriod[]>;
  totalCost: Observable<number>;
  types = VMType;

  now = interval(1000).pipe(map(() => Date.now()));

  prettyDate = (x: number) => (new Date(x)).toString();

  usageSort = (a: UsagePeriod, b: UsagePeriod) => b.startEvent.timestamp - a.startEvent.timestamp;

  usageFilter = (x: UsagePeriod) => true;


  constructor(private vmService: VMService) { }

  ngOnInit() {
    this.usagePeriods = this.vmService.events.pipe(
      map(this.usageCalc)
    );

    this.totalCost = combineLatest(this.usagePeriods, this.now, (ups, now) => {
      let totalCost = 0;
      ups.forEach(up => {
        const start = up.startEvent.timestamp;
        const type = up.startEvent.type;
        const end = up.endEvent ? up.endEvent.timestamp : now;
        const charge = this.getCharge(start, end, type);
        totalCost += charge;
      });
      return totalCost;
    });
  }

  getCharge(start: number, end: number, type: number): number {
    const timespan = end - start; // time stamp in ms
    const charge = type * 0.05 * timespan / 60000;
    return charge;
  }

  usageCalc(events: VIMEvent[]): UsagePeriod[] {
    const result: UsagePeriod[] = [];

    const vmEvents: { [vm_id: string]: VIMEvent[]} = {};
    events.forEach(event => {
      const vm_id = event.vm_id;
      vmEvents[vm_id] = vmEvents[vm_id] || []; // make sure it exists
      vmEvents[vm_id].push(event);
    });

    const keys = Object.keys(vmEvents);
    // tslint:disable-next-line:forin
    for (const key in keys) {
      const vm_id = keys[key];

      const eventsArr = vmEvents[vm_id];
      if (!eventsArr) {
        break;
      }
      const sorted = eventsArr.sort((a, b) => a.timestamp - b.timestamp);
      let openEvent: UsagePeriod | null = null;
      sorted.forEach(event => {
        switch (event.type) {
          case EventType.Start:
            openEvent = { startEvent: event, endEvent: null};
            break;
          case EventType.Stop:
            openEvent.endEvent = event;
            result.push(openEvent);
            openEvent = null;
            break;
          case EventType.Downgrade: // intentional fall through
          case EventType.Upgrade:
            if (openEvent) {
              openEvent.endEvent = event;
              result.push(openEvent);
              openEvent = { startEvent: event, endEvent: null};
            }
            break;
          case EventType.Delete:
            if (openEvent) {
              openEvent.endEvent = event;
              result.push(openEvent);
              openEvent = null;
            }
            break;
          case EventType.Create: // Nothing to be done here
            break;
          default:
            throw new Error('Error in usage processing');
        }

      });
      if (openEvent) {
        result.push(openEvent); // Current unclosed event
      }
    }
    return result;
  }

}
