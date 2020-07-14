import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyMapComponent } from './my-map.component';

describe('MyMapComponent', () => {
  let component: MyMapComponent;
  let fixture: ComponentFixture<MyMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyMapComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
