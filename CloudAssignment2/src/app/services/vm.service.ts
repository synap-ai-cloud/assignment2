import { Injectable } from '@angular/core';
import { VMType } from '../enumerations/vm-type.enum';
import { AuthService } from './auth.service';
import { AngularFireFunctions } from '@angular/fire/functions';
import { VIMEvent } from '../classes/vim-event';
import { EventType } from '../enumerations/event-type.enum';

@Injectable({
  providedIn: 'root'
})
export class VMService {

  private postEvent = this.fns.httpsCallable('postEvent');

  constructor(private authService: AuthService, private fns: AngularFireFunctions) { }

  createVM(type: VMType) {
    const event: VIMEvent = {
      type: EventType.Create,
      vm_type: type,
    };
    return this.postEvent({event: event}).toPromise();
  }
}
