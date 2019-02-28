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
    const promise = this.vmService.createVM(this.types[this.key] as VMType);
    promise
      .then( id => console.log(id))
      .catch(err => console.log(err));
  }

}
