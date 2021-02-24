import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JustAskEvieProfileGridComponent } from './justaskevie-profile-grid.component';

describe('JustAskEvieProfileGridComponent', () => {
  let component: JustAskEvieProfileGridComponent;
  let fixture: ComponentFixture<JustAskEvieProfileGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JustAskEvieProfileGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JustAskEvieProfileGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
