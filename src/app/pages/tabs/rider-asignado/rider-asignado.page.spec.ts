import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RiderAsignadoPage } from './rider-asignado.page';

describe('RiderAsignadoPage', () => {
  let component: RiderAsignadoPage;
  let fixture: ComponentFixture<RiderAsignadoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RiderAsignadoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
