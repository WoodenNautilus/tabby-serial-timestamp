import { Component } from '@angular/core'
import { ConfigService } from 'tabby-core'

/** @hidden */
@Component({
    template: require('./settingsTab.component.pug'),
})
export class SerialTimestampSettingsTabComponent {
    timestamps = [
        'None',
        'dd/mm/yyyy hh:mm:ss.SSS',
        'mm/dd/yyyy hh:mm:ss.SSS',
        'ISO 8601',
    ]

    constructor (
        public config: ConfigService,
    ) { }
}
