import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerAsignadasPage } from './ver-asignadas.page';

describe('VerAsignadasPage', () => {
  let component: VerAsignadasPage;
  let fixture: ComponentFixture<VerAsignadasPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VerAsignadasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
