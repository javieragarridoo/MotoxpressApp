import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerOrdenesPage } from './ver-ordenes.page';

describe('VerOrdenesPage', () => {
  let component: VerOrdenesPage;
  let fixture: ComponentFixture<VerOrdenesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VerOrdenesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
