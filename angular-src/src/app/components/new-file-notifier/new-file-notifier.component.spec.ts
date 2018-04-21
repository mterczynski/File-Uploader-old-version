import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFileNotifierComponent } from './new-file-notifier.component';

describe('NewFileNotifierComponent', () => {
  let component: NewFileNotifierComponent;
  let fixture: ComponentFixture<NewFileNotifierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewFileNotifierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewFileNotifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
