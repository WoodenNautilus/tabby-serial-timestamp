import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import TabbyCoreModule, { ConfigProvider } from 'tabby-core'
import { SettingsTabProvider } from 'tabby-settings'
// import SessionMiddleware from 'tabby-core'

import { SerialTimestampConfigProvider } from './configProvider'
import { SerialTimestampSettingsTabProvider } from './settingsTabProvider'
import { SerialTimestampSettingsTabComponent } from './settingsTab.component'
// import { SerialTimestampSessionMiddleware } from './sessionMiddleware'


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TabbyCoreModule,
    ],
    providers: [
        { provide: ConfigProvider, useClass: SerialTimestampConfigProvider, multi: true },
        { provide: SettingsTabProvider, useClass: SerialTimestampSettingsTabProvider, multi: true },
        // { provide: SessionMiddleware, useClass: SerialTimestampSessionMiddleware, multi: true },
    ],
    entryComponents: [
        SerialTimestampSettingsTabComponent,
    ],
    declarations: [
        SerialTimestampSettingsTabComponent,
    ],
})
export default class SerialTimestampModule { }
