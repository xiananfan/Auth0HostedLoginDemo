import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleCaseConvertComponent } from './title-case-convert.component';

describe('TitleCaseConvertComponent', () => {
  let component: TitleCaseConvertComponent;
  let fixture: ComponentFixture<TitleCaseConvertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TitleCaseConvertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TitleCaseConvertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
