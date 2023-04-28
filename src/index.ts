import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import TabbyCoreModule, { ConfigProvider } from 'tabby-core'
import { SettingsTabProvider } from 'tabby-settings'
import { TerminalDecorator } from 'tabby-terminal'

import { SerialTimestampConfigProvider } from './configProvider'
import { SerialTimestampSettingsTabProvider } from './settingsTabProvider'
import { SerialTimestampSettingsTabComponent } from './settingsTab.component'
import { SerialTimestampDecorator } from './terminalDecorator'


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TabbyCoreModule,
    ],
    providers: [
        { provide: ConfigProvider, useClass: SerialTimestampConfigProvider, multi: true },
        { provide: SettingsTabProvider, useClass: SerialTimestampSettingsTabProvider, multi: true },
        { provide: TerminalDecorator, useClass: SerialTimestampDecorator, multi: true },
    ],
    entryComponents: [
        SerialTimestampSettingsTabComponent,
    ],
    declarations: [
        SerialTimestampSettingsTabComponent,
    ],
})
export default class SerialTimestampModule { }
