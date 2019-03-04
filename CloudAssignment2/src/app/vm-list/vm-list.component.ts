import { Component, OnInit } from '@angular/core';
import { VMService } from '../services/vm.service';
import { map, toArray } from 'rxjs/operators';
import { of } from 'rxjs';
import { VM } from '../classes/vm';
import { VIMEvent } from '../classes/vim-event';
import { EventType } from '../enumerations/event-type.enum';
import { Observable, of, empty } from 'rxjs';

@Component({
  selector: 'app-vm-list',
  templateUrl: './vm-list.component.html',
  styleUrls: ['./vm-list.component.css']
})
export class VMListComponent implements OnInit {

  get vms() {
    return this.vmService.vms;
  }
  
  get events() {
	  return null;
	  return this.vmService.events;
  }
  
  get test(){
	  return this.vmService.events;
  }
  
  get test2(){
	  var b = this.vmService.events;
	  for (var e in b){
		  return e;
	  }
  }
  
  get test3(){
	  var a = 0;
	  var b = this.vmService.events;
	  for (var e in b){
		  a = e;
	  }
	  return a;
  }
  
  
  get subtest(){
	  var a = of(1, 2, 3, 4, 5);
	  
	  var b = 0;
	  
	  a.subscribe(
		function(value){
			b += value;
		}
	  );
	  
	  return b;
	  
	  
	  // Observable (VIMEvent, VIMEvent, VIMEvent, ...)
	  
  }
  
  get etest(){
	  
	  var eventList = this.vmService.events.pipe(toArray()).subscribe(console.log);;
	  //console.log(eventList[0]);
	  return eventList;
	  
	  
	  //var any:eventList[] = [];
	  //this.vmService.events.subscribe(events => eventList = events);
	  //console.log(eventList);
	  //return "a";
  }

  stringify = JSON.stringify;

  constructor(private vmService: VMService) { }

  ngOnInit() {
  }

  start(vm: VM) {
    this.vmService.start(vm.id);
  }

  stop(vm: VM) {
    this.vmService.stop(vm.id);
  }

  upgrade(vm: VM) {
    this.vmService.upgrade(vm.id);
  }

  downgrade(vm: VM) {
    this.vmService.downgrade(vm.id);
  }

  delete(vm: VM) {
    this.vmService.delete(vm.id);
  }

}
