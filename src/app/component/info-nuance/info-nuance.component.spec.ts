import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoNuanceComponent } from './info-nuance.component';

describe('InfoNuanceComponent', () => {
  let component: InfoNuanceComponent;
  let fixture: ComponentFixture<InfoNuanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoNuanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoNuanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
