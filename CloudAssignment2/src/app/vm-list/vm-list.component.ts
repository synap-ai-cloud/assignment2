import { Component, OnInit } from '@angular/core';
import { VMService } from '../services/vm.service';
import { VM } from '../classes/vm';
import { VMType } from '../enumerations/vm-type.enum';

@Component({
  selector: 'app-vm-list',
  templateUrl: './vm-list.component.html',
  styleUrls: ['./vm-list.component.css']
})
export class VMListComponent implements OnInit {

  get vms() {
    return this.vmService.vms;
  }

  types = VMType;

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
