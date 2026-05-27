import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressAutocomplete } from './address-autocomplete';

describe('AddressAutocomplete', () => {
  let component: AddressAutocomplete;
  let fixture: ComponentFixture<AddressAutocomplete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressAutocomplete]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddressAutocomplete);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
