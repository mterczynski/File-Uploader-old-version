import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ElementRef } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { SearchMenuComponent } from './components/search-menu/search-menu.component';
import { AddFileMenuComponent } from './components/add-file-menu/add-file-menu.component';
import { ListOfFilesComponent } from './components/list-of-files/list-of-files.component';
import { NewFileNotifierComponent } from './components/new-file-notifier/new-file-notifier.component';
// --- Services: ---
import { SocketService } from '../app/services/socket.service';
import { FileService } from '../app/services/file.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SearchMenuComponent,
    AddFileMenuComponent,
    ListOfFilesComponent,
    NewFileNotifierComponent,
  ],
  imports: [
    BrowserModule,
  ],
  providers: [
    SocketService,
    ListOfFilesComponent,
    FileService
    //ElementRef
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
