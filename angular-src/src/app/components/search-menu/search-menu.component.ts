import { Component, OnInit, ElementRef } from '@angular/core';
import { NgModel } from '@angular/forms';

import { SocketService } from '../../services/socket.service';

// NOTE: import ngZone from @angular/core for supporting triggering on window resolution change, look in "Changed fileModel: +comments, +uploaderNick" commit for code with ngZone

@Component({
  selector: 'app-search-menu',
  templateUrl: './search-menu.component.html',
  styleUrls: ['./search-menu.component.scss']
})
export class SearchMenuComponent implements OnInit {

  constructor(
    private host: ElementRef,
    private socketService: SocketService
  ) {}
  
  ngOnInit() {
    this.socketService.emit('getTagsPopularity', null);
    this.socketService.on('getTagsPopularityResponse', (response)=>{
      this.tagPopularityObject = response;
    });
  }

  private tagPopularityObject = null;
  private isVisible:boolean = true;

  toggleVisibility(){
    this.isVisible = !this.isVisible;
  }
  showTagsSuggestion(whatUserTyped:string){
    // TODO:  
    
    //console.log(whatUserTyped)
  }
}