import { Injectable } from '@angular/core'
import { SettingsTabProvider } from 'tabby-settings'

import { SerialTimestampSettingsTabComponent } from './settingsTab.component'

/** @hidden */
@Injectable()
export class SerialTimestampSettingsTabProvider extends SettingsTabProvider {
    id = 'timestamp'
    icon = 'paperclip'
    title = 'Serial Timestamp'

    getComponentType (): any {
        return SerialTimestampSettingsTabComponent
    }
}
