import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AppService} from '../../../service/app.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import html2pdf from 'simple-html2pdf';
import Swal from 'sweetalert2';
import {LoadingService} from '../../../service/loading.service';

@Component({
  selector: 'app-event-info',
  templateUrl: './event-info.component.html',
  styleUrls: ['./event-info.component.scss']
})
export class EventInfoComponent implements OnInit {
  races = [];
  lanes = [6, 8, 10];
  event: any = {};
  swims: any = {};
  laneCount = 6;
  isDownloading = false;
  withResults = true;

  constructor(private _activatedRoute: ActivatedRoute, private _appService: AppService, private _loadingService: LoadingService) {
    this._activatedRoute.params.subscribe(params => {
      if (params.eventId) {
        this.event['_id'] = params.eventId;
      }
    });

  }

  ngOnInit() {
    if (this.event['_id']) {
      this.getEventData();
    }
  }

  onLaneSelect(e) {


    // this.laneCount = e;
    this.findRaces();
  }

  generate(race) {

    race.isSelection = !!race.isSelection;
    let total = race.participants;

    total.sort(function (a, b) {
      return (a.minutes * 1000 + a.seconds * 1000 + a.milliseconds) - (b.minutes * 1000 + b.seconds * 1000 + b.milliseconds);
    });


    const totalCount = total.length;
    let laneCount = this.laneCount;

    const template = {
      true: {
        6: {
          1: [10, 6, 2, 1, 5, 9],
          2: [12, 8, 4, 3, 7, 11],
          lastRace: [5, 3, 2, 1, 4, 6]
        },
        8: {
          1: [13, 9, 5, 1, 2, 6, 10, 14],
          2: [15, 11, 7, 3, 4, 8, 12, 16],
          lastRace: [7, 5, 3, 1, 2, 4, 6, 8]
        },
        10: {
          1: [17, 13, 9, 5, 1, 2, 6, 10, 14, 18],
          2: [19, 15, 11, 7, 3, 4, 8, 12, 16, 20],
          lastRace: [10, 7, 5, 3, 1, 2, 4, 6, 8, 9]
        }
      },
      false: {
        6: {
          1: [10, 4, 2, 1, 3, 9],
          2: [12, 8, 6, 5, 7, 11],
          lastRace: [5, 3, 2, 1, 4, 6]
        },
        8: {
          1: [13, 9, 3, 1, 2, 4, 10, 14],
          2: [15, 11, 7, 5, 6, 8, 12, 16],
          lastRace: [7, 5, 3, 1, 2, 4, 6, 8]
        },
        10: {
          1: [17, 13, 5, 3, 1, 2, 4, 6, 14, 18],
          2: [19, 15, 11, 9, 7, 8, 10, 12, 16, 20],
          lastRace: [10, 7, 5, 3, 1, 2, 4, 6, 8, 9]
        }
      }
    };
    let raceCount = totalCount % laneCount ? Math.floor(totalCount / laneCount) + 1 : Math.floor(totalCount / laneCount);


    for (let i = 0; i < raceCount; i++) {

      if (i % 2 == 0) {
        if (i == raceCount - 1) {
          this.swims[race._id][i] = {
            event: event['_id'],
            participants: template[race.isSelection][this.laneCount]['lastRace'].map(item => item + i * this.laneCount)
          };
        } else {
          this.swims[race._id][i] = {
            event: event['_id'],
            participants: template[race.isSelection][this.laneCount][1].map(item => item + i * this.laneCount)
          };
        }
      } else {
        this.swims[race._id][i] = {
          event: event['_id'],
          participants: template[race.isSelection][this.laneCount][2].map(item => item + (i - 1) * this.laneCount)
        };
      }

    }


    if (totalCount % this.laneCount == 1 && (totalCount - totalCount % laneCount) % (2 * laneCount) == 0 && raceCount > 1) {
      this.swims[race._id][raceCount - 1].participants[laneCount / 2 - 1] = this.swims[race._id][raceCount - 2].participants[0];
      this.swims[race._id][raceCount - 1].participants[laneCount / 2] = this.swims[race._id][raceCount - 2].participants[laneCount - 1];
      this.swims[race._id][raceCount - 2].participants[laneCount - 1] = {fullName: '--', seconds: '--', minutes: '--', milliseconds: '--'};
      this.swims[race._id][raceCount - 2].participants[0] = {fullName: '--', seconds: '--', minutes: '--', milliseconds: '--'};
      this.swims[race._id][raceCount - 1].participants[laneCount / 2 - 2] = totalCount;

    }
    if (totalCount % this.laneCount == 2 && (totalCount - totalCount % laneCount) % (2 * laneCount) == 0 && raceCount > 1) {

      this.swims[race._id][raceCount - 1].participants[laneCount / 2 - 1] = this.swims[race._id][raceCount - 2].participants[0];
      this.swims[race._id][raceCount - 1].participants[laneCount / 2] = this.swims[race._id][raceCount - 2].participants[laneCount - 1];
      this.swims[race._id][raceCount - 2].participants[laneCount - 1] = {fullName: '--', seconds: '--', minutes: '--', milliseconds: '--'};
      this.swims[race._id][raceCount - 2].participants[0] = {fullName: '--', seconds: '--', minutes: '--', milliseconds: '--'};
      this.swims[race._id][raceCount - 1].participants[laneCount / 2 - 2] = totalCount;
      this.swims[race._id][raceCount - 1].participants[laneCount / 2 + 1] = totalCount - 1;
    }

    if (raceCount > 0) {
      this.swims[race._id][raceCount - 1].participants.forEach((item, i) => {
          if (item > totalCount) {
            this.swims[race._id][raceCount - 1].participants[i] = {fullName: '--', seconds: '--', minutes: '--', milliseconds: '--'};
          }
        }
      );
      if (raceCount > 1)
        this.swims[race._id][raceCount - 2].participants.forEach((item, i) => {
            if (item > totalCount) {
              this.swims[race._id][raceCount - 2].participants[i] = {fullName: '--', seconds: '--', minutes: '--', milliseconds: '--'};
            }
          }
        );
    }


    for (let i = 0; i < raceCount; i++) {
      for (let j = 0; j < laneCount; j++) {
        if (this.swims[race._id][i].participants[j] && this.swims[race._id][i].participants[j].fullName != '--') {
          this.swims[race._id][i].participants[j] = total[this.swims[race._id][i].participants[j] - 1];
        }
      }
    }

    this.swims[race._id].reverse();
    // this.swimmers = [];
    //
    // console.log(participants)
    // console.log(participants.sort(function (a,b) {
    //   return a.time >b.time
    // }))
  }

