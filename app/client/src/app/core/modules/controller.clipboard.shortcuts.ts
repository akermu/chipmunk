import { EventEmitter                   } from '@angular/core';
import {configuration as Configuration  } from "./controller.config";
import {events as Events                } from "./controller.events";

const EVENTS = {
    keydown : 'keydown',
    paste   : 'paste',
    copy    : 'copy'
};

type ClipboardKeysEvent = {
    event       : KeyboardEvent | ClipboardEvent,
    selection?  : Selection,
    text?       : string
};

class ClipboardShortcuts {

    public onCopy       : EventEmitter<ClipboardKeysEvent>  = new EventEmitter();
    public onSelectAll  : EventEmitter<KeyboardEvent>       = new EventEmitter();
    public onPaste      : EventEmitter<ClipboardKeysEvent>  = new EventEmitter();

    private silence     : boolean   = false;

    constructor(){
        [   Configuration.sets.SYSTEM_EVENTS.SHORTCUTS_SILENCE_ON,
            Configuration.sets.SYSTEM_EVENTS.SHORTCUTS_SILENCE_OFF
        ].forEach((handle: string)=>{
            this['on' + handle] = this['on' + handle].bind(this);
            Events.bind(handle, this['on' + handle]);
        });
        this.onKeyDown  = this.onKeyDown.bind(this);
        this.onWinPaste = this.onWinPaste.bind(this);
        document.addEventListener(EVENTS.keydown,   this.onKeyDown);
        document.addEventListener(EVENTS.paste,     this.onWinPaste);
    }

    destroy(){
        [   Configuration.sets.SYSTEM_EVENTS.SHORTCUTS_SILENCE_ON,
            Configuration.sets.SYSTEM_EVENTS.SHORTCUTS_SILENCE_OFF
        ].forEach((handle: string)=>{
            Events.unbind(handle, this['on' + handle]);
        });
        document.removeEventListener(EVENTS.keydown,    this.onKeyDown);
        document.removeEventListener(EVENTS.paste,      this.onWinPaste);
    }

    private onKeyDown(event: KeyboardEvent){
        if (this.silence || event.key === '') {
            return false;
        }
        if ((event.ctrlKey || event.metaKey) && ~['KeyC'].indexOf(event.code)){
            return this.onCopy.emit({ event: event, selection: window.getSelection()});
        }
        if ((event.ctrlKey || event.metaKey) && ~['KeyX'].indexOf(event.code)){
            return this.onCopy.emit({ event: event, selection: window.getSelection()});
        }
        if ((event.ctrlKey || event.metaKey) && ~['KeyA'].indexOf(event.code)){
            return this.onSelectAll.emit(event);
        }
    }

    public copyText(text: string){
        const selection         = window.getSelection();
        const element           = document.createElement('P');
        element.style.opacity   = '0.0001';
        element.style.position  = 'absolute';
        element.style.width     = '1px';
        element.style.height    = '1px';
        element.style.overflow  = 'hidden';
        element.innerHTML       = text.replace(/\r?\n|\r/gi, '</br>');
        document.body.appendChild(element);
        const range             = document.createRange();
        range.selectNode(element);
        selection.empty();
        selection.addRange(range);
        this.doCopy();
        selection.empty();
        document.body.removeChild(element);
    }

    public doCopy(){
        document.execCommand('copy');
    }

    public doPaste(){
        document.execCommand('paste');
    }

    private onSHORTCUTS_SILENCE_OFF(){
        this.silence = false;
    }

    private onSHORTCUTS_SILENCE_ON(){
        this.silence = true;
    }

    private onWinPaste(event: ClipboardEvent){
        return !this.silence  ? this.onPaste.emit({ event: event, text: event.clipboardData.getData('text') }) : false;
    }

}

//const clipboardShortcuts = new ClipboardShortcuts();

export { ClipboardShortcuts, ClipboardKeysEvent };