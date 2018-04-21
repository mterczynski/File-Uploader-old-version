import { Component, OnInit } from '@angular/core';
import { FileFromServer } from '../../interfaces/FileFromServer';
import { SocketService } from '..//..//services/socket.service';

import { Title as TitleService} from '@angular/platform-browser';

import { FileService } from '../../services/file.service';

@Component({
  selector: 'app-new-file-notifier',
  templateUrl: './new-file-notifier.component.html',
  styleUrls: ['./new-file-notifier.component.scss'],
  host: {
     "(click)": "refreshClick($event)"
  }
})
export class NewFileNotifierComponent implements OnInit {

  constructor(
    private socketService: SocketService,
    private titleService: TitleService,
    private fileService: FileService
  ) { }

  ngOnInit() {
    this.socketService.on('newFileAdded', (fileFromServer)=>{
      let newTitle = "File Uploader";

      this.newFiles.push(fileFromServer);
  
      this.titleService.setTitle(`(${this.newFiles.length}) File Uploader`);
    });
    this.fileService.getRefreshSubject().subscribe((data)=>{
       // TODO refresh
       this.refreshClick();
    });
  }


  newFiles: FileFromServer[] = [ // public only for build error workaround

  ];

  refreshClick(){ // public only for build error workaround
    this.titleService.setTitle('File Uploader');
    this.newFiles.map((file)=>{
      this.fileService.addFile(file);
    });
    this.newFiles.length = 0;
  }
  
}
