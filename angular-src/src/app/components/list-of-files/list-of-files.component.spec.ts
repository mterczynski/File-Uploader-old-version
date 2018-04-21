import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfFilesComponent } from './list-of-files.component';

describe('ListOfFilesComponent', () => {
  let component: ListOfFilesComponent;
  let fixture: ComponentFixture<ListOfFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOfFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
