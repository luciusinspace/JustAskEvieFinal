import { Component, OnInit } from '@angular/core';
import { JustAskEvieProfile } from '../models/justaskevie-profile.class';
import { JustAskEvieProfileService } from '../services/justaskevie-profile.service';
@Component({
  selector: 'app-justaskevie-profile-grid',
  templateUrl: './justaskevie-profile-grid.component.html',
  styleUrls: ['./justaskevie-profile-grid.component.css']
})
export class JustAskEvieProfileGridComponent implements OnInit {
  evies: JustAskEvieProfile[] = [];

  constructor(private eviesService: JustAskEvieProfileService) { }

  ngOnInit() {
    this.eviesService.retriveMysfitProfiles()
      .subscribe(eviesResponse => this.evies = eviesResponse.evies);
  }

}
