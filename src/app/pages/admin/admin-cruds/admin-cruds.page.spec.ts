import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminCrudsPage } from './admin-cruds.page';

describe('AdminCrudsPage', () => {
  let component: AdminCrudsPage;
  let fixture: ComponentFixture<AdminCrudsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AdminCrudsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
