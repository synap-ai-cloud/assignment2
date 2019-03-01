import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VMListComponent } from './vm-list.component';

describe('VMListComponent', () => {
  let component: VMListComponent;
  let fixture: ComponentFixture<VMListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VMListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VMListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
