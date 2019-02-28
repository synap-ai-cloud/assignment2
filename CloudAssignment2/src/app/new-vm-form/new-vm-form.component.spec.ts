import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewVMFormComponent } from './new-vm-form.component';

describe('NewVMFormComponent', () => {
  let component: NewVMFormComponent;
  let fixture: ComponentFixture<NewVMFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewVMFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewVMFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
