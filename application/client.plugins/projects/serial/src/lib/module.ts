import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarVerticalComponent } from './views/sidebar.vertical/component';
import { SidebarVerticalPortInfoComponent } from './views/sidebar.vertical/port.listed/component';
import { SidebarVerticalPortConnectedComponent } from './views/sidebar.vertical/port.connected/component';
import { SidebarVerticalPortOptionsReadComponent } from './views/sidebar.vertical/port.options.read/component';
import { SidebarVerticalPortOptionsWriteComponent } from './views/sidebar.vertical/port.options.write/component';
import { PrimitiveModule } from 'logviewer-client-primitive';

const CComponents = [
    SidebarVerticalComponent,
    SidebarVerticalPortInfoComponent,
    SidebarVerticalPortConnectedComponent,
    SidebarVerticalPortOptionsReadComponent,
    SidebarVerticalPortOptionsWriteComponent
];
@NgModule({
    entryComponents: [ ...CComponents ],
    declarations: [ ...CComponents ],
    imports: [ CommonModule, FormsModule, PrimitiveModule ],
    exports: [ ...CComponents ]
})

export class PluginModule {

    private _api: string | undefined;

    public setAPI(api: any) {
        this._api = api;
    }

}