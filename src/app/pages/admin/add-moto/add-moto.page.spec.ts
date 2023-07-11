import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddMotoPage } from './add-moto.page';

describe('AddMotoPage', () => {
  let component: AddMotoPage;
  let fixture: ComponentFixture<AddMotoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddMotoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
