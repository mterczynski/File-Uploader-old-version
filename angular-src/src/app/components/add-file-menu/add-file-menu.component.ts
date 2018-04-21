// --- @angular/core imports: ---
import { Component, OnInit, ViewChild  } from '@angular/core';
// --- Interfaces: --- 
import { FileReaderEvent } from '../../interfaces/FileReaderEvent';
import { FileReaderEventTarget } from '../../interfaces/FileReaderEventTarget';
// --- Services: ---
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-add-file-menu',
  templateUrl: './add-file-menu.component.html',
  styleUrls: ['./add-file-menu.component.scss']
})
export class AddFileMenuComponent implements OnInit {

  constructor(
    private socketService: SocketService, 
  ) {}

  ngOnInit() {
    this.socketService.on('readyToUpload', (data)=>{

      this.filePath = data.filePath;
      this.changeLoadedPercentage(0);
      const Place = data.place; //The Next Blocks Starting Position
      const selectedFile = this.getSelectedFile();
      let NewFile; //The Variable that will hold the new Block of Data
      if(selectedFile.webkitSlice) 
          NewFile = this.getSelectedFile().webkitSlice(Place, Place + Math.min(524288, (selectedFile.size-Place)));
      else if(selectedFile.mozSlice)
          NewFile = selectedFile.mozSlice(Place, Place + Math.min(524288, (selectedFile.size-Place)));
      else if(selectedFile.slice)
          NewFile = selectedFile.slice(Place, Place + Math.min(524288, (selectedFile.size-Place)));
      this.fileReader.readAsBinaryString(NewFile)
    });
    this.socketService.on('moreData', (data)=>{
        this.changeLoadedPercentage(data['Percent']);
        const Place = data['Place'] * 524288; //The Next Blocks Starting Position
        const selectedFile = this.getSelectedFile();
        let NewFile; //The Variable that will hold the new Block of Data
        if(selectedFile.webkitSlice) 
            NewFile = this.getSelectedFile().webkitSlice(Place, Place + Math.min(524288, (selectedFile.size-Place)));
        else if(selectedFile.mozSlice)
            NewFile = selectedFile.mozSlice(Place, Place + Math.min(524288, (selectedFile.size-Place)));
        else if(selectedFile.slice)
            NewFile = selectedFile.slice(Place, Place + Math.min(524288, (selectedFile.size-Place)));
        this.fileReader.readAsBinaryString(NewFile)
    });
    this.socketService.on("finishedUploading",(response)=>{
      // alert(this.socketService.getServerName() + "/" + response.path);
      this.isUploading = false;
      if(response.success){
        this.successMessage.nativeElement.classList.remove("successMessage--hidden");
        this.uploadButton.nativeElement.classList.add("uploadButton--hidden");
        this.tagInput.nativeElement.value = "";
        this.fileInput.nativeElement.value = "";
        this.saveAsInput.nativeElement.value = "";
        this.dragAndDropMessage.nativeElement.innerHTML = "Drag and drop<br>(or click)"; 
      } else {
        alert('Something went wrong :/');
        // TODO: popup
       // this.successMessage.nativeElement.classList.add("successMessage--hidden");
      }
    });
    this.socketService.on("startUploadError",(data)=>{
      this.isUploading = false;
      this.loadedPercentage = 0;
      this.uploadButton.nativeElement.classList.add("uploadButton--hidden");

      this.uploadError.nativeElement.classList.remove("errorMessage--hidden");
      this.uploadErrorMessage.nativeElement.innerHTML = data;
    });
  }

  private readonly fileReader = new FileReader();
  public isUploading: boolean = false; // public only for build error workaround
  private loadedPercentage = 0;
  private filePath = null;

  //--- DOM elements: ---
  @ViewChild('saveAsLabel') saveAsLabel: {nativeElement:HTMLDivElement};
  @ViewChild('saveAsInput') saveAsInput: {nativeElement:HTMLInputElement};
  @ViewChild('addTagsLabel') addTagsLabel: {nativeElement:HTMLDivElement};
  @ViewChild('fileInput') fileInput: {nativeElement:any}; // no typescript support for File.mozSlice (Firefox 29 and earlier)
  @ViewChild('dragAndDropMessage') dragAndDropMessage: {nativeElement:HTMLDivElement};
  @ViewChild('tagInput') tagInput: {nativeElement:HTMLInputElement};
  @ViewChild('uploadButton') uploadButton: {nativeElement:HTMLButtonElement};
  @ViewChild('successMessage') successMessage: {nativeElement:HTMLSpanElement};
  @ViewChild('tagHintMessageBox') tagHintMessageBox: {nativeElement:HTMLDivElement};

