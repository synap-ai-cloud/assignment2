import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VmManagerComponent } from './vm-manager.component';

describe('VmManagerComponent', () => {
  let component: VmManagerComponent;
  let fixture: ComponentFixture<VmManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VmManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VmManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
