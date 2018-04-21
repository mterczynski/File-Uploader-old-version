import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFileMenuComponent } from './add-file-menu.component';

describe('AddFileMenuComponent', () => {
  let component: AddFileMenuComponent;
  let fixture: ComponentFixture<AddFileMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFileMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFileMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
