import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionByIDComponent } from './promotion-by-id.component';

describe('PromotionByIDComponent', () => {
  let component: PromotionByIDComponent;
  let fixture: ComponentFixture<PromotionByIDComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PromotionByIDComponent]
    });
    fixture = TestBed.createComponent(PromotionByIDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
