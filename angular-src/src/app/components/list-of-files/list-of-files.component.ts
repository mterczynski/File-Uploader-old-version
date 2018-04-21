import { Component, OnInit, ElementRef, ApplicationRef  } from '@angular/core';

import { iconDependencies } from '../../../globalVariables/iconDependencies';
// Interfaces:
import { FileModel } from '../../interfaces/FileModel';
import { FileFromServer } from '../../interfaces/FileFromServer';
// Services:
import { SocketService } from '../../services/socket.service';
import { FileService } from '../../services/file.service';

import { Observer } from 'rxjs';

@Component({
  selector: 'app-list-of-files',
  templateUrl: './list-of-files.component.html',
  styleUrls: ['./list-of-files.component.scss']
})
export class ListOfFilesComponent implements OnInit {

    constructor(
        private mainElement: ElementRef, 
        private applicationRef: ApplicationRef,
        private socketService: SocketService,
        private fileService: FileService
    ) { }

    ngOnInit(){
        // get file list from server:
        this.socketService.on("getListOfFiles",(files:FileFromServer[])=>{
            files.map((file)=>{
                this.addFileToList(file);
            });
            this.applicationRef.tick();
        });
        this.socketService.on("finishedUploading",(response)=>{

          if(response.success){
            // TODO refresh files, then add
            this.fileService.refreshFiles();

            this.addFileToList({
                downloadCount:0,
                extension: response.extension,
                name: response.fileName,
                path: response.path,
                size: response.written,
                tags: response.tags,
                uploadDate: response.uploadDate
            });

          } else {
            alert('Something went wrong with uploaded file :/');
            // TODO: popup
            // this.successMessage.nativeElement.classList.add("successMessage--hidden");
          }
        });
        this.socketService.emit("getListOfFiles",null);    

        this.fileService.getFileSubject().subscribe((data)=>{
            this.addFileToList({
                downloadCount:0,
                extension: data.extension,
                name: data.fileName,
                path: data.path,
                size: data.written,
                tags: data.tags,
                uploadDate: data.uploadDate
            });
        });
    }
    // Note: all new files must go through addFileToList function

    files: FileModel[] = []; // public only for build error workaround
    
    matchExtension(ext){
        let extensionImageSrc = "assets/images/extensionIcons/";
        const matchedExtensions = [];
        iconDependencies.map((icon)=>{
            icon.extensions.map((extension)=>{
                if(ext == extension){
                    matchedExtensions.push(extension);
                }
            });
        });
        if(matchedExtensions.length == 0){
            extensionImageSrc += "default_file.svg";
        }
        else{
            const longestExtension = matchedExtensions.sort(function (a, b) { return b.length - a.length; })[0];
            let hasFinishedSearching = false;
            iconDependencies.map((icon)=>{
                if(hasFinishedSearching){
                    return;
                }
                icon.extensions.map((extension)=>{
                    if(extension == longestExtension){
                        extensionImageSrc += "file_type_" + icon.icon + ".svg";
                        hasFinishedSearching = true;
                        return;
                    }
                });
            });
        }
        if(ext.split('.').length > 1 && extensionImageSrc.endsWith("default_file.svg")){
            const arr = ext.split('.');
            arr.shift();
            return this.matchExtension(arr.join().replace(new RegExp(",","g"),"."));
        }
        return extensionImageSrc;
    }

    addFileToList(fileFromServer:FileFromServer): void{

        function bytesToSize(bytes) {
            const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
            if (bytes == 0) {return '0 B'};
            const i = Math.floor(Math.floor(Math.log(bytes) / Math.log(1024)));
            return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
        };

        function shortenViews(views: number) {
            const sizes = ['', 'K', 'M', 'G', 'T'];
            if (views == 0) {return '0'};
            const i = Math.floor(Math.floor(Math.log(views) / Math.log(1000)));
            return Math.round(views / Math.pow(1000, i)) + '' + sizes[i];
        };
        let uploadDateNumber:any = fileFromServer.uploadDate;
        let uploadDate:Date = new Date(uploadDateNumber); // passing Number to new Date constructor gives error
        let days:string = uploadDate.getDate() + "";
        let months:string = uploadDate.getMonth()+1+"";
        const years:number = uploadDate.getFullYear();

        if(days.length == 1){days = "0" + days};
        if(months.length == 1){months = "0" + months};
        const dateString = days + "." + months + "." + years;
        
        // let extensionImageSrc = "assets/images/extensionIcons/";
        // const matchedExtensions = [];
        // iconDependencies.map((icon)=>{
        //     icon.extensions.map((extension)=>{  
        //         if(fileFromServer.extension == extension){
        //             matchedExtensions.push(extension);
        //         }
        //     });
        // });
        // if(matchedExtensions.length == 0){
        //     extensionImageSrc += "default_file.svg";
        // }
        // else{
        //     const longestExtension = matchedExtensions.sort(function (a, b) { return b.length - a.length; })[0];
        //     let hasFinishedSearching = false;
        //     iconDependencies.map((icon)=>{
        //         if(hasFinishedSearching){
        //             return;
        //         }
        //         icon.extensions.map((extension)=>{
        //             if(extension == longestExtension){
        //                 extensionImageSrc += "file_type_" + icon.icon + ".svg";
        //                 hasFinishedSearching = true;
        //                 return;
        //             }
        //         });
        //     });
        // }
        
        const fileToAdd: FileModel = {
            name: fileFromServer.name,
            dateString: dateString,
            shortenedDownloadCount: shortenViews(fileFromServer.downloadCount),
            tags: fileFromServer.tags,
            shortenedSize: bytesToSize(fileFromServer.size),
            extensionImageSrc: this.matchExtension(fileFromServer.extension),
            path: fileFromServer.path,
            extension: fileFromServer.extension
        };

        this.files.unshift(fileToAdd);
    }
}
