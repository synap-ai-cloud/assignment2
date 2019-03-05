import { Component, OnInit } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { UsagePeriod } from '../classes/usage-period';
import { VMType } from '../enumerations/vm-type.enum';
import { map } from 'rxjs/operators';
import { VMService } from '../services/vm.service';
import { VIMEvent } from '../classes/vim-event';
import { EventType } from '../enumerations/event-type.enum';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  events: Observable<VIMEvent[]>;
  vm_types = VMType;
  e_types = EventType;

  prettyDate = (x: number) => (new Date(x)).toString();

  eventSort = (a: VIMEvent, b: VIMEvent) => b.timestamp - a.timestamp;
  eventFilter = (event: VIMEvent) => true;


  constructor(private vmService: VMService) { }

  ngOnInit() {
    this.events = this.vmService.events;
  }

}
