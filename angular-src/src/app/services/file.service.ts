import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

@Injectable()
export class FileService {

  constructor() { }

  private fileSubject = new Subject<any>();
  private refreshSubject = new Subject<any>();

  addFile(data){
    this.fileSubject.next(data);
  }

  getFileSubject(){
    return this.fileSubject;
  }

  getRefreshSubject(){
    return this.refreshSubject;
  }

  refreshFiles(){
    this.refreshSubject.next();
  }

}
