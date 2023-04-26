import { Injectable } from '@angular/core'
import { SettingsTabProvider } from 'tabby-settings'

import { SerialTimestampSettingsTabComponent } from './settingsTab.component'

/** @hidden */
@Injectable()
export class SerialTimestampSettingsTabProvider extends SettingsTabProvider {
    id = 'timestamp'
    icon = 'clock' // defined in tabby-core/src/icons.json
    title = 'Serial Timestamp'

    getComponentType (): any {
        return SerialTimestampSettingsTabComponent
    }
}