  @ViewChild('uploadError') uploadError: {nativeElement:HTMLSpanElement};
  @ViewChild('uploadErrorMessage') uploadErrorMessage: {nativeElement:HTMLSpanElement};

  private changeLoadedPercentage(newPercentage:number){
    this.loadedPercentage = Math.floor(newPercentage);
  }
  
  private getSelectedFile(){
    return this.fileInput.nativeElement.files[0];
  }

  upload(){ // public only for build error workaround
    let uploadedFileName = this.saveAsInput.nativeElement.value;
    if(this.isUploading){
      // alert("please wait")
      return;
    }
    if(!this.fileInput.nativeElement.files[0]){
      // alert("no file selected");
      return;
    }
    const selectedFile = this.fileInput.nativeElement.files[0];

    const tags = this.tagInput.nativeElement.value.replace(/ /g,"").replace(/#/g,"").split(",").filter((tag)=>tag!='');

    this.fileReader.onload = (event:FileReaderEvent)=>{
      //TODO add filePath to sent data:
      // TODO input saveAsInput value can change during upload
      this.socketService.emit('upload', {name: uploadedFileName, data: event.target.result, filePath: this.filePath});
    }
    this.socketService.emit('startUpload', {name: uploadedFileName, size: selectedFile.size, tags });
    this.isUploading = true;
    this.uploadButton.nativeElement.classList.add("uploadButton--hidden");
  }
  /*private tagInputKeypress(event){

    // defaultCharacters is an Array of characters that can have be used in tag input, and have no special behaviour


    const defaultKeys = [
      " ",
    ]

    // 1-9:
    for(let i=48; i<=57; i++){
      defaultKeys.push(String.fromCharCode(i));
    }
    // uppercase A-Z:
    for(let i=65; i<=90; i++){
      defaultKeys.push(String.fromCharCode(i));
    }
    // lowercase a-z:
    for(let i=97; i<=122; i++){
      defaultKeys.push(String.fromCharCode(i));
    }

    if(event.key != "Backspace"){
      event.preventDefault();
    } else {
      return;
    }
    
    console.log(event);
    console.log(event.keyCode);
    console.log(event.key)

    if(defaultKeys.includes(event.key)){
      this.tagInput.nativeElement.value += event.key.toLowerCase();
    } else {
      let characterReplacement = "";
      switch(event.key.toLowerCase()){

        case ",":
          characterReplacement = ", "
          break;
        // PL characters to EU characters:
        case "ą":
          characterReplacement = "a";
          break;  
        case "ć":
          characterReplacement = "c";
          break; 
        case "ę":
          characterReplacement = "ę";
          break; 
        case "ł":
          characterReplacement = "l";
          break; 
        case "ń":
          characterReplacement = "n";
          break; 
        case "ó":
          characterReplacement = "o";
          break; 
        case "ś":
          characterReplacement = "s";
          break; 
        case "ź":
        case "ż":
          characterReplacement = "z";
          break; 
      }
      this.tagInput.nativeElement.value += characterReplacement;
    }
  }*/
  tagInputKeydown(event){ // public only for build error workaround
    const tagVal = this.tagInput.nativeElement.value;
   // event.preventDefault();
    let newKey = event.key;
    this.uploadError.nativeElement.classList.add("errorMessage--hidden");
    this.uploadButton.nativeElement.classList.remove("uploadButton--hidden");

    // TODO add validation:

   // if(event.key.length == 1 && event.key != event.key.toLowerCase()){

    //}  
  }
  onDragAndDropChange(event){ // public only for build error workaround

    if(!event.target.files[0]){
      this.dragAndDropMessage.nativeElement.innerHTML = "Drag and drop<br>(or click)"; 
      return;
    }
    
    this.dragAndDropMessage.nativeElement.innerHTML = event.target.files[0].name;
    this.saveAsInput.nativeElement.value = event.target.files[0].name;

    this.successMessage.nativeElement.classList.add("successMessage--hidden");
    this.uploadButton.nativeElement.classList.remove("uploadButton--hidden");
  }

  private displayNoneTimeout;

  onAddTagsInputHelperMouseOver(){ // public only for build error workaround
    this.tagHintMessageBox.nativeElement.classList.add("messageBox--active");
    this.tagHintMessageBox.nativeElement.classList.remove("messageBox--displayNone");
    clearTimeout(this.displayNoneTimeout);
  }
  onAddTagsInputHelperMouseLeave(){ // public only for build error workaround
    this.tagHintMessageBox.nativeElement.classList.remove("messageBox--active");
    this.displayNoneTimeout = setTimeout(()=>{
      this.tagHintMessageBox.nativeElement.classList.add("messageBox--displayNone");
    },300);
  }
}
