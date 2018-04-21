import { FileReaderEventTarget } from './FileReaderEventTarget';

export interface FileReaderEvent extends Event {
    target: FileReaderEventTarget;
}