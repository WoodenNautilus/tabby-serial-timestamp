import { Component } from '@angular/core'
import { ConfigService } from 'tabby-core'

/** @hidden */
@Component({
    template: require('./settingsTab.component.pug'),
})
export class SerialTimestampSettingsTabComponent {
    timestamps = [
        'None',
        'dd/mm/yyyy hh:mm:ss:SSS',
        'mm/dd/yyyy hh:mm:ss:SSS',
        'yyyy/mm/dd hh:mm:ss:SSS',
    ]

    constructor (
        public config: ConfigService,
    ) { }
}
