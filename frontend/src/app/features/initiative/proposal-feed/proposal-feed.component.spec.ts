import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalFeedComponent } from './proposal-feed.component';

describe('ProposalFeedComponent', () => {
  let component: ProposalFeedComponent;
  let fixture: ComponentFixture<ProposalFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProposalFeedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProposalFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
