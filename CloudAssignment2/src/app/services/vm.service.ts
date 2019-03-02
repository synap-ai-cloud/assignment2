import { Injectable } from '@angular/core';
import { VMType } from '../enumerations/vm-type.enum';
import { AuthService } from './auth.service';
import { AngularFireFunctions } from '@angular/fire/functions';
import { VIMEvent } from '../classes/vim-event';
import { EventType } from '../enumerations/event-type.enum';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { VM } from '../classes/vm';
import { Observable, of, empty } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VMService {

  vms: Observable<VM[]>;
  events: Observable<VIMEvent[]>;

  private postEvent = this.fns.httpsCallable('postEvent');

  constructor(private authService: AuthService, private fns: AngularFireFunctions, private afs: AngularFirestore) {
    var usage;
    const userData = authService.user.pipe(
      switchMap(u => {
        if (u) {
          return of(afs.collection('User-Data').doc(u.uid));
        } else {
          return empty();
        }
      })
    );

    const vmsCollection = userData.pipe(
      map(ud => ud.collection<VM>('vms'))
    );
    vmsCollection.subscribe(c => {
      this.vms = c.snapshotChanges().pipe(
        map(changes => {
          return changes.map(change => {
            const data = change.payload.doc.data();
            const id = change.payload.doc.id;
            return { id, ... data};
          });
        })
      );
    });

    const eventsColection = userData.pipe(
      map(ud => ud.collection<VIMEvent>('vms'))
    );
    eventsColection.subscribe(c => {
      this.events = c.valueChanges();
    });

   }

  create(type: VMType) {
    const event: VIMEvent = {
      type: EventType.Create,
      vm_type: type,
    };
    return this.postEvent({event: event}).toPromise();
  }

  delete(vmId: string) {
    const event: VIMEvent = {
      type: EventType.Delete,
      vm_id: vmId
    };
    return this.postEvent({event: event}).toPromise();
  }

  start(vmId: string) {
    const event: VIMEvent = {
      type: EventType.Start,
      vm_id: vmId
    };
    return this.postEvent({event: event}).toPromise();
  }

  stop(vmId: string) {
    const event: VIMEvent = {
      type: EventType.Stop,
      vm_id: vmId
    };
    return this.postEvent({event: event}).toPromise();
  }

  upgrade(vmId: string) {
    const event: VIMEvent = {
      type: EventType.Upgrade,
      vm_id: vmId
    };
    return this.postEvent({event: event}).toPromise();
  }

  downgrade(vmId: string) {
    const event: VIMEvent = {
      type: EventType.Downgrade,
      vm_id: vmId
    };
    return this.postEvent({event: event}).toPromise();
  }
}