  getEventData() {
    this._appService.findEventById({data: {_id: this.event['_id']}}).subscribe(res => {
      this.event = res['data'];
      this.findRaces();
    });
  }

  findRaces() {
    this._appService.findRace({data: {event: this.event['_id']}}).subscribe(res => {
      if (res['success']) {
        this.races = res['data'];
        this.races.forEach(race => {
          this.swims[race._id] = [];
          this.generate(race);
        });
      }
    });
  }


  drop(event: CdkDragDrop<string[]>, item) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      if (item) {
        if (item.participants.length == this.laneCount) {
          let toReplace = event.container.data[event.currentIndex];
          event.container.data[event.currentIndex] = event.previousContainer.data[event.previousIndex];
          event.previousContainer.data[event.previousIndex] = toReplace;
        }
      } else {
        transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
      }
    }

  }

  getPrevLength(race, index) {
    let prevIndex = 0;
    for (let i = 0; i < index; i++) {
      prevIndex += this.swims[this.races[i]._id].length;
    }
    return prevIndex;
  }

  download(withResults) {
    this._loadingService.show();
    this.withResults = withResults;
    this.isDownloading = true;
    setTimeout(() => {
      html2pdf(document.getElementById('races'), {
        filename: this.event.name + '.pdf',
        margin: this.laneCount == 6 ? 80 : this.laneCount == 8 ? 95 : 185,
        smart: true // true: Smartly adjust content width
      }, () => {
        this.isDownloading = false;
        this.withResults = true;
        this._loadingService.hide();
      });
    }, 100);
  }

  setResult(race, sw, item) {
    Swal.mixin({
      input: 'number',
      confirmButtonText: 'Next &rarr;',
      showCancelButton: true,
      progressSteps: ['1', '2', '3']
    }).queue([
      {
        title: 'დაფიქსირებული დრო:',
        text: 'წუთი'
      },
      {
        title: 'დაფიქსირებული დრო:',
        text: 'წამი'
      },
      {
        title: 'დაფიქსირებული დრო:',
        text: 'მილიწამი'
      }
    ]).then((result) => {
      if (result.value) {
        race.participants.map(it => {
          if (it == item) {
            it.result = {
              minutes: result.value[0],
              seconds: result.value[1],
              milliseconds: result.value[2],
            };
          }
          return it;
        });
        this._appService.raceEdit({data: race}).subscribe(res => {
          this.findRaces();
        });
      }
    });
  }
}
