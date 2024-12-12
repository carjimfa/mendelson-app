import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ApiMockService } from './mocks/api-mock.service';
import { ApiService } from './services/api.service';
import { ActivatedRoute } from '@angular/router';

describe('AppComponent', () => {
  const fakeActivatedRoute = {
    snapshot: { data: {} }
  } as ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideAnimations(),
        {
          provide: ApiService,
          useValue: new ApiMockService()
        },
        {
          provide: ActivatedRoute,
          useValue: fakeActivatedRoute
        }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
