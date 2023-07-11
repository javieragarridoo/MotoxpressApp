import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsignarOrdenPage } from './asignar-orden.page';

describe('AsignarOrdenPage', () => {
  let component: AsignarOrdenPage;
  let fixture: ComponentFixture<AsignarOrdenPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AsignarOrdenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
