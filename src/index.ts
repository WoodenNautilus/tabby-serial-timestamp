import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import TabbyCoreModule, { ConfigProvider, HotkeyProvider, TabContextMenuItemProvider } from 'tabby-core'
import { TerminalDecorator } from 'tabby-terminal'
import { SettingsTabProvider } from 'tabby-settings'

import { SerialTimestampConfigProvider } from './configProvider'
import { SerialTimestampSettingsTabProvider } from './settingsTabProvider'
import { SerialTimestampSettingsTabComponent } from './settingsTab.component'
import { ClippyDecorator } from './terminalDecorator'
import { ClippyHotkeyProvider } from './hotkeyProvider'
import { ClippyContextMenuProvider } from './contextMenu'

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TabbyCoreModule,
    ],
    providers: [
        { provide: TabContextMenuItemProvider, useClass: ClippyContextMenuProvider, multi: true },
        { provide: HotkeyProvider, useClass: ClippyHotkeyProvider, multi: true },
        { provide: ConfigProvider, useClass: SerialTimestampConfigProvider, multi: true },
        { provide: SettingsTabProvider, useClass: SerialTimestampSettingsTabProvider, multi: true },
        { provide: TerminalDecorator, useClass: ClippyDecorator, multi: true },
    ],
    entryComponents: [
        SerialTimestampSettingsTabComponent,
    ],
    declarations: [
        SerialTimestampSettingsTabComponent,
    ],
})
export default class ClippyModule { }
