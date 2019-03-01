import { Component, OnInit } from '@angular/core';
import { VMType } from '../enumerations/vm-type.enum';
import { VMService } from '../services/vm.service';

@Component({
  selector: 'app-new-vm-form',
  templateUrl: './new-vm-form.component.html',
  styleUrls: ['./new-vm-form.component.css']
})
export class NewVMFormComponent implements OnInit {

  types = VMType;
  keys = Object.keys(VMType).filter(Number);

  key = this.keys[0];

  constructor(private vmService: VMService) { }

  ngOnInit() {
  }

  createVM() {
    this.vmService.create(this.types[this.key] as VMType);
  }

}
