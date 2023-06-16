import { Injectable } from '@angular/core';
declare var swal;
export enum PopupType {
    SUCCESS,
    ERROR,
    WARNING,
    INFO,
    QUESTION
}
@Injectable()
export class PopupProviderService {
    constructor() {
    }

    public QuestionMessageHtml = (titleHtml: string, popupType: PopupType,
        confirmText: string, cancelText: string, htmlString: string,
        confirmCallBack: () => void, cancelCallBack: () => void,
        onFinishCallBack: () => void = () => { }) => {
        swal({
            title: titleHtml,
            type: PopupType[popupType].toLowerCase(),
            html: htmlString,
            showCloseButton: false,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText: confirmText,
            cancelButtonText: cancelText,
        }).then(() => {
            confirmCallBack();
            onFinishCallBack();
        }, () => {
            cancelCallBack();
            onFinishCallBack();
        });
    }
    public SimpleMessage = (title: string, message: string, popupType: PopupType, callback: () => void = () => { }): void => {
        swal(title, message, PopupType[popupType].toLowerCase()).then(() => callback());
    }
    public QuestionMessage = (title: string, message: string, popupType: PopupType,
        confirmText: string, cancelText: string,
        confirmCallBack: () => void, cancelCallBack: () => void,
        onFinishCallBack: () => void = () => { }) => {
        swal({
            title: title, text: message,
            type: PopupType[popupType].toLowerCase(), showCancelButton: true, confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: confirmText,
            cancelButtonText: cancelText,
        }).then(() => {
            confirmCallBack();
            onFinishCallBack();
        }, () => {
            cancelCallBack();
            onFinishCallBack();
        });
    }
}